
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { DISCOUNT_CODES, PROCESS_CONTENT } from '../content';
import { isComplexPrice } from '../utils/price';
import { DecorationMode, DecorationPackage, PresetConfig } from '../types';

// Define structure for an order item
export interface OrderItem {
  category: string;
  name: string;
  priceStr: string;
  price: number;
  multiplier?: number; // Support for structure multiplier
}

export interface SizeItem extends OrderItem {
  isSmallSize: boolean;
}

// Rush Item remains separate
export interface RushItem {
  id: string;
  name: string;
  multiplier: number; // e.g. 0.1 for 10%
  feeStr: string;
}

export interface PackagingItem {
  title: string;
  price: number;
  tag: string;
}

// Fluid Strategy Type
export interface FluidSelection {
  strategyId: 'buddha' | 'self' | 'surprise' | 'blindbox';
  strategyTitle: string;
  description: string;
  materials?: string[]; // for Self-Will
  note?: string; // for Buddha input
}

// Define Discount Rule Structure
export interface DiscountRule {
  code: string;
  type: 'percent' | 'fixed' | 'threshold';
  value: number; // For percent: 0.8, For fixed/threshold: amount in rmb
  threshold?: number; // Only for threshold type
  exclusive: boolean; // limit/exclusive flag
  label: string;
  tag: string;
}

