import React, { useState, useEffect } from 'react';
import { 
  Ruler, Palette, Wand2, Layers, 
  Hammer, Zap, Sun, Gem, Scissors, 
  Fingerprint, Eye, Sparkles, Moon, Coffee, Star, X, AlertTriangle, Truck, Camera, HelpCircle, Package, Check, ChevronDown, ZoomIn, Heart, Info, Circle
} from 'lucide-react';
import { PROCESS_CONTENT, SITE_STATUS, FULFILLMENT_CONTENT, CONSULTATION_CONTENT, SELF_WILL_MATERIALS } from '../content';
import { useOrder, FluidSelection } from '../contexts/OrderContext';

// Simple Lightbox Component for Process Images
const ProcessLightbox: React.FC<{ src: string; onClose: () => void }> = ({ src, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur animate-fade-in"
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/40">
        <X className="w-6 h-6" />
      </button>
      <img src={src} className="max-w-full max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
    </div>
  );
};

// Reusable Accordion Item
interface AccordionItemProps {
  id: string;
  isSelected: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  image?: string;
  priceTag?: string;
  isWishTrigger?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  id, isSelected, isOpen, onToggle, onSelect, title, subtitle, image, priceTag, isWishTrigger 
}) => {
  
  const handleImageClick = (e: React.MouseEvent, imgSrc: string) => {
    e.stopPropagation();
    const event = new CustomEvent('openProcessLightbox', { detail: { src: imgSrc } });
    window.dispatchEvent(event);
  };

  return (
    <div 
      className={`
        border rounded-xl mb-3 overflow-hidden transition-all duration-300 relative
        ${isSelected ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-200' : 'bg-white border-gray-200'}
      `}
    >
       <div 
         className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50/50"
         onClick={onSelect}
       >
          <div className="flex-1 pr-4">
             <div className="flex items-center gap-2 mb-1">
               <div className={`font-bold text-base ${isSelected ? 'text-primary-700' : 'text-gray-800'}`}>
                 {title}
               </div>
               {priceTag && <span className="text-sm font-bold text-primary-500">{priceTag}</span>}
               {isSelected && <Check className="w-4 h-4 text-primary-600" />}
             </div>
             {subtitle && <div className="text-xs text-gray-500 leading-tight">{subtitle}</div>}
             
             {isWishTrigger && (
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded font-bold">
                  <Star className="w-3 h-3 fill-current" /> 此规格含福利
                </div>
             )}
          </div>

          <button 
             onClick={(e) => { e.stopPropagation(); onToggle(); }}
             className={`p-2 rounded-full hover:bg-black/5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          >
             <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
       </div>

       <div 
         className={`
           overflow-hidden transition-[max-height] duration-500 ease-in-out
           ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
         `}
       >
          <div className="px-4 pb-4">
            {image ? (
              <div className="relative rounded-lg overflow-hidden h-48 w-full bg-gray-100 group border border-gray-100">
                <img src={image} alt="preview" className="w-full h-full object-cover" />
                <button 
                   onClick={(e) => handleImageClick(e, image)}
                   className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur hover:bg-black/70 transition-colors"
                >
                   <ZoomIn className="w-4 h-4" />
                </button>
                <div className="absolute inset-0 bg-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200">
                暂无预览图
              </div>
            )}
          </div>
       </div>
    </div>
  );
};


const Process: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'base' | 'fluid' | 'decor' | 'advanced'>('base');
  const [showWishModal, setShowWishModal] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  
  // Accordion State: Track which ID is open
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  // Fluid UI States
  const [buddhaInput, setBuddhaInput] = useState('');
  const [isSurpriseAnimating, setIsSurpriseAnimating] = useState(false);
  const [isSurpriseDone, setIsSurpriseDone] = useState(false);
  const [customMaterials, setCustomMaterials] = useState<Array<{id: string, name: string, img: string}>>([]);
  const [expandFluidCategory, setExpandFluidCategory] = useState<string | null>('base');

  // Hook into Order Context
  const { 
    selectedSize, selectedAddons, selectedCraft, selectedRush, selectedPackaging, selectedFluid,
    selectSize, selectCraft, toggleAddon, selectRush, selectPackaging, selectFluid,
    setConsultationMode, consultationMode, toggleModal
  } = useOrder();

  const {
    sectionTitle, sectionSubtitle, intro,
    sizes, sizeNote,
    fluids,
    decor,
    advanced
  } = PROCESS_CONTENT;

  const { isBusy } = SITE_STATUS;

  // Listen for custom lightbox event
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.src) {
        setLightboxSrc(customEvent.detail.src);
      }
    };
    window.addEventListener('openProcessLightbox', handler);
    return () => window.removeEventListener('openProcessLightbox', handler);
  }, []);

  // Sync Buddha Input with Context if re-entering
  useEffect(() => {
    if (selectedFluid?.strategyId === 'buddha' && selectedFluid.note) {
      setBuddhaInput(selectedFluid.note);
    }
    // If selected fluid is NOT surprise, reset the surprise animation state
    if (selectedFluid?.strategyId !== 'surprise') {
        setIsSurpriseDone(false);
        setIsSurpriseAnimating(false);
    }
  }, [selectedFluid]);

  const tabs = [
    { id: 'base', label: '1. 选画框', icon: <Ruler className="w-4 h-4" /> },
    { id: 'fluid', label: '2. 调流沙', icon: <Palette className="w-4 h-4" /> },
    { id: 'decor', label: '3. 加装饰', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'advanced', label: '4. 进阶玩法', icon: <Layers className="w-4 h-4" /> },
  ];

  const handleSizeClick = (item: any) => {
    selectSize(item);
    if (item.triggerWish) {
      setShowWishModal(true);
    }
  };

  const handleAddonToggle = (category: string, item: any) => {
    toggleAddon(category, item.name, item.price, item.priceNum);
  };
  
  const isAddonSelected = (name: string) => {
    return selectedAddons.some(addon => addon.name === name);
  };

  const handleAccordionToggle = (id: string) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  const getRushColor = (color: string) => {
    switch (color) {
      case 'purple': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'red': return 'bg-red-100 text-red-600 border-red-200';
      case 'blue': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // --- Fluid Logic Handlers ---

  const handleBuddhaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBuddhaInput(val);
    selectFluid({
      strategyId: 'buddha',
      strategyTitle: '佛系选',
      description: '由小狼调配',
      note: val
    });
  };

  // Toggle Logic for Surprise
  const handleSurpriseClick = () => {
    // If already selected, deselect (Toggle OFF)
    if (selectedFluid?.strategyId === 'surprise') {
        selectFluid(null);
        setIsSurpriseDone(false);
        setIsSurpriseAnimating(false);
        return;
    }

    // If not selected, start animation (Toggle ON)
    setIsSurpriseAnimating(true);
    setTimeout(() => {
      setIsSurpriseAnimating(false);
      setIsSurpriseDone(true);
      selectFluid({
        strategyId: 'surprise',
        strategyTitle: '开惊喜',
        description: '小狼的即兴创作'
      });
    }, 1500); // Shorter animation for snappier feel
  };

  const handleMaterialToggle = (mat: {id: string, name: string, img: string}) => {
    setCustomMaterials(prev => {
      const exists = prev.find(p => p.id === mat.id);
      let newMaterials;
      if (exists) {
        newMaterials = prev.filter(p => p.id !== mat.id);
      } else {
        newMaterials = [...prev, mat];
      }
      
      // Update Context
      selectFluid({
        strategyId: 'self',
        strategyTitle: '任性玩',
        description: `自选 ${newMaterials.length} 种材料`,
        materials: newMaterials.map(m => m.name)
      });
      return newMaterials;
    });
  };

  const getSelfWillCounterColor = (count: number) => {
    if (count > 5) return 'text-red-500 bg-red-50';
    if (count === 5) return 'text-orange-500 bg-orange-50';
    return 'text-gray-400 bg-gray-100';
  };

  const handleConsultationClick = () => {
    setConsultationMode(true);
    toggleModal(true);
  };

  return (
    <section id="process" className="py-24 bg-white relative overflow-hidden">
      {lightboxSrc && <ProcessLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            {sectionTitle}
            <span className="text-primary-400 font-light ml-2 text-2xl">{sectionSubtitle}</span>
          </h2>
          <p className="text-gray-500">{intro}</p>
        </div>

        {/* CONSULTATION MODE TRIGGER */}
        <div className="max-w-xl mx-auto mb-10">
          <button 
            onClick={handleConsultationClick}
            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border border-dashed ${consultationMode ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-100' : 'bg-white border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/50'}`}
          >
             <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 shrink-0">
               <HelpCircle className="w-6 h-6" />
             </div>
             <div className="text-left flex-1">
               <h3 className="font-bold text-gray-800">{CONSULTATION_CONTENT.title}</h3>
               <p className="text-xs text-gray-500">{CONSULTATION_CONTENT.desc}</p>
             </div>
             <div className="text-indigo-500 font-medium text-sm">
               {consultationMode ? '已激活' : '点击咨询'} &rarr;
             </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setOpenAccordionId(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-200 scale-105'
                  : 'bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-500'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px] mb-20">
          
          {/* TAB 1: SIZES (Refactored to Accordion) */}
          {activeTab === 'base' && (
            <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">画框：世界的基石</h3>
                <p className="text-gray-600 text-sm">点击条目选中，点击箭头展开查看比例参考。</p>
              </div>

              <div>
                {sizes.map((item, idx) => (
                  <AccordionItem 
                    key={idx}
                    id={`size-${idx}`}
                    isSelected={selectedSize?.name === item.name}
                    isOpen={openAccordionId === `size-${idx}`}
                    onToggle={() => handleAccordionToggle(`size-${idx}`)}
                    onSelect={() => handleSizeClick(item)}
                    title={item.name}
                    subtitle={item.desc}
                    image={item.image}
                    priceTag={item.price}
                    isWishTrigger={item.triggerWish}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">{sizeNote}</p>
            </div>
          )}

          {/* TAB 2: FLUIDS (INTERACTIVE REFACTOR) */}
          {activeTab === 'fluid' && (
            <div className="animate-fade-in space-y-6 max-w-3xl mx-auto">
               <div className="text-center mb-6">
                 <h3 className="text-2xl font-bold text-gray-800 mb-2">配方：魔法的灵魂</h3>
                 <p className="text-gray-600 text-sm">选择一种调配方式，开启你的定制之旅。</p>
               </div>

               {/* Strategy 1: Buddha Selection */}
               <div 
                  className={`bg-white border rounded-2xl p-6 transition-all duration-300 shadow-sm
                    ${selectedFluid?.strategyId === 'buddha' ? 'border-primary-500 ring-1 ring-primary-200' : 'border-gray-200'}
                  `}
                  onClick={() => {
                     // Always select Buddha if clicking main container
                     if (selectedFluid?.strategyId !== 'buddha') {
                        selectFluid({ strategyId: 'buddha', strategyTitle: '佛系选', description: '由小狼调配', note: buddhaInput });
                     }
                  }}
               >
                  <div className="flex items-center gap-3 mb-4">
                     <div className="text-3xl">{fluids.strategies[0].icon}</div>
                     <div>
                        <h4 className="font-bold text-gray-800">{fluids.strategies[0].title}</h4>
                        <p className="text-xs text-gray-500">{fluids.strategies[0].desc}</p>
                     </div>
                     {selectedFluid?.strategyId === 'buddha' && <Check className="w-5 h-5 text-primary-500 ml-auto" />}
                  </div>

                  {/* Input Field */}
                  <div className="relative group">
                    <input 
                      type="text"
                      value={buddhaInput}
                      onChange={handleBuddhaInput}
                      placeholder="例：蓝紫银，想要夜空流星划过的感觉..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 focus:scale-[1.02] transition-transform duration-300 placeholder-gray-400"
                    />
                    <div className="absolute right-3 top-3 text-gray-300 pointer-events-none group-focus-within:hidden">
                       <Palette className="w-4 h-4" />
                    </div>
                  </div>
               </div>

               {/* Strategy 2: Surprise (Blind Box) - Refactored for Full Animation/Toggle */}
               <div 
                   onClick={handleSurpriseClick}
                   className={`
                     relative bg-white border rounded-2xl p-6 cursor-pointer transition-all duration-500 overflow-hidden shadow-sm h-28 flex items-center justify-center
                     ${(isSurpriseDone || selectedFluid?.strategyId === 'surprise') 
                         ? 'border-red-400 shadow-xl bg-red-50' 
                         : 'hover:border-primary-200 border-gray-200 hover:bg-gray-50'}
                   `}
               >
                   {/* CONTENT */}
                   {(isSurpriseDone || isSurpriseAnimating || selectedFluid?.strategyId === 'surprise') ? (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center animate-fade-in w-full h-full">
                         {/* Giant pulsating heart background/foreground */}
                         <Heart className="w-32 h-32 text-red-500/20 absolute animate-pulse" fill="currentColor" />
                         <Heart className="w-16 h-16 text-red-500 fill-red-500 animate-bounce relative z-20 mb-2" />
                         <h4 className="text-lg font-bold text-red-600 relative z-20">感谢你的全然信任</h4>
                         {/* Checkmark indicator */}
                         <div className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-sm z-20">
                            <Check className="w-4 h-4 text-red-500" />
                         </div>
                      </div>
                   ) : (
                      // Default View
                      <div className="flex items-center gap-3 w-full justify-start">
                         <div className="text-3xl">{fluids.strategies[2].icon}</div>
                         <div className="text-left">
                            <h4 className="font-bold text-gray-800">{fluids.strategies[2].title}</h4>
                            <p className="text-xs text-gray-500">{fluids.strategies[2].desc}</p>
                         </div>
                      </div>
                   )}
               </div>

               {/* Strategy 3: Self-Will (Custom) */}
               <div 
                 className={`
                   bg-white border rounded-2xl p-6 transition-all duration-300 shadow-sm relative
                   ${selectedFluid?.strategyId === 'self' ? 'border-primary-500 ring-1 ring-primary-200' : 'border-gray-200'}
                 `}
               >
                  <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => selectFluid({ strategyId: 'self', strategyTitle: '任性玩', description: '自选材料', materials: customMaterials.map(m => m.name) })}>
                     <div className="text-3xl">{fluids.strategies[1].icon}</div>
                     <div>
                        <h4 className="font-bold text-gray-800">{fluids.strategies[1].title}</h4>
                        <p className="text-xs text-gray-500">{fluids.strategies[1].desc}</p>
                     </div>
                     {selectedFluid?.strategyId === 'self' && <Check className="w-5 h-5 text-primary-500 ml-auto" />}
                  </div>

                  {/* Slot Display */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                     <div className="flex justify-between items-center mb-3">
                       <span className="text-xs font-bold text-gray-400">配方槽</span>
                       <span className={`text-xs font-bold px-2 py-0.5 rounded ${getSelfWillCounterColor(customMaterials.length)}`}>
                         {customMaterials.length}/5
                         {customMaterials.length > 5 && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                       </span>
                     </div>
                     <div className="flex justify-center gap-3 mb-2">
                        {[0,1,2,3,4].map(i => (
                          <div 
                            key={i} 
                            className={`
                              w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] overflow-hidden bg-white
                              ${customMaterials[i] ? 'border-primary-400' : 'border-gray-200 border-dashed'}
                            `}
                          >
                             {customMaterials[i] ? (
                               <img src={customMaterials[i].img} className="w-full h-full object-cover" />
                             ) : (
                               <span className="text-gray-300">{i+1}</span>
                             )}
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-yellow-50 text-yellow-700 text-[10px] px-3 py-2 rounded-lg mb-4 flex items-start gap-2">
                     <Info className="w-3 h-3 shrink-0 mt-0.5" />
                     <span>* 温馨提示：本图仅为材料效果展示，并非最终定制布局。你的选择，将会被小狼融入你专属的设计中。</span>
                  </div>
                  
                  {/* Warning for > 5 */}
                  {customMaterials.length > 5 && (
                    <div className="bg-orange-50 text-orange-600 text-[10px] px-3 py-2 rounded-lg mb-4 flex items-start gap-2 animate-fade-in">
                       <HelpCircle className="w-3 h-3 shrink-0 mt-0.5" />
                       <span>小狼的创作建议：材料超过五种，可能会让背景的美感被些许遮盖哦。但如果你胸有成竹，请尽管突破界限！</span>
                    </div>
                  )}

                  {/* Material Picker */}
                  <div className="space-y-4">
                     {Object.entries(SELF_WILL_MATERIALS).map(([key, mats]) => {
                       const titleMap: Record<string, string> = { base: "基础色粉", pearl: "珠光粉", glitter: "亮片", special: "特殊填充物" };
                       return (
                         <div key={key}>
                            <button 
                              className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-2 hover:text-gray-800"
                              onClick={() => setExpandFluidCategory(expandFluidCategory === key ? null : key)}
                            >
                              {expandFluidCategory === key ? <ChevronDown className="w-3 h-3" /> : <span className="text-gray-300">▶</span>}
                              [+] {titleMap[key]}
                            </button>
                            
                            {expandFluidCategory === key && (
                              <div className="grid grid-cols-4 gap-2 animate-fade-in">
                                {mats.map(m => {
                                  const isSelected = customMaterials.some(cm => cm.id === m.id);
                                  return (
                                    <div 
                                      key={m.id} 
                                      onClick={() => handleMaterialToggle(m)}
                                      className={`
                                        cursor-pointer rounded-lg overflow-hidden border relative aspect-square group
                                        ${isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-100 hover:border-gray-300'}
                                      `}
                                    >
                                       <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                                       <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] p-1 truncate text-center">
                                         {m.name.split(' ')[1]}
                                       </div>
                                       {isSelected && (
                                         <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                                            <Check className="w-6 h-6 text-white drop-shadow-md" />
                                         </div>
                                       )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                         </div>
                       );
                     })}
                  </div>
                  
                  {/* Selected List Text */}
                  {customMaterials.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs">
                       <span className="text-gray-400">已选材料：</span>
                       <span className="text-gray-700 ml-1">
                          {customMaterials.map(m => m.name.split(' ')[1]).join('、')}
                       </span>
                    </div>
                  )}
               </div>

            </div>
          )}

          {/* TAB 3: DECOR (Mixed Layout: Accordion for large items) */}
          {activeTab === 'decor' && (
            <div className="animate-fade-in space-y-12 max-w-3xl mx-auto">
               
               {/* Visual Effects - Accordion */}
               <div className="space-y-4">
                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                   <Eye className="w-5 h-5 text-primary-500" /> 视觉特效 (可多选)
                 </h3>
                 <div>
                    {decor.visualEffects.map((item, idx) => (
                      <AccordionItem 
                        key={idx}
                        id={`effect-${idx}`}
                        isSelected={isAddonSelected(item.name)}
                        isOpen={openAccordionId === `effect-${idx}`}
                        onToggle={() => handleAccordionToggle(`effect-${idx}`)}
                        onSelect={() => handleAddonToggle('Visual Effect', item)}
                        title={item.name}
                        subtitle={item.desc}
                        image={item.image}
                        priceTag={item.price}
                      />
                    ))}
                 </div>
               </div>

               {/* Collage - Grid */}
               <div className="space-y-4">
                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                   <Scissors className="w-5 h-5 text-primary-500" /> 氛围拼贴 (可多选)
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {decor.collage.map((item, idx) => {
                      const selected = isAddonSelected(item.name);
                      return (
                        <div 
                          key={idx} 
                          onClick={() => handleAddonToggle('Collage', item)}
                          className={`
                            rounded-xl p-0 text-center cursor-pointer transition-all border overflow-hidden group
                            ${selected 
                              ? 'bg-primary-50 border-primary-400 shadow-sm transform -translate-y-1' 
                              : 'bg-gray-50 border-transparent hover:border-gray-200'
                            }
                          `}
                        >
                           <div className="h-24 bg-gray-200 overflow-hidden relative mb-2">
                              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />}
                              {selected && (
                                <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                                   <Check className="w-6 h-6 text-white" />
                                </div>
                              )}
                           </div>
                           <div className="px-3 pb-3">
                              <h4 className="font-bold text-gray-800 text-sm mb-1">{item.name}</h4>
                              <span className="block text-primary-500 font-bold text-xs mb-2">{item.price}</span>
                              <p className="text-xs text-gray-500 scale-90 leading-tight">{item.desc}</p>
                           </div>
                        </div>
                      );
                    })}
                 </div>
               </div>

               {/* Hidden Attributes - Accordion */}
               <div className="space-y-4">
                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                   <Moon className="w-5 h-5 text-primary-500" /> 魔法·隐藏属性 (可多选)
                 </h3>
                 <div>
                    {decor.hidden.map((item, idx) => (
                       <AccordionItem 
                        key={idx}
                        id={`hidden-${idx}`}
                        isSelected={isAddonSelected(item.name)}
                        isOpen={openAccordionId === `hidden-${idx}`}
                        onToggle={() => handleAccordionToggle(`hidden-${idx}`)}
                        onSelect={() => handleAddonToggle('Hidden', item)}
                        title={
                           <span className="flex items-center gap-2">
                              {item.iconType === 'moon' ? <Zap className="w-4 h-4 text-yellow-500" /> : <Sun className="w-4 h-4 text-orange-500" />}
                              {item.name}
                           </span>
                        }
                        subtitle={item.desc}
                        image={item.image}
                        priceTag={item.price}
                      />
                    ))}
                 </div>
               </div>

               {/* Magic Mirror */}
               <div 
                 onClick={() => handleAddonToggle('Special', decor.magicMirror)}
                 className={`
                   bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 border-2 shadow-inner relative overflow-hidden cursor-pointer transition-all group
                   ${isAddonSelected(decor.magicMirror.title) ? 'border-primary-500 ring-2 ring-primary-200' : 'border-white hover:border-gray-300'}
                 `}
               >
                  <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl shadow-md z-20">{decor.magicMirror.badge}</div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center shrink-0 border-4 border-white">
                       <Sparkles className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{decor.magicMirror.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
                        {decor.magicMirror.desc}
                      </p>
                      <div className="inline-flex items-center gap-2 bg-white/50 px-3 py-1 rounded-full text-xs font-medium text-gray-500">
                         <span>{decor.magicMirror.tags[0]}</span>
                         <span className="w-px h-3 bg-gray-400"></span>
                         <span className="text-primary-600 font-bold">{decor.magicMirror.price}</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB 4: ADVANCED (Accordion for Structures, Vertical List for Final Touch) */}
          {activeTab === 'advanced' && (
            <div className="animate-fade-in space-y-12 max-w-2xl mx-auto">
               
               <div className="space-y-4">
                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                   <Hammer className="w-5 h-5 text-primary-500" /> 进阶结构 (单选)
                 </h3>
                 
                 <div>
                    {advanced.structures.map((item, idx) => (
                      <AccordionItem 
                        key={idx}
                        id={`struct-${idx}`}
                        isSelected={selectedCraft?.name === item.name}
                        isOpen={openAccordionId === `struct-${idx}`}
                        onToggle={() => handleAccordionToggle(`struct-${idx}`)}
                        onSelect={() => selectCraft(item)}
                        title={
                           <span className="flex items-center gap-2">
                              <span>{item.icon}</span> {item.name}
                           </span>
                        }
                        subtitle={item.desc}
                        image={item.image}
                        priceTag={item.price}
                      />
                    ))}
                 </div>
               </div>

               <div className="bg-primary-50/50 rounded-3xl p-6 border border-primary-100/50">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                     <Gem className="w-5 h-5 text-primary-500" /> 终章点缀 (可多选)
                  </h3>
                  {/* Vertical List for Final Touches */}
                  <div className="flex flex-col gap-3">
                     {advanced.finalTouch.map((item, idx) => {
                       const selected = isAddonSelected(item.name);
                       return (
                         <div 
                            key={idx} 
                            onClick={() => handleAddonToggle('Final Touch', item)}
                            className={`
                              p-3 rounded-xl shadow-sm flex items-center gap-4 cursor-pointer transition-all border group
                              ${selected
                                ? 'bg-white border-primary-500 ring-1 ring-primary-500'
                                : 'bg-white border-transparent hover:border-gray-200'
                              }
                            `}
                          >
                            <div className="w-12 h-12 rounded-lg bg-gray-50 shrink-0 overflow-hidden border border-gray-100 relative">
                               {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-center mb-1">
                                  <div className="font-bold text-gray-700 text-sm">{item.name}</div>
                                  <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded font-medium">{item.price}</span>
                               </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-200'}`}>
                               {selected && <Check className="w-3 h-3" />}
                            </div>
                         </div>
                       );
                     })}
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* ... (Existing Fulfillment Section Code - Unchanged logic, just layout) ... */}
        {/* ========================================================= */}
        {/* FULFILLMENT / CONTRACT */}
        {/* ========================================================= */}
        <div className="border-t-2 border-dashed border-gray-100 pt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {FULFILLMENT_CONTENT.sectionTitle}
              <span className="text-gray-400 font-light ml-2 text-xl block md:inline mt-2 md:mt-0">{FULFILLMENT_CONTENT.sectionSubtitle}</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            
            {/* 1. Production Time & Rush Orders */}
            <div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                 <h3 className="text-xl font-bold text-gray-800 mb-4">{FULFILLMENT_CONTENT.production.title}</h3>
                 <p className="text-gray-600 mb-4 leading-relaxed">{FULFILLMENT_CONTENT.production.cycle}</p>
                 <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                   {FULFILLMENT_CONTENT.production.cancellation}
                 </div>
              </div>

              <div className={`rounded-3xl p-8 transition-colors duration-300 ${isBusy ? 'bg-gray-50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{FULFILLMENT_CONTENT.rush.title}</h3>
                      <p className="text-gray-500 text-sm">{FULFILLMENT_CONTENT.rush.subtitle}</p>
                    </div>
                    {isBusy && (
                      <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 self-start md:self-auto">
                        <Coffee className="w-3 h-3" /> 爆肝模式生效中
                      </span>
                    )}
                 </div>
                 
                 <p className="text-gray-600 mb-4">{FULFILLMENT_CONTENT.rush.intro}</p>
                 <div className="text-xs text-gray-500 mb-8 bg-white/50 inline-block px-3 py-2 rounded-lg border border-black/5">
                   {FULFILLMENT_CONTENT.rush.warning}
                 </div>

                 {/* Rush Tiers Grid */}
                 <div className={`grid md:grid-cols-3 gap-4 mb-8 ${isBusy ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                   {FULFILLMENT_CONTENT.rush.tiers.map((tier, idx) => {
                     const isSelected = selectedRush?.name === tier.name;
                     return (
                       <div 
                         key={idx} 
                         onClick={() => !isBusy && selectRush(tier)} // Disable click if busy
                         className={`
                           border rounded-2xl p-5 relative overflow-hidden bg-white transition-all
                           ${isBusy ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                           ${isSelected ? `ring-2 ring-offset-2 ring-primary-400 border-primary-400 ${getRushColor(tier.color)}` : getRushColor(tier.color)}
                         `}
                       >
                          {isSelected && <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                          <div className="flex justify-between items-start mb-3">
                             <span className="text-2xl">{tier.icon}</span>
                             <span className="text-xl font-bold">{tier.fee}</span>
                          </div>
                          <h4 className="font-bold text-gray-800 mb-1">{tier.name}</h4>
                          <div className="text-xs font-bold bg-white/50 inline-block px-2 py-1 rounded mb-3">
                            ⏱️ {tier.time}
                          </div>
                          <p className="text-xs text-gray-500 leading-snug">
                            {tier.desc}
                          </p>
                       </div>
                     );
                   })}
                 </div>

                 {/* Dynamic Status Info */}
                 <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h5 className="font-bold text-gray-800 text-sm mb-4">当前状态说明：</h5>
                    <div className="space-y-3 text-sm">
                      <div className={`flex gap-2 ${!isBusy ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                         <span className={!isBusy ? 'opacity-100' : 'opacity-50'}>🍵</span>
                         <span>{FULFILLMENT_CONTENT.rush.status.idle}</span>
                      </div>
                      <div className={`flex gap-2 ${isBusy ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                         <span className={isBusy ? 'animate-pulse' : 'opacity-50'}>🔥</span>
                         <span>{FULFILLMENT_CONTENT.rush.status.busy}</span>
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* 2. Shipping Process */}
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -z-10 hidden md:block"></div>
              <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-16">
                
                {/* Step 1 */}
                <div className="flex flex-col md:items-end md:text-right">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:mr-8 relative">
                     <div className="absolute top-6 -right-3 w-6 h-6 bg-white rotate-45 border-t border-r border-gray-100 hidden md:block"></div>
                     <div className="flex items-center gap-3 md:flex-row-reverse mb-2 text-primary-500 font-bold">
                       <Camera className="w-5 h-5" />
                       {FULFILLMENT_CONTENT.shipping.confirm.title}
                     </div>
                     <p className="text-gray-600 text-sm">{FULFILLMENT_CONTENT.shipping.confirm.desc}</p>
                  </div>
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-sm mt-8"></div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:items-start md:text-left mt-8 md:mt-24">
                   {/* Timeline dot */}
                   <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow-sm mt-8"></div>
                   
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:ml-8 relative">
                     <div className="absolute top-6 -left-3 w-6 h-6 bg-white -rotate-45 border-t border-l border-gray-100 hidden md:block"></div>
                     <div className="flex items-center gap-3 mb-2 text-gray-800 font-bold">
                       <Truck className="w-5 h-5" />
                       {FULFILLMENT_CONTENT.shipping.send.title}
                     </div>
                     <p className="text-gray-600 text-sm">{FULFILLMENT_CONTENT.shipping.send.desc}</p>
                   </div>
                </div>

              </div>
            </div>

            {/* 3. Packaging Options */}
            <div className="grid md:grid-cols-2 gap-8">
               {FULFILLMENT_CONTENT.packaging.map((pack, idx) => {
                 const isSelected = selectedPackaging?.title === pack.title || (!selectedPackaging && idx === 0);
                 return (
                 <div 
                   key={idx} 
                   onClick={() => selectPackaging(pack)}
                   className={`
                     bg-white rounded-3xl overflow-hidden shadow-md group hover:shadow-xl transition-all border cursor-pointer flex flex-col
                     ${isSelected ? 'ring-2 ring-primary-500 scale-[1.02] border-primary-500' : 'border-gray-100 hover:border-gray-200'}
                   `}
                 >
                    <div className="h-48 overflow-hidden relative">
                      <img src={pack.image} alt={pack.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${pack.isUpgrade ? 'bg-gray-900 text-white' : 'bg-white text-gray-500'}`}>
                        {pack.tag}
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary-900/10 flex items-center justify-center">
                          <div className="bg-white text-primary-600 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                            <Package className="w-4 h-4" /> 已选择
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">{pack.title}</h4>
                      <p className="text-xs text-gray-400 font-mono mb-3">{pack.engName}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{pack.desc}</p>
                    </div>
                 </div>
               )})}
            </div>

          </div>
        </div>

        {/* ✨ WISH MODAL */}
        {showWishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowWishModal(false)}>
            <div className="bg-white rounded-[2rem] max-w-sm w-full p-8 relative animate-scale-up" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowWishModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600">
                 <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow">
                   <Star className="w-8 h-8 fill-current" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">检测到小狼的馈赠！</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  恭喜！你选择了“随身卡包级/萌趣挂件”，已触发免费的 <span className="text-primary-500 font-bold">星辰点缀</span> 福利！
                </p>
                
                <div className="space-y-3">
                  <button className="w-full bg-primary-500 text-white font-bold py-3 rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-200" onClick={() => {
                     setConsultationMode(true);
                     toggleModal(true);
                     setShowWishModal(false);
                  }}>
                    开启许愿模式 (免费)
                  </button>
                  <button className="w-full bg-gray-50 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setShowWishModal(false)}>
                    我再看看别的
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Process;