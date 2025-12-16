
import React, { useState, useEffect, useRef } from 'react';
import { 
  Ruler, Palette, Wand2, Layers, 
  Hammer, Zap, Sun, Gem, Scissors, 
  Fingerprint, Eye, Sparkles, Moon, Coffee, Star, X, AlertTriangle, Truck, Camera, HelpCircle, Package, Check, ChevronDown, ZoomIn, Heart, Info, Circle, Send, ArrowRight, ArrowLeft, RefreshCcw, Layout, ShoppingCart, Clock, AlertCircle, Calendar, Gift, BookOpen
} from 'lucide-react';
import { PROCESS_CONTENT, SITE_STATUS, FULFILLMENT_CONTENT, CONSULTATION_CONTENT, SELF_WILL_MATERIALS, WISH_MODAL_CONTENT } from '../content';
import { useOrder, FluidSelection } from '../contexts/OrderContext';

// --- Lightbox Component ---
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

// --- Stacked Card Components ---

interface Step {
  id: string;
  title: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  summary?: string;
}

const Process: React.FC = () => {
  // Context
  const { 
    selectedSize, selectedFluid, selectedDecorationPackage, selectedAddons, selectedRush, selectedPackaging,
    selectSize, selectFluid, selectDecorationPackage, toggleAddon, removeAddon, clearAddons, selectRush, selectPackaging,
    decorationMode, setDecorationMode,
    setConsultationMode, consultationMode, toggleModal
  } = useOrder();

  // Local State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  
  // Fulfillment Logic
  const [productionMode, setProductionMode] = useState<'regular' | 'rush'>('regular');
  
  // Fluid Logic
  const [buddhaInput, setBuddhaInput] = useState('');
  const [isSurpriseAnimating, setIsSurpriseAnimating] = useState(false);
  const [isSurpriseDone, setIsSurpriseDone] = useState(false);
  const [customMaterials, setCustomMaterials] = useState<Array<{id: string, name: string, img: string}>>([]);
  const [expandFluidCategory, setExpandFluidCategory] = useState<string | null>('base');
  
  // Blind Box Wish Logic
  const [showWishModal, setShowWishModal] = useState(false);
  const [wishModalStep, setWishModalStep] = useState<'options' | 'blindbox'>('options');
  const [showDiyNotice, setShowDiyNotice] = useState(false);
  const [blindboxStyleTags, setBlindboxStyleTags] = useState<string[]>([]);
  const [blindboxStyleInput, setBlindboxStyleInput] = useState('');
  const [blindboxTabooInput, setBlindboxTabooInput] = useState('');
  const [blindboxError, setBlindboxError] = useState('');

  const { isBusy } = SITE_STATUS;
  const content = PROCESS_CONTENT;

  // Effects
  useEffect(() => {
    // Restore state from context if available
    if (selectedFluid?.strategyId === 'buddha' && selectedFluid.note) setBuddhaInput(selectedFluid.note);
  }, [selectedFluid]);

  // Sync rush state with toggle
  useEffect(() => {
     if (selectedRush) {
         setProductionMode('rush');
     } else {
         setProductionMode('regular');
     }
  }, [selectedRush]);

  const handleProductionChange = (mode: 'regular' | 'rush') => {
      setProductionMode(mode);
      if (mode === 'regular') {
          selectRush(null); // Clear rush selection
      }
  };

  // Define Steps based on Path
  const steps: Step[] = [
    { 
      id: 'size', 
      title: '1. 画框 · 基础', 
      icon: <Ruler className="w-4 h-4" />, 
      isCompleted: !!selectedSize,
      summary: selectedSize ? `${selectedSize.name} (${selectedSize.priceStr})` : undefined
    },
    { 
      id: 'fluid', 
      title: '2. 配方 · 灵魂', 
      icon: <Palette className="w-4 h-4" />, 
      isCompleted: !!selectedFluid,
      summary: selectedFluid ? selectedFluid.strategyTitle : undefined
    },
    {
      id: 'mode',
      title: '3. 装饰 · 策略',
      icon: <Layout className="w-4 h-4" />,
      isCompleted: false, // Always active until user clicks next
      summary: decorationMode === 'package' ? '主厨推荐模式 (套餐)' : '自助餐模式 (自选)'
    }
  ];

  // Dynamically add steps based on Mode
  if (decorationMode === 'package') {
     steps.push({
       id: 'package',
       title: '4. 选择装饰密度',
       icon: <Sparkles className="w-4 h-4" />,
       isCompleted: !!selectedDecorationPackage,
       summary: selectedDecorationPackage ? selectedDecorationPackage.name : undefined
     });
     
     // Final Step for Package Mode
     steps.push({
        id: 'fulfillment',
        title: '5. 交付 · 契约',
        icon: <Truck className="w-4 h-4" />,
        isCompleted: !!selectedPackaging,
        summary: selectedPackaging ? `${productionMode === 'rush' ? '加急' : '慢酿'} / ${selectedPackaging.tag}` : '待确认'
     });

  } else {
     // Path B Steps
     const structureCount = selectedAddons?.filter(a => a.category === 'Structure').length || 0;
     const structureSummary = structureCount > 0 ? `${structureCount} 项已选` : '标准结构 (默认)';

     const visualCount = selectedAddons?.filter(a => ['Visual Effect', 'Hidden', 'Surface'].includes(a.category)).length || 0;
     const externalCount = selectedAddons?.filter(a => ['External', 'Collage', 'Baroque'].includes(a.category)).length || 0;

     steps.push(
       { id: 'structure', title: '4. 结构层 (需确认)', icon: <Hammer className="w-4 h-4" />, isCompleted: true, summary: structureSummary },
       { id: 'enhancement', title: '5. 表现层 (可微调)', icon: <Eye className="w-4 h-4" />, isCompleted: true, summary: visualCount > 0 ? `${visualCount} 项已选` : '无额外特效' },
       { id: 'external', title: '6. 装饰层 (最安全)', icon: <Gem className="w-4 h-4" />, isCompleted: true, summary: externalCount > 0 ? `${externalCount} 项已选` : '无额外装饰' }
     );

     // Final Step for Custom Mode
     steps.push({
        id: 'fulfillment',
        title: '7. 交付 · 契约',
        icon: <Truck className="w-4 h-4" />,
        isCompleted: !!selectedPackaging,
        summary: selectedPackaging ? `${productionMode === 'rush' ? '加急' : '慢酿'} / ${selectedPackaging.tag}` : '待确认'
     });
  }

  // Scroll to step helper
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleStepClick = (index: number) => {
    // Only allow going back to previous steps, or current step
    if (index <= currentStepIndex) {
      setCurrentStepIndex(index);
      stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const advanceStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // --- Handlers ---
  const handleSizeSelect = (item: any) => {
    selectSize(item);
    if (item.triggerWish) setShowWishModal(true);
    setTimeout(advanceStep, 300);
  };

  const handleFluidSelect = (val: FluidSelection) => {
    selectFluid(val);
    if (val.strategyId !== 'self') {
        setTimeout(advanceStep, 500);
    }
  };

  const handleModeSelect = (targetMode: 'package' | 'custom') => {
    // 1. Same Mode Click -> Advance
    if (targetMode === decorationMode) {
        setTimeout(advanceStep, 300);
        return;
    }

    // 2. Switch to Package (Potential Conflict)
    if (targetMode === 'package') {
        // Safe check for array existence
        const hasCustomItems = selectedAddons && selectedAddons.length > 0;
        
        if (hasCustomItems) {
            // Use setTimeout to unblock the UI/Event Loop before showing the blocking confirm dialog
            setTimeout(() => {
                if (window.confirm('切换至【主厨推荐模式】将清空您在【自助餐模式】下已选的所有结构与装饰。\n\n确定要放弃当前选择并切换吗？')) {
                    clearAddons();
                    setDecorationMode('package');
                    setTimeout(advanceStep, 100);
                }
            }, 50);
            return;
        } 
        
        // No items selected, direct switch
        setDecorationMode('package');
        setTimeout(advanceStep, 300);
        return;
    }

    // 3. Switch to Custom (Safe)
    if (targetMode === 'custom') {
        selectDecorationPackage(null);
        setDecorationMode('custom');
        setTimeout(advanceStep, 300);
    }
  };

  // Helper to get image lightbox
  const openLightbox = (src: string) => {
     setLightboxSrc(src);
  };

  return (
    <section id="process" className="py-24 bg-white relative min-h-screen">
       {lightboxSrc && <ProcessLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
       
       {showDiyNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in-down">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-sm font-bold">{WISH_MODAL_CONTENT.diyNotice}</span>
        </div>
       )}

       <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{content.sectionTitle}<span className="text-primary-400 font-light ml-2 text-2xl">{content.sectionSubtitle}</span></h2>
            <p className="text-gray-500">{content.intro}</p>
          </div>

          {/* --- STACKED CARD INTERFACE --- */}
          <div className="max-w-2xl mx-auto space-y-4 pb-20">
             {steps.map((step, index) => {
               const isActive = index === currentStepIndex;
               const isPast = index < currentStepIndex;
               const isFuture = index > currentStepIndex;
               
               if (isFuture) return null;

               return (
                 <div 
                    key={step.id} 
                    ref={el => { stepRefs.current[index] = el }}
                    className={`transition-all duration-500 ease-in-out ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-0'}`}
                 >
                    {/* Header / Summary State */}
                    {isPast && (
                       <button 
                         onClick={() => handleStepClick(index)}
                         className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
                       >
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4" />
                             </div>
                             <div className="text-left">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">{step.title}</div>
                                <div className="font-bold text-gray-800 text-sm">{step.summary}</div>
                             </div>
                          </div>
                          <div className="text-gray-400 group-hover:text-primary-500 text-xs font-medium">修改</div>
                       </button>
                    )}

                    {/* Active State */}
                    {isActive && (
                       <div className="bg-white rounded-2xl shadow-xl border border-primary-100 overflow-hidden animate-slide-up">
                          <div className="bg-primary-50/50 p-4 border-b border-primary-100 flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                {index + 1}
                             </div>
                             <h3 className="font-bold text-gray-800">{step.title.split('.')[1] || step.title}</h3>
                          </div>
                          
                          <div className="p-6">
                             {/* --- STEP 1: SIZE --- */}
                             {step.id === 'size' && (
                                <div className="space-y-4">
                                   <div className="grid gap-3">
                                      {content.sizes.map((item, idx) => (
                                         <button 
                                            key={idx}
                                            onClick={() => handleSizeSelect(item)}
                                            className={`relative flex items-center p-3 rounded-xl border-2 text-left transition-all hover:shadow-md ${selectedSize?.name === item.name ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-primary-200'}`}
                                         >
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden mr-4 relative group">
                                               {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">无图</div>}
                                               <div onClick={(e) => {e.stopPropagation(); openLightbox(item.image)}} className="absolute bottom-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn className="w-3 h-3"/></div>
                                            </div>
                                            <div className="flex-1">
                                               <div className="flex justify-between items-center mb-1">
                                                  <span className="font-bold text-gray-800">{item.name}</span>
                                                  <span className="font-bold text-primary-600">{item.price}</span>
                                               </div>
                                               <div className="text-xs text-gray-500 mb-2">{item.desc}</div>
                                               <div className="inline-flex gap-2">
                                                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{item.size}</span>
                                                  {item.triggerWish && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex items-center gap-1"><Star className="w-3 h-3 fill-current"/> 含福利</span>}
                                               </div>
                                            </div>
                                            {selectedSize?.name === item.name && <div className="absolute top-3 right-3 text-primary-500"><Check className="w-5 h-5"/></div>}
                                         </button>
                                      ))}
                                   </div>
                                   <p className="text-xs text-center text-gray-400">{content.sizeNote}</p>
                                </div>
                             )}

                             {/* --- STEP 2: FLUID --- */}
                             {step.id === 'fluid' && (
                                <div className="space-y-4">
                                   {/* Buddha */}
                                   <div 
                                      onClick={() => {if (selectedFluid?.strategyId !== 'buddha') handleFluidSelect({ strategyId: 'buddha', strategyTitle: '佛系选', description: '由小狼调配', note: buddhaInput })}}
                                      className={`border rounded-xl p-4 transition-all cursor-pointer ${selectedFluid?.strategyId === 'buddha' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-200' : 'border-gray-200 hover:border-gray-300'}`}
                                   >
                                      <div className="flex items-center gap-3 mb-3">
                                         <span className="text-2xl">🧘</span>
                                         <div>
                                            <div className="font-bold text-gray-800">佛系选 (推荐)</div>
                                            <div className="text-xs text-gray-500">给关键词，剩下的交给我。</div>
                                         </div>
                                         {selectedFluid?.strategyId === 'buddha' && <Check className="w-5 h-5 text-primary-500 ml-auto" />}
                                      </div>
                                      <input 
                                         type="text" 
                                         value={buddhaInput} 
                                         onClick={(e) => e.stopPropagation()}
                                         onChange={(e) => { setBuddhaInput(e.target.value); if(selectedFluid?.strategyId === 'buddha') handleFluidSelect({ strategyId: 'buddha', strategyTitle: '佛系选', description: '由小狼调配', note: e.target.value }) }}
                                         placeholder="例如：想要蓝紫色系，梦幻一点..." 
                                         className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-primary-200 focus:border-primary-400"
                                      />
                                   </div>

                                   {/* Surprise */}
                                   <div 
                                      onClick={() => {
                                         setIsSurpriseAnimating(true);
                                         setTimeout(() => {
                                            setIsSurpriseAnimating(false);
                                            setIsSurpriseDone(true);
                                            handleFluidSelect({ strategyId: 'surprise', strategyTitle: '开惊喜', description: '小狼的即兴创作' });
                                         }, 1500);
                                      }}
                                      className={`border rounded-xl p-4 cursor-pointer relative overflow-hidden transition-all h-24 flex items-center ${selectedFluid?.strategyId === 'surprise' ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                   >
                                       {isSurpriseAnimating ? (
                                          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                                             <Heart className="w-10 h-10 text-red-500 animate-ping" fill="currentColor" />
                                          </div>
                                       ) : (
                                          <div className="flex items-center gap-3 w-full">
                                             <span className="text-2xl">🎁</span>
                                             <div>
                                                <div className="font-bold text-gray-800">开惊喜 (盲盒)</div>
                                                <div className="text-xs text-gray-500">完全信任小狼，或许有绝版限定掉落。</div>
                                             </div>
                                             {selectedFluid?.strategyId === 'surprise' && <Check className="w-5 h-5 text-red-500 ml-auto" />}
                                          </div>
                                       )}
                                   </div>

                                   {/* Self-Will */}
                                   <div className={`border rounded-xl p-4 transition-all ${selectedFluid?.strategyId === 'self' ? 'border-primary-500 bg-white ring-1 ring-primary-200' : 'border-gray-200'}`}>
                                      <div 
                                         className="flex items-center gap-3 mb-4 cursor-pointer"
                                         onClick={() => handleFluidSelect({ strategyId: 'self', strategyTitle: '任性玩', description: '自选材料', materials: customMaterials.map(m => m.name) })}
                                      >
                                         <span className="text-2xl">🎮</span>
                                         <div>
                                            <div className="font-bold text-gray-800">任性玩 (高玩)</div>
                                            <div className="text-xs text-gray-500">自己指定配方，最多选5种。</div>
                                         </div>
                                         {selectedFluid?.strategyId === 'self' && <Check className="w-5 h-5 text-primary-500 ml-auto" />}
                                      </div>
                                      
                                      {/* Material Selection UI */}
                                      <div className="bg-gray-50 rounded-lg p-3">
                                         <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
                                            {[0, 1, 2, 3, 4].map(i => (
                                               <div key={i} className="w-8 h-8 rounded-full border border-dashed border-gray-300 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                                                  {customMaterials[i] ? <img src={customMaterials[i].img} className="w-full h-full object-cover"/> : <span className="text-gray-300 text-xs">{i+1}</span>}
                                               </div>
                                            ))}
                                            <div className="text-xs text-gray-400 flex items-center">已选: {customMaterials.length}/5</div>
                                         </div>
                                         
                                         {/* Categories Accordion */}
                                         <div className="space-y-2">
                                            {Object.entries(SELF_WILL_MATERIALS).map(([key, mats]) => (
                                               <div key={key}>
                                                  <button 
                                                     onClick={() => setExpandFluidCategory(expandFluidCategory === key ? null : key)}
                                                     className="flex items-center gap-2 text-xs font-bold text-gray-600 w-full hover:bg-gray-100 p-1 rounded"
                                                  >
                                                     <ChevronDown className={`w-3 h-3 transition-transform ${expandFluidCategory === key ? 'rotate-180' : ''}`} />
                                                     {key === 'base' ? '基础色粉' : key === 'pearl' ? '珠光粉' : key === 'glitter' ? '亮片' : '特殊填充'}
                                                  </button>
                                                  {expandFluidCategory === key && (
                                                     <div className="grid grid-cols-4 gap-2 mt-2">
                                                        {mats.map(m => {
                                                           const isSelected = customMaterials.some(cm => cm.id === m.id);
                                                           return (
                                                              <div 
                                                                 key={m.id} 
                                                                 onClick={() => {
                                                                    setCustomMaterials(prev => {
                                                                       const exists = prev.find(p => p.id === m.id);
                                                                       const next = exists ? prev.filter(p => p.id !== m.id) : (prev.length < 5 ? [...prev, m] : prev);
                                                                       if (selectedFluid?.strategyId === 'self') selectFluid({ strategyId: 'self', strategyTitle: '任性玩', description: '自选材料', materials: next.map(x => x.name) });
                                                                       return next;
                                                                    });
                                                                 }}
                                                                 className={`aspect-square rounded border relative overflow-hidden cursor-pointer ${isSelected ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-200'}`}
                                                              >
                                                                 <img src={m.img} className="w-full h-full object-cover" />
                                                                 {isSelected && <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center"><Check className="w-5 h-5 text-white shadow" /></div>}
                                                              </div>
                                                           )
                                                        })}
                                                     </div>
                                                  )}
                                               </div>
                                            ))}
                                         </div>
                                      </div>
                                      <div className="mt-4 text-center">
                                         <button onClick={advanceStep} className="bg-primary-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow hover:bg-primary-600 transition-colors">确认配方</button>
                                      </div>
                                   </div>
                                </div>
                             )}

                             {/* --- STEP 3: DECORATION MODE (FORK) --- */}
                             {step.id === 'mode' && (
                                <div className="grid md:grid-cols-2 gap-4">
                                   <button 
                                      onClick={() => handleModeSelect('package')}
                                      className={`p-5 rounded-2xl border-2 text-left transition-all hover:shadow-lg relative overflow-hidden ${decorationMode === 'package' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'}`}
                                   >
                                      <div className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] px-2 py-1 rounded-bl-lg">推荐</div>
                                      <div className="text-3xl mb-3">{content.paths.a.icon}</div>
                                      <h4 className="font-bold text-gray-800 text-lg mb-1">{content.paths.a.title}</h4>
                                      <div className="text-primary-600 font-bold text-sm mb-2">{content.paths.a.subtitle}</div>
                                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{content.paths.a.desc}</p>
                                      <div className="flex flex-wrap gap-2">
                                         {content.paths.a.badges.map(b => <span key={b} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">{b}</span>)}
                                      </div>
                                   </button>

                                   <button 
                                      onClick={() => handleModeSelect('custom')}
                                      className={`p-5 rounded-2xl border-2 text-left transition-all hover:shadow-lg relative ${decorationMode === 'custom' ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
                                   >
                                      <div className="text-3xl mb-3">{content.paths.b.icon}</div>
                                      <h4 className="font-bold text-gray-800 text-lg mb-1">{content.paths.b.title}</h4>
                                      <div className="text-gray-600 font-bold text-sm mb-2">{content.paths.b.subtitle}</div>
                                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{content.paths.b.desc}</p>
                                      <div className="flex flex-wrap gap-2">
                                         {content.paths.b.badges.map(b => <span key={b} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">{b}</span>)}
                                      </div>
                                   </button>
                                </div>
                             )}

                             {/* --- PATH A: PACKAGE SELECTION --- */}
                             {step.id === 'package' && (
                                <div className="space-y-4">
                                   {content.packages.map((pkg) => (
                                      <button 
                                         key={pkg.id}
                                         onClick={() => { selectDecorationPackage(pkg as any); }}
                                         className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedDecorationPackage?.id === pkg.id ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                                      >
                                         <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-gray-800">{pkg.name}</h4>
                                            <div className="font-bold text-primary-600">+{pkg.price}r</div>
                                         </div>
                                         <p className="text-xs text-gray-500 mb-3">{pkg.desc}</p>
                                         <div className="flex flex-wrap gap-2">
                                            {pkg.features.map((f, i) => (
                                               <span key={i} className="text-[10px] bg-white px-2 py-1 rounded border border-gray-100 text-gray-400 flex items-center gap-1">
                                                  <Check className="w-3 h-3 text-primary-400" /> {f}
                                               </span>
                                            ))}
                                         </div>
                                      </button>
                                   ))}
                                   <div className="pt-4 border-t border-dashed border-gray-200 mt-4">
                                      <p className="text-xs text-gray-400 text-center mb-4">
                                         * 装饰方案为整体设计密度，不逐项选择材料。特殊结构设计将单独确认。
                                      </p>
                                   </div>
                                   
                                   <div className="mt-4 flex justify-end">
                                      <button 
                                         onClick={advanceStep}
                                         className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-gray-900 text-white hover:bg-black transition-colors shadow-md"
                                      >
                                         下一步 <ArrowRight className="w-4 h-4"/>
                                      </button>
                                   </div>
                                </div>
                             )}

                             {/* --- PATH B: CUSTOM CATEGORIES (Structure / Enhancement / External) --- */}
                             {(step.id === 'structure' || step.id === 'enhancement' || step.id === 'external') && (
                                <div className="space-y-6">
                                   <div className="text-sm text-gray-500 italic mb-4">
                                      {step.id === 'structure' ? content.customCategories.structure.desc : 
                                       step.id === 'enhancement' ? content.customCategories.enhancement.desc : 
                                       content.customCategories.external.desc}
                                   </div>

                                   <div className="grid grid-cols-2 gap-3">
                                      {(content.customCategories as any)[step.id].items.map((item: any, idx: number) => {
                                         // Unified multi-select check
                                         const isSelected = selectedAddons?.some(a => a.name === item.name) || false;
                                            
                                         return (
                                            <div 
                                               key={idx}
                                               onClick={() => {
                                                  // Map categories
                                                  let category = 'External';
                                                  if (step.id === 'structure') category = 'Structure';
                                                  else if (step.id === 'enhancement') category = 'Visual Effect';
                                                  else if (['巴洛克堆叠'].includes(item.name)) category = 'Baroque';
                                                  else if (['立体拼贴'].includes(item.name)) category = 'Collage';
                                                  
                                                  // Toggle with multiplier support
                                                  toggleAddon(category, item.name, item.price, item.priceNum, item.multiplier);
                                               }}
                                               className={`border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md flex flex-col ${isSelected ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-200' : 'border-gray-200 bg-white'}`}
                                            >
                                               <div className="relative aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden group">
                                                  {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>}
                                                  {isSelected && <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></div>}
                                                  <div onClick={(e) => {e.stopPropagation(); openLightbox(item.image)}} className="absolute bottom-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn className="w-3 h-3"/></div>
                                               </div>
                                               <div className="flex justify-between items-start mb-1">
                                                  <h4 className="font-bold text-gray-800 text-sm leading-tight">{item.name}</h4>
                                                  <span className="text-xs font-bold text-primary-600 shrink-0 ml-1">{item.price}</span>
                                               </div>
                                               <p className="text-[10px] text-gray-400 leading-tight">{item.desc}</p>
                                            </div>
                                         )
                                      })}
                                   </div>
                                   
                                   <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100">
                                      <button 
                                         onClick={prevStep}
                                         className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-800 transition-colors"
                                      >
                                         <ArrowLeft className="w-4 h-4"/> 上一步
                                      </button>
                                      
                                      <button 
                                         onClick={() => advanceStep()}
                                         className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-gray-900 text-white hover:bg-black transition-colors shadow-md"
                                      >
                                         下一步 <ArrowRight className="w-4 h-4"/>
                                      </button>
                                   </div>
                                </div>
                             )}

                             {/* --- FINAL STEP: FULFILLMENT & PACKAGING --- */}
                             {step.id === 'fulfillment' && (
                                <div className="space-y-8">
                                    
                                    {/* 1. Production Mode Toggle */}
                                    <div className="space-y-4">
                                        <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            选择制作工期
                                        </div>
                                        
                                        <div className="grid gap-3">
                                            {/* Option A: Regular */}
                                            <div 
                                                onClick={() => handleProductionChange('regular')}
                                                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${productionMode === 'regular' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-xl shrink-0">⏳</div>
                                                    <div>
                                                        <div className="font-bold text-gray-800">愿意等待魔法慢酿</div>
                                                        <div className="text-xs text-gray-500">工期约 7-14 天，慢工出细活。</div>
                                                    </div>
                                                    {productionMode === 'regular' && <Check className="w-5 h-5 text-primary-500 ml-auto" />}
                                                </div>
                                            </div>

                                            {/* Option B: Rush */}
                                            <div 
                                                onClick={() => handleProductionChange('rush')}
                                                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${productionMode === 'rush' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl shrink-0">🚀</div>
                                                    <div>
                                                        <div className="font-bold text-gray-800">想要心意极速送达</div>
                                                        <div className="text-xs text-gray-500">工期约 3-7 天，优先排单制作。</div>
                                                    </div>
                                                    {productionMode === 'rush' && <Check className="w-5 h-5 text-orange-500 ml-auto" />}
                                                </div>

                                                {/* Expanded Rush Options */}
                                                {productionMode === 'rush' && (
                                                    <div className="mt-4 pt-4 border-t border-orange-200/50 animate-fade-in">
                                                        <div className="text-[10px] text-orange-600 bg-orange-100/50 p-2 rounded mb-3 flex items-start gap-2">
                                                            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                                            {FULFILLMENT_CONTENT.rush.warning}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            {FULFILLMENT_CONTENT.rush.tiers.map((tier, idx) => (
                                                                <div 
                                                                    key={idx} 
                                                                    onClick={(e) => { e.stopPropagation(); !isBusy && selectRush(tier); }}
                                                                    className={`border rounded-xl p-3 text-center cursor-pointer transition-all flex flex-col justify-between ${selectedRush?.name === tier.name ? 'border-orange-500 bg-white ring-1 ring-orange-200 shadow-sm' : 'border-gray-200 bg-white/50 hover:bg-white'}`}
                                                                >
                                                                    <div>
                                                                        <div className="text-xl mb-1">{tier.icon}</div>
                                                                        <div className="font-bold text-sm text-gray-800">{tier.name}</div>
                                                                        <div className="text-[10px] text-gray-500 my-1 leading-tight italic px-1">{tier.desc}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-[10px] text-gray-400 font-mono mt-1">{tier.time}</div>
                                                                        <div className="text-orange-600 font-bold text-xs">{tier.fee}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="text-center pt-2 text-[10px] text-gray-400">
                                                            {isBusy ? FULFILLMENT_CONTENT.rush.status.busy : FULFILLMENT_CONTENT.rush.status.idle}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Packaging Selection */}
                                    <div className="space-y-4">
                                        <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <Gift className="w-4 h-4 text-gray-500" />
                                            选择包装方案
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {FULFILLMENT_CONTENT.packaging.map((pack, idx) => {
                                                const isSelected = selectedPackaging?.title === pack.title || (!selectedPackaging && idx === 0);
                                                // Auto-select default packaging if none selected
                                                if (!selectedPackaging && idx === 0) {
                                                    // Use effect to avoid render loop, simplified here by logic
                                                }

                                                return (
                                                    <div 
                                                        key={idx} 
                                                        onClick={() => selectPackaging(pack)}
                                                        className={`border rounded-xl p-4 cursor-pointer transition-all ${isSelected ? 'border-primary-500 bg-white ring-1 ring-primary-200 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <Package className={`w-5 h-5 ${isSelected ? 'text-primary-500' : 'text-gray-400'}`} />
                                                            <div className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">{pack.tag}</div>
                                                        </div>
                                                        <h4 className="font-bold text-gray-800 text-sm mb-1">{pack.title}</h4>
                                                        <p className="text-xs text-gray-400 line-clamp-2">{pack.desc}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    
                                    {/* 3. Shipping & Confirmation */}
                                    <div className="mt-6 bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white text-indigo-500 flex items-center justify-center shrink-0 text-xs font-bold border border-indigo-100 shadow-sm">1</div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm mb-1">{FULFILLMENT_CONTENT.shipping.confirm.title}</h4>
                                                <p className="text-xs text-gray-500 leading-relaxed">{FULFILLMENT_CONTENT.shipping.confirm.desc}</p>
                                            </div>
                                        </div>
                                        <div className="w-full border-t border-dashed border-indigo-200/50"></div>
                                        <div className="flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white text-indigo-500 flex items-center justify-center shrink-0 text-xs font-bold border border-indigo-100 shadow-sm">2</div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm mb-1">{FULFILLMENT_CONTENT.shipping.send.title}</h4>
                                                <p className="text-xs text-gray-500 leading-relaxed">{FULFILLMENT_CONTENT.shipping.send.desc}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-6">
                                            <button 
                                                onClick={prevStep}
                                                className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-800 transition-colors"
                                            >
                                                <ArrowLeft className="w-4 h-4"/> 上一步
                                            </button>
                                            
                                            <button 
                                                onClick={() => toggleModal(true)}
                                                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-lg hover:shadow-primary-200 animate-pulse"
                                            >
                                                完成并预览契约 <ShoppingCart className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Policy Link */}
                                        <div className="text-center">
                                            <a href="#modification-policy" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-500 transition-colors border-b border-dashed border-transparent hover:border-primary-300 pb-0.5">
                                                <BookOpen className="w-3 h-3" />
                                                <span>定制须知 & 修改权益</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                             )}

                          </div>
                       </div>
                    )}
                 </div>
               );
             })}
          </div>
       </div>

       {/* Blind Box Modal */}
       {showWishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowWishModal(false)}>
            <div className="bg-white rounded-[2rem] max-w-md w-full p-8 relative animate-scale-up" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowWishModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-20"><X className="w-6 h-6" /></button>
              
              {wishModalStep === 'options' && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow"><Star className="w-8 h-8 fill-current" /></div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{WISH_MODAL_CONTENT.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">{WISH_MODAL_CONTENT.intro}</p>
                  <div className="space-y-3">
                    <button onClick={() => setWishModalStep('blindbox')} className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
                      <h4 className="font-bold text-gray-800 text-base">{WISH_MODAL_CONTENT.options[0].title}</h4>
                      <p className="text-xs text-gray-500">{WISH_MODAL_CONTENT.options[0].desc}</p>
                    </button>
                    <button onClick={() => { setShowDiyNotice(true); setShowWishModal(false); }} className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">
                      <h4 className="font-bold text-gray-800 text-base">{WISH_MODAL_CONTENT.options[1].title}</h4>
                      <p className="text-xs text-gray-500">{WISH_MODAL_CONTENT.options[1].desc}</p>
                    </button>
                  </div>
                </div>
              )}

              {wishModalStep === 'blindbox' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-6">{WISH_MODAL_CONTENT.blindboxForm.title}</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">{WISH_MODAL_CONTENT.blindboxForm.style.label}</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {WISH_MODAL_CONTENT.blindboxForm.style.tags.map(tag => (
                          <button key={tag} onClick={() => setBlindboxStyleTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])} className={`px-3 py-1 text-xs rounded-full border transition-colors ${blindboxStyleTags.includes(tag) ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>{tag}</button>
                        ))}
                      </div>
                      <input type="text" value={blindboxStyleInput} onChange={(e) => setBlindboxStyleInput(e.target.value)} placeholder={WISH_MODAL_CONTENT.blindboxForm.style.placeholder} className="w-full bg-gray-50 border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-primary-300 focus:border-primary-300" />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2">{WISH_MODAL_CONTENT.blindboxForm.taboo.label} <span className="text-red-500">*</span></label>
                      <input type="text" value={blindboxTabooInput} onChange={(e) => setBlindboxTabooInput(e.target.value)} placeholder={WISH_MODAL_CONTENT.blindboxForm.taboo.placeholder} className="w-full bg-gray-50 border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-primary-300 focus:border-primary-300" />
                      {blindboxError && <p className="text-red-500 text-xs mt-1">{blindboxError}</p>}
                    </div>
                    <button 
                       onClick={() => {
                          if (!blindboxTabooInput.trim()) { setBlindboxError('必填'); return; }
                          const note = `【盲盒】风格:${blindboxStyleTags.join(',')}${blindboxStyleInput}, 避雷:${blindboxTabooInput}`;
                          selectFluid({ strategyId: 'blindbox', strategyTitle: '随心盲盒', description: note });
                          setShowWishModal(false);
                          setTimeout(advanceStep, 300);
                       }} 
                       className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> {WISH_MODAL_CONTENT.blindboxForm.button}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </section>
  );
};

export default Process;