interface BreakdownDetails {
  baseTotal: number;
  craftMultiplier: number;
  rawAddonsTotal: number;
  addonDiscountMultiplier: number; // 0.5 if small size, else 1
  addonTotal: number;
  subTotal: number; // Before rush/pack
  discountAmount: number; // Amount saved by code
  rushFeeAmount: number;
  packagingFee: number;
  thresholdErrors: string[];
  totalSavings: number;
}

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface OrderContextType {
  selectedSize: SizeItem | null;
  selectedAddons: OrderItem[];
  selectedRush: RushItem | null;
  selectedPackaging: PackagingItem | null;
  selectedFluid: FluidSelection | null;
  
  decorationMode: DecorationMode;
  selectedDecorationPackage: DecorationPackage | null;

  appliedDiscounts: DiscountRule[];
  isModalOpen: boolean;
  consultationMode: boolean; 
  discountNotification: Notification | null;

  selectSize: (item: any) => void;
  // selectCraft removed, use toggleAddon for structures too
  toggleAddon: (category: string, name: string, priceStr: string, priceNum: number, multiplier?: number) => void;
  removeAddon: (category: string, name: string) => void;
  clearAddons: () => void; // New method
  selectRush: (item: any) => void;
  selectPackaging: (item: any) => void;
  selectFluid: (fluid: FluidSelection | null) => void;
  
  setDecorationMode: (mode: DecorationMode) => void;
  selectDecorationPackage: (pkg: DecorationPackage | null) => void;

  clearOrder: () => void;
  loadPreset: (config: PresetConfig) => void; // New function
  addDiscount: (code: string) => void;
  removeDiscount: (code: string) => void;
  setConsultationMode: (mode: boolean) => void;
  toggleModal: (isOpen: boolean) => void;
  clearNotification: () => void;
  
  breakdown: BreakdownDetails;
  finalPrice: number;
  hasComplexItems: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSize, setSelectedSize] = useState<SizeItem | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<OrderItem[]>([]); // Handles both Structure and Decorations for Path B
  const [selectedRush, setSelectedRush] = useState<RushItem | null>(null);
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingItem | null>(null);
  const [selectedFluid, setSelectedFluid] = useState<FluidSelection | null>(null);
  
  // New States for Two-Path Strategy
  const [decorationMode, setDecorationMode] = useState<DecorationMode>('package');
  const [selectedDecorationPackage, setSelectedDecorationPackage] = useState<DecorationPackage | null>(null);

  const [appliedDiscounts, setAppliedDiscounts] = useState<DiscountRule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultationMode, setConsultationMode] = useState(false);
  const [discountNotification, setDiscountNotification] = useState<Notification | null>(null);

  const clearNotification = () => setDiscountNotification(null);

  // Discount Actions
  const addDiscount = (codeStr: string) => {
    const code = codeStr.trim().toUpperCase();
    if (!code) return;

    // Check if already applied
    if (appliedDiscounts.find(d => d.code === code)) {
      setDiscountNotification({ type: 'info', message: '这个优惠码已经使用啦' });
      return;
    }

    const rule = DISCOUNT_CODES.find(d => d.code === code) as DiscountRule | undefined;
    if (!rule) {
      setDiscountNotification({ type: 'error', message: '无效的优惠码' });
      return;
    }

    // Stacking Logic
    if (rule.exclusive) {
      setAppliedDiscounts([rule]);
      setDiscountNotification({ type: 'success', message: `大额优惠券不可叠加哦~ 已为您替换为: ${rule.label}` });
    } else {
      const hasExclusive = appliedDiscounts.some(d => d.exclusive);
      if (hasExclusive) {
        setDiscountNotification({ type: 'error', message: '当前已使用互斥优惠，无法叠加小红包' });
        return;
      }
      setAppliedDiscounts(prev => [...prev, rule]);
      setDiscountNotification({ type: 'success', message: `成功添加优惠: ${rule.label}` });
    }
  };

  const removeDiscount = (code: string) => {
    setAppliedDiscounts(prev => prev.filter(d => d.code !== code));
    setDiscountNotification(null);
  };

  // =================================================================
  // 💰 COMPLEX PRICING CALCULATOR
  // =================================================================
  const priceCalculation = useMemo(() => {
    // 1. Determine Base & Multiplier
    const basePrice = selectedSize ? selectedSize.price : 0;
    
    // Strict logic: If package mode, ignore custom addons. If custom mode, ignore package.
    
    let craftMultiplier = 1;
    let rawAddonsTotal = 0;

    if (decorationMode === 'package') {
      // Path A: Package Mode
      // Calculation: Base + Package Price
      // Note: Packages usually don't have multipliers unless defined, assuming 1 here.
      craftMultiplier = 1;
      rawAddonsTotal = selectedDecorationPackage ? selectedDecorationPackage.price : 0;
    } else {
      // Path B: Custom Mode (Buffet)
      // Calculation: (Base * MaxStructureMultiplier) + Sum(All Addon Prices)
      
      // Calculate Multiplier from Structure items in selectedAddons
      // We take the MAXIMUM multiplier if multiple are selected (e.g. Double Layer x2)
      // Standard items have multiplier 1 (undefined = 1)
      const structureItems = selectedAddons.filter(item => item.category === 'Structure');
      const maxMultiplier = structureItems.reduce((max, item) => Math.max(max, item.multiplier || 1), 1);
      
      craftMultiplier = maxMultiplier;
      
      // Sum all addon prices (including structure flat fees like +15r)
      rawAddonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
    }

    const baseTotal = basePrice * craftMultiplier;

    // 2. Addon Discount (Small Size 50% off decorations)
    const addonDiscountMultiplier = selectedSize?.isSmallSize ? 0.5 : 1;
    const addonTotal = rawAddonsTotal * addonDiscountMultiplier;
    const addonSavings = rawAddonsTotal - addonTotal;

    // 3. Subtotal before discount
    const preDiscountTotal = baseTotal + addonTotal;
    
    // 4. Apply Coupon Discounts
    let subTotal = preDiscountTotal;
    const thresholdErrors: string[] = [];

    const sortedDiscounts = [...appliedDiscounts].sort((a, b) => {
        const order = { percent: 1, fixed: 2, threshold: 3 };
        return order[a.type] - order[b.type];
    });

    sortedDiscounts.forEach(d => {
        const currentTotal = subTotal;
        
        if (d.type === 'percent') {
            subTotal = currentTotal * d.value;
        } else if (d.type === 'fixed') {
            subTotal = Math.max(0, currentTotal - d.value);
        } else if (d.type === 'threshold') {
            if (currentTotal >= (d.threshold || 0)) {
                subTotal = Math.max(0, currentTotal - d.value);
            } else {
                thresholdErrors.push(`还差 ¥${Math.floor((d.threshold || 0) - currentTotal)} 才能用【${d.label}】哦`);
            }
        }
    });

    // 5. Rush Fee
    const rushMultiplier = selectedRush ? selectedRush.multiplier : 0;
    const rushFeeAmount = Math.ceil(subTotal * rushMultiplier);

    // 6. Packaging Fee
    const packagingFee = selectedPackaging ? selectedPackaging.price : 0;

    // 7. Final
    const actualDiscountAmount = preDiscountTotal - subTotal;
    const totalSavings = addonSavings + actualDiscountAmount;
    const finalPrice = Math.floor(subTotal + rushFeeAmount + packagingFee);

    return {
      breakdown: {
        baseTotal,
        craftMultiplier,
        rawAddonsTotal,
        addonDiscountMultiplier,
        addonTotal,
        subTotal,
        discountAmount: actualDiscountAmount,
        rushFeeAmount,
        packagingFee,
        thresholdErrors,
        totalSavings
      },
      finalPrice
    };
  }, [selectedSize, selectedAddons, decorationMode, selectedDecorationPackage, selectedRush, selectedPackaging, appliedDiscounts]);

  const hasComplexItems = useMemo(() => {
    if (selectedSize && isComplexPrice(selectedSize.priceStr)) return true;
    if (selectedAddons.some(addon => isComplexPrice(addon.priceStr))) return true;
    if (selectedRush && isComplexPrice(selectedRush.feeStr)) return true;
    return false;
  }, [selectedSize, selectedAddons, selectedRush]);

  // Actions
  const selectSize = (item: any) => {
    setSelectedSize({
      category: 'Size',
      name: item.name,
      priceStr: item.price,
      price: item.priceNum,
      isSmallSize: item.isSmallSize || false
    });
    if (consultationMode) setConsultationMode(false);
  };

  const toggleAddon = (category: string, name: string, priceStr: string, priceNum: number, multiplier?: number) => {
    setSelectedAddons(prev => {
      const exists = prev.find(item => item.name === name && item.category === category);
      if (exists) {
        return prev.filter(item => item !== exists);
      } else {
        return [...prev, { category, name, priceStr, price: priceNum, multiplier }];
      }
    });
    if (consultationMode) setConsultationMode(false);
  };

  const removeAddon = (category: string, name: string) => {
    setSelectedAddons(prev => prev.filter(item => !(item.name === name && item.category === category)));
  };

  const clearAddons = () => {
    setSelectedAddons([]);
  };

  const selectRush = (item: any) => {
    // If item is null (clearing selection via logic)
    if (!item) {
        setSelectedRush(null);
        return;
    }
    
    // Toggle logic if clicking same item
    if (selectedRush?.name === item.name) {
      setSelectedRush(null);
    } else {
      setSelectedRush({
        id: item.id,
        name: item.name,
        multiplier: item.multiplier,
        feeStr: item.fee
      });
    }
  };

  const selectPackaging = (item: any) => {
    setSelectedPackaging({
      title: item.title,
      price: item.priceNum,
      tag: item.tag
    });
  };

  const selectFluid = (fluid: FluidSelection | null) => {
    setSelectedFluid(fluid);
  };

  const selectDecorationPackage = (pkg: DecorationPackage | null) => {
    setSelectedDecorationPackage(pkg);
  };

  const clearOrder = () => {
    setSelectedSize(null);
    setSelectedAddons([]);
    setSelectedDecorationPackage(null);
    setDecorationMode('package');
    setSelectedRush(null);
    setSelectedPackaging(null);
    setSelectedFluid(null);
    setAppliedDiscounts([]);
    setConsultationMode(false);
    setDiscountNotification(null);
  };
  
  // New Function: Load Preset from Product
  const loadPreset = (config: PresetConfig) => {
    clearOrder();
    
    // 1. Set Size
    const sizeItem = PROCESS_CONTENT.sizes.find(s => s.name === config.sizeName);
    if (sizeItem) {
        selectSize(sizeItem);
    }

    // 2. Set Fluid (Buddha style default for replica)
    selectFluid({
        strategyId: 'buddha',
        strategyTitle: '佛系选',
        description: '同款复刻',
        note: config.fluidDesc
    });

    // 3. Set Mode
    setDecorationMode(config.decorationMode);

    if (config.decorationMode === 'package' && config.packageName) {
        const pkg = PROCESS_CONTENT.packages.find(p => p.name === config.packageName);
        if (pkg) selectDecorationPackage(pkg as any); // Cast because of minor type mismatch in source
    } 
    else if (config.decorationMode === 'custom' && config.addonNames) {
        // Find each addon in PROCESS_CONTENT.customCategories
        config.addonNames.forEach(name => {
             // Search all categories
             const allCats = PROCESS_CONTENT.customCategories;
             let found = false;
             
             // Check Structure
             const structItem = allCats.structure.items.find(i => i.name === name);
             if (structItem) {
                 toggleAddon('Structure', structItem.name, structItem.price, structItem.priceNum, structItem.multiplier);
                 found = true;
             }

             if (!found) {
                // Check Enhancement
                 const enhanceItem = allCats.enhancement.items.find(i => i.name === name);
                 if (enhanceItem) {
                     toggleAddon('Visual Effect', enhanceItem.name, enhanceItem.price, enhanceItem.priceNum);
                     found = true;
                 }
             }

             if (!found) {
                // Check External
                 const extItem = allCats.external.items.find(i => i.name === name);
                 if (extItem) {
                     let cat = 'External';
                     if (name === '立体拼贴') cat = 'Collage';
                     if (name === '巴洛克堆叠') cat = 'Baroque';
                     toggleAddon(cat, extItem.name, extItem.price, extItem.priceNum);
                 }
             }
        });
    }
  };

  return (
    <OrderContext.Provider value={{
      selectedSize,
      selectedAddons, // Now contains structure items too
      selectedRush,
      selectedPackaging,
      selectedFluid,
      
      decorationMode,
      selectedDecorationPackage,

      appliedDiscounts,
      isModalOpen,
      consultationMode,
      discountNotification,
      
      selectSize,
      toggleAddon,
      removeAddon,
      clearAddons,
      selectRush,
      selectPackaging,
      selectFluid,
      
      setDecorationMode,
      selectDecorationPackage,
      
      clearOrder,
      loadPreset,
      addDiscount,
      removeDiscount,
      setConsultationMode,
      toggleModal: setIsModalOpen,
      clearNotification,
      
      breakdown: priceCalculation.breakdown,
      finalPrice: priceCalculation.finalPrice,
      hasComplexItems
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
