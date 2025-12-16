
import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, CheckCircle, Tag, AlertCircle, Sparkles, Send, Calculator, Trash2, ChevronDown, ShieldAlert, Lock, Unlock, Video, MessageCircle, ShoppingBag, ExternalLink, ArrowRight, Store, HeartHandshake, Clock, QrCode, Palette, Shield, Star, Trophy } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { CONSULTATION_CONTENT, DISCLAIMER_CONTENT, CONTACT_INFO, CHECKOUT_CONTENT, SITE_STATUS } from '../content';

const WorkshopStatus: React.FC = () => {
  const [status, setStatus] = useState<'working' | 'sleeping' | 'weekend'>('working');

  useEffect(() => {
    // 1. Check for manual override first
    if (SITE_STATUS.forceStatus !== 'auto') {
      setStatus(SITE_STATUS.forceStatus);
      return; // Exit early, skipping automatic detection
    }

    // 2. Automatic detection logic
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();

    if (day === 0 || day === 6) {
      setStatus('weekend');
    } else {
      if (hour >= 10 && hour < 22) {
        setStatus('working');
      } else {
        setStatus('sleeping');
      }
    }
  }, []);

  const { title, statuses } = CHECKOUT_CONTENT.schedule;
  const currentStatus = statuses[status];

  const getStyle = () => {
    switch (status) {
      case 'working':
        return 'bg-emerald-50 border-emerald-100 text-emerald-900';
      case 'sleeping':
        return 'bg-indigo-50 border-indigo-100 text-indigo-900';
      case 'weekend':
        return 'bg-amber-50 border-amber-100 text-amber-900';
      default:
        return 'bg-gray-50 border-gray-100 text-gray-900';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'working': return 'text-emerald-500';
      case 'sleeping': return 'text-indigo-500';
      case 'weekend': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  const getIcon = () => {
    if (status === 'weekend') return '🏖️';
    return currentStatus.icon;
  };

  return (
    <div className={`w-full px-6 py-3 border-b flex items-start gap-3 transition-colors duration-300 ${getStyle()}`}>
      <div className={`text-lg mt-0.5 ${status === 'weekend' ? 'animate-bounce' : ''}`}>{getIcon()}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
           <span className="font-bold text-sm">{currentStatus.label}</span>
           <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-white/50 border border-white/50 font-medium ${getIconColor()}`}>
              {title}
           </span>
        </div>
        <p className="text-xs opacity-90 leading-snug">{currentStatus.text}</p>
      </div>
    </div>
  );
};


const CheckoutModal: React.FC = () => {
  const { 
    isModalOpen, toggleModal, 
    selectedSize, selectedAddons, selectedRush, selectedPackaging, selectedFluid,
    decorationMode, selectedDecorationPackage,
    appliedDiscounts, addDiscount, removeDiscount, discountNotification, clearNotification,
    breakdown, finalPrice, 
    consultationMode, setConsultationMode, removeAddon
  } = useOrder();

  const [copied, setCopied] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showShieldPopover, setShowShieldPopover] = useState(false);
  const [inputCode, setInputCode] = useState('');
  
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(0);
  
  // Success View State
  const [showSuccessView, setShowSuccessView] = useState(false);

  const sliderRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) {
      clearNotification();
      setInputCode('');
      setIsContractSigned(false);
      setSliderValue(0);
      setExpandedSection(null);
      setCopied(false);
      setShowCopyToast(false);
      setShowShieldPopover(false);
      setShowSuccessView(false); // Reset success view
      if (consultationMode) setConsultationMode(false);
    }
  }, [isModalOpen, clearNotification, consultationMode, setConsultationMode]);
  
  // Popover close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowShieldPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddDiscount = () => {
    if (inputCode.trim()) {
      addDiscount(inputCode);
      setInputCode('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddDiscount();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (val >= 100) setIsContractSigned(true);
  };

  const handleSliderEnd = () => {
    if (sliderValue < 100) setSliderValue(0);
  };

  const toggleAccordion = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isModalOpen) return null;

  const getOrderText = () => {
    let text = "";
    const T = CHECKOUT_CONTENT.copyTemplate;
    if (consultationMode) { 
        text = CONSULTATION_CONTENT.copyTemplate;
    } else {
      text = T.intro + T.separator;
      if (selectedSize) text += `${T.size}${selectedSize.name} (${selectedSize.priceStr})\n`;
      
      // Fluid
      if (selectedFluid) {
        let fluidText = `${selectedFluid.strategyTitle}`;
        if (selectedFluid.strategyId === 'buddha' && selectedFluid.note) fluidText += ` [备注: ${selectedFluid.note}]`;
        else if (selectedFluid.strategyId === 'self' && selectedFluid.materials) fluidText += ` [材料: ${selectedFluid.materials.join(', ')}]`;
        else if (selectedFluid.strategyId === 'blindbox') fluidText += `\n  ${selectedFluid.description.replace(' | ', '\n  ')}`;
        text += `${T.fluid}${fluidText}\n`;
      }

      // Decoration Logic
      if (decorationMode === 'package' && selectedDecorationPackage) {
         text += `${T.craft} 套餐 · ${selectedDecorationPackage.name} (${selectedDecorationPackage.price}r)\n`;
      } else {
         // Filter items
         const structureItems = selectedAddons.filter(a => a.category === 'Structure');
         const otherItems = selectedAddons.filter(a => a.category !== 'Structure');
         
         if (structureItems.length > 0) {
             text += T.craft;
             structureItems.forEach(item => {
                 text += `${item.name} (${item.priceStr}), `;
             });
             text = text.slice(0, -2) + '\n';
         } else {
             text += `${T.craft}标准结构 (默认)\n`;
         }

         if (otherItems.length > 0) {
            text += T.addons;
            otherItems.forEach(addon => { text += `  - ${addon.name} (${addon.priceStr})\n`; });
         }
      }

      if (selectedRush) text += `${T.rush}${selectedRush.name} (${selectedRush.feeStr})\n`;
      if (selectedPackaging && selectedPackaging.price > 0) text += `${T.pack}${selectedPackaging.title} (+${selectedPackaging.price}r)\n`;
      if (appliedDiscounts.length > 0) {
        text += T.coupon;
        appliedDiscounts.forEach(d => { text += `  - ${d.label} [${d.code}]\n`; });
      }
      text += T.separator;
      text += T.systemTitle;
      text += `${T.base}${breakdown.baseTotal}r\n`;
      text += `${T.decor}${breakdown.addonTotal}r ${breakdown.addonDiscountMultiplier < 1 ? '(小尺寸半价)' : ''}\n`;
      if (breakdown.discountAmount > 0) text += `${T.discount}-${Math.floor(breakdown.discountAmount)}r\n`;
      text += `${T.subtotal}${breakdown.subTotal}r\n`;
      if (breakdown.rushFeeAmount > 0) text += `${T.rushFee}+${breakdown.rushFeeAmount}r\n`;
      if (breakdown.packagingFee > 0) text += `${T.packFee}+${breakdown.packagingFee}r\n`;
      text += `${T.final}${finalPrice}r\n` + T.disclaimer;
    }
    return text;
  };

  const handlePrimaryAction = () => {
    if (!isContractSigned && !consultationMode) {
      const slider = document.getElementById('contract-slider');
      if(slider) {
        slider.scrollIntoView({behavior: 'smooth', block: 'center'});
        slider.classList.add('animate-shake');
        setTimeout(() => slider.classList.remove('animate-shake'), 500);
      }
      return;
    }
    const orderText = getOrderText();
    navigator.clipboard.writeText(orderText).then(() => {
      // Show Success View instead of just a toast
      setShowSuccessView(true);
    });
  };

  const handleJumpToStarEcho = () => {
      toggleModal(false);
      const starEchoSection = document.getElementById('star-echo');
      if (starEchoSection) {
          starEchoSection.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const renderFluidDetails = () => {
    if (!selectedFluid) return null;
    if (selectedFluid.strategyId === 'blindbox') {
      const parts = selectedFluid.description.split(' | ');
      const style = parts[0]?.replace('【风格】: ', '');
      const taboo = parts[1]?.replace('【避雷】: ', '');
      return (<div className="bg-purple-50 p-4 rounded-xl border border-purple-100"><div className="flex justify-between items-start"><div><div className="flex items-center gap-2 mb-2"><span className="text-xl">🎲</span><span className="font-bold text-gray-800 text-sm">随心盲盒配方</span></div><div className="text-xs space-y-1 pl-1"><p><span className="font-bold text-purple-700">心之所属:</span> {style}</p><p><span className="font-bold text-red-700">绝对禁区:</span> {taboo}</p></div></div><button onClick={() => { toggleModal(false); window.location.href='#process'; }} className="text-xs text-primary-500 hover:underline shrink-0 ml-2">修改</button></div></div>);
    }
    return (<div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><div className="flex items-center gap-2 mb-2"><Palette className="w-4 h-4 text-primary-500" /><span className="font-bold text-gray-800 text-sm">{CHECKOUT_CONTENT.labels.fluidRecipe}</span></div><div className="flex justify-between items-start text-sm"><div className="text-gray-600"><span className="font-medium text-gray-800">{selectedFluid.strategyTitle}</span>{selectedFluid.note && <div className="text-xs text-gray-500 mt-1 italic">"{selectedFluid.note}"</div>}{selectedFluid.materials && <div className="text-xs text-gray-500 mt-1">{selectedFluid.materials.join(' / ')}</div>}</div><button onClick={() => { toggleModal(false); window.location.href='#process'; }} className="text-xs text-primary-500 hover:underline shrink-0 ml-2">修改</button></div></div>);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => toggleModal(false)}>
      {showCopyToast && <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] bg-gray-800 text-white px-5 py-2.5 rounded-full shadow-lg text-sm font-bold animate-fade-in-down">{CHECKOUT_CONTENT.actions.copy.success}</div>}
      <div className={`bg-white w-full rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh] md:max-h-[85vh] transition-all duration-300 ${consultationMode || showSuccessView ? 'md:max-w-4xl' : 'md:max-w-xl'}`} onClick={(e) => e.stopPropagation()}>
        
        {/* SUCCESS VIEW */}
        {showSuccessView ? (
            <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-50 to-white -z-10"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
                
                {/* Celebration Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 animate-bounce shadow-lg shadow-green-100 border-4 border-white">
                    <CheckCircle className="w-10 h-10" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">订单已生成！</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    契约已成功复制至剪贴板。
                    <br/>
                    请前往微信发送给小狼，完成最后的召唤仪式。
                </p>

                {/* Star Echo Invitation Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl transform hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden group border border-gray-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    
                    <div className="relative z-10 text-left">
                        <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                            <Trophy className="w-5 h-5" />
                            <span>P.S. 别急着走！</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">参与【星辰回响】计划</h3>
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                            收到宝贝后，带话题 <span className="text-white font-bold">#小狼工坊</span> 晒图，
                            <br/>
                            不仅能被收录进官网博物馆，
                            <br/>
                            还能直接获得 <span className="text-yellow-400 font-bold text-lg">¥20 星尘金</span>！
                        </p>
                        
                        <button 
                            onClick={handleJumpToStarEcho}
                            className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                            了解活动详情 <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <button onClick={() => toggleModal(false)} className="mt-8 text-gray-400 hover:text-gray-600 text-sm underline">
                    关闭窗口
                </button>
            </div>
        ) : (
        /* NORMAL CHECKOUT VIEW */
        <>
            <div className={`p-5 border-b flex justify-between items-center ${consultationMode ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50/80 border-gray-100'}`}>
                <div>
                    <h3 className={`text-lg font-bold ${consultationMode ? 'text-indigo-900' : 'text-gray-800'}`}>{consultationMode ? CONSULTATION_CONTENT.title : CHECKOUT_CONTENT.header.title}</h3>
                    <p className={`text-xs ${consultationMode ? 'text-indigo-400' : 'text-gray-400'}`}>{consultationMode ? CONSULTATION_CONTENT.desc : CHECKOUT_CONTENT.header.subtitle}</p>
                </div>
                <button onClick={() => toggleModal(false)} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-500">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            {consultationMode ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-indigo-50/30">
                    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-8 text-center max-w-2xl mx-auto">
                         <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageCircle className="w-8 h-8" />
                         </div>
                         <h3 className="text-2xl font-bold text-gray-800 mb-4">{CONSULTATION_CONTENT.modal.headline}</h3>
                         <div className="text-gray-600 text-sm leading-relaxed mb-8 space-y-2 text-left bg-gray-50 p-6 rounded-xl border border-gray-100">
                            {CONSULTATION_CONTENT.modal.intro.map((line, i) => <p key={i}>{line}</p>)}
                            <ul className="list-disc list-inside mt-2 space-y-1 font-bold text-gray-700">
                                {CONSULTATION_CONTENT.modal.list.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                         </div>
                         
                         {/* Contact Card */}
                         <div className="bg-gray-800 text-white rounded-xl p-6 relative overflow-hidden group max-w-sm mx-auto shadow-xl">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full border-4 border-gray-700 shadow-lg mb-3 overflow-hidden">
                                   <img src={CONSULTATION_CONTENT.modal.card.avatar} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-lg font-bold">{CONSULTATION_CONTENT.modal.card.name}</div>
                                <div className="text-xs text-indigo-300 uppercase tracking-widest mb-4">{CONSULTATION_CONTENT.modal.card.title}</div>
                                <div className="bg-white/10 px-4 py-2 rounded-lg text-sm font-mono mb-4 backdrop-blur-sm border border-white/10">
                                   {CONSULTATION_CONTENT.modal.card.id}
                                </div>
                                <div className="flex gap-2 w-full">
                                    <button 
                                      onClick={handlePrimaryAction}
                                      className="flex-1 bg-white text-gray-900 font-bold py-2 rounded-lg text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                       <Copy className="w-4 h-4" /> 复制需求单
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-4">{CONSULTATION_CONTENT.modal.ps}</p>
                            </div>
                         </div>
                    </div>
                </div>
            ) : (
                <>
                <div className="overflow-y-auto custom-scrollbar flex-1 relative">
                    <WorkshopStatus />
                    <div className="p-6">
                        <div className="space-y-4 mb-8">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{CHECKOUT_CONTENT.labels.orderDetails}</h4>
                            
                            {/* SIZE */}
                            {selectedSize ? (<div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">🖼️</div><div><div className="font-bold text-gray-800">{selectedSize.name}</div><div className="text-xs text-gray-500">{selectedSize.priceStr}</div></div></div><button onClick={() => { toggleModal(false); window.location.href='#process'; }} className="text-xs text-primary-500 hover:underline">修改</button></div>) : (<div className="text-center p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">{CHECKOUT_CONTENT.labels.noSize}</div>)}
                            
                            {/* FLUID */}
                            {renderFluidDetails()}
                            
                            {/* DECORATION (Package or Custom) */}
                            {decorationMode === 'package' ? (
                                selectedDecorationPackage && (
                                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">✨</div>
                                        <div>
                                        <div className="font-bold text-gray-800">装饰套餐: {selectedDecorationPackage.name}</div>
                                        <div className="text-xs text-gray-500">{selectedDecorationPackage.price}r</div>
                                        </div>
                                    </div>
                                    <button onClick={() => { toggleModal(false); window.location.href='#process'; }} className="text-xs text-primary-500 hover:underline">修改</button>
                                </div>
                                )
                            ) : (
                                <>
                                {/* Structure Items */}
                                {selectedAddons.filter(a => a.category === 'Structure').length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-4 h-4 text-gray-500">🛠️</div>
                                        <span className="font-bold text-gray-800 text-sm">结构层</span>
                                    </div>
                                    <div className="space-y-2">
                                        {selectedAddons.filter(a => a.category === 'Structure').map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600 flex items-center gap-2"><span className="w-1 h-1 bg-gray-300 rounded-full"></span>{item.name}</span>
                                            <div className="flex items-center gap-3">
                                            <span className="text-gray-400 font-mono">{item.priceStr}</span>
                                            <button onClick={() => removeAddon(item.category, item.name)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                    </div>
                                )}

                                {/* Other Addons */}
                                {selectedAddons.filter(a => a.category !== 'Structure').length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-primary-500" /><span className="font-bold text-gray-800 text-sm">{CHECKOUT_CONTENT.labels.addons}</span></div>
                                    <div className="space-y-2">{selectedAddons.filter(a => a.category !== 'Structure').map((addon, idx) => (<div key={idx} className="flex justify-between items-center text-sm"><span className="text-gray-600 flex items-center gap-2"><span className="w-1 h-1 bg-gray-300 rounded-full"></span>{addon.name}</span><div className="flex items-center gap-3"><span className="text-gray-400 font-mono">{addon.priceStr}</span><button onClick={() => removeAddon(addon.category, addon.name)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button></div></div>))}</div>
                                    </div>
                                )}
                                </>
                            )}

                            {/* RUSH & PACKAGING */}
                            {(selectedRush || selectedPackaging) && (<div className="grid grid-cols-2 gap-3">{selectedRush && (<div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex flex-col justify-center"><div className="text-xs text-orange-400 font-bold mb-1">{CHECKOUT_CONTENT.labels.rush}</div><div className="text-sm font-bold text-orange-700">{selectedRush.name}</div><div className="text-xs text-orange-500">{selectedRush.feeStr}</div></div>)}{selectedPackaging && (<div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col justify-center"><div className="text-xs text-blue-400 font-bold mb-1">{CHECKOUT_CONTENT.labels.packaging}</div><div className="text-sm font-bold text-blue-700 truncate">{selectedPackaging.title}</div><div className="text-xs text-blue-500">+{selectedPackaging.price}r</div></div>)}</div>)}
                        </div>

                        {/* Calculations */}
                        <div className="mb-8 relative"><div className="absolute left-0 right-0 top-1/2 -z-10 border-t border-dashed border-gray-200"></div><div className="bg-white px-2 w-fit mx-auto text-xs text-gray-400 flex items-center gap-1"><Calculator className="w-3 h-3" /> {CHECKOUT_CONTENT.labels.formula}</div><div className="mt-4 space-y-2 text-sm"><div className="flex justify-between text-gray-500"><span>{CHECKOUT_CONTENT.labels.baseCraft}</span><span>{breakdown.baseTotal}r</span></div><div className="flex justify-between text-gray-500"><span>{CHECKOUT_CONTENT.labels.addonTotal} {breakdown.addonDiscountMultiplier < 1 && <span className="text-xs text-primary-500 bg-primary-50 px-1 rounded">{CHECKOUT_CONTENT.labels.smallSizeDiscount}</span>}</span><span>{breakdown.addonTotal}r</span></div>{breakdown.rushFeeAmount > 0 && (<div className="flex justify-between text-orange-500"><span>{CHECKOUT_CONTENT.labels.rushFee}</span><span>+{breakdown.rushFeeAmount}r</span></div>)}{breakdown.packagingFee > 0 && (<div className="flex justify-between text-blue-500"><span>{CHECKOUT_CONTENT.labels.packFee}</span><span>+{breakdown.packagingFee}r</span></div>)}{breakdown.discountAmount > 0 && (<div className="flex justify-between text-red-500 font-bold"><span>{CHECKOUT_CONTENT.labels.discount}</span><span>-{Math.floor(breakdown.discountAmount)}r</span></div>)}<div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-end"><span className="text-gray-800 font-bold">{CHECKOUT_CONTENT.labels.total}</span><span className="text-3xl font-bold text-primary-600 leading-none"><span className="text-sm text-gray-400 font-normal mr-1">¥</span>{finalPrice}</span></div></div></div>
                        
                        {breakdown.totalSavings > 0 && (<div className="mb-6 p-3 rounded-xl text-center bg-green-50 text-green-700 border border-green-200 animate-fade-in font-bold">🎉 {CHECKOUT_CONTENT.labels.saved} {Math.floor(breakdown.totalSavings)} 元</div>)}
                        
                        <div className="mb-8 bg-gray-50 p-1 rounded-xl flex items-center"><div className="pl-3 text-gray-400"><Tag className="w-4 h-4" /></div><input type="text" placeholder={CHECKOUT_CONTENT.labels.inputPlaceholder} className="flex-1 bg-transparent border-none text-sm px-3 py-2 focus:ring-0 text-gray-800 placeholder-gray-400" value={inputCode} onChange={(e) => setInputCode(e.target.value)} onKeyDown={handleKeyDown} /><button onClick={handleAddDiscount} className="bg-white shadow-sm border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg hover:text-primary-500 transition-colors">{CHECKOUT_CONTENT.labels.redeem}</button></div>
                        
                        {discountNotification && (<div className={`mb-6 p-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in ${discountNotification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : discountNotification.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>{discountNotification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {discountNotification.message}</div>)}
                        
                        {appliedDiscounts.length > 0 && (<div className="flex flex-wrap gap-2 mb-8">{appliedDiscounts.map((discount, idx) => (<div key={idx} className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"><span>{discount.label}</span><button onClick={() => removeDiscount(discount.code)} className="hover:text-red-700"><X className="w-3 h-3" /></button></div>))}</div>)}
                        
                        {selectedSize && (<div className="mb-8 border border-gray-200 rounded-2xl overflow-hidden"><div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between"><h4 className="text-sm font-bold text-gray-700 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-gray-500" />{CHECKOUT_CONTENT.labels.disclaimerTitle}</h4><div className="text-[10px] text-gray-400">{CHECKOUT_CONTENT.labels.readSign}</div></div><div className="divide-y divide-gray-100">{Object.entries(DISCLAIMER_CONTENT).filter(([key]) => key !== 'slideText' && key !== 'slideSuccessText').map(([key, section]: [string, any]) => (<div key={key} className="bg-white"><button onClick={() => toggleAccordion(key)} className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"><div><div className="text-xs font-bold text-gray-700">{section.title}</div><div className="text-[10px] text-gray-400">{section.summary}</div></div><ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${expandedSection === key ? 'rotate-180' : ''}`} /></button>{expandedSection === key && (<div className="px-4 py-3 bg-gray-50/50 text-xs text-gray-500 leading-relaxed animate-fade-in space-y-2">{section.intro && <p className="mb-2 italic">{section.intro}</p>}{section.content?.map((item: any, i: number) => (<div key={i} className={`p-2 rounded ${item.highlight ? 'bg-red-50 text-red-600 border border-red-100' : ''}`}>{item.title && <span className="font-bold block mb-1">{item.title}</span>}{item.text}</div>))}{section.steps && (<ol className="list-decimal list-inside space-y-1 mt-2">{section.steps.map((step: string, i: number) => <li key={i}>{step}</li>)}</ol>)}{section.promiseText && (<div className="mt-3 bg-green-50 p-2 rounded border border-green-100 text-green-700"><div className="font-bold mb-1">{section.promiseTitle}</div>{section.promiseText}</div>)}</div>)}</div>))}</div><div className="p-6 bg-gradient-to-b from-white to-gray-50" id="contract-slider"><div className="relative h-12 rounded-full bg-gray-200 overflow-hidden shadow-inner flex items-center"><div className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-opacity duration-300 ${isContractSigned ? 'text-green-600' : 'text-gray-400'}`}>{isContractSigned ? DISCLAIMER_CONTENT.slideSuccessText : DISCLAIMER_CONTENT.slideText}</div><div className={`absolute left-0 top-0 bottom-0 bg-green-400 transition-all duration-100 opacity-20`} style={{ width: `${sliderValue}%` }}></div><input ref={sliderRef} type="range" min="0" max="100" value={isContractSigned ? 100 : sliderValue} onChange={handleSliderChange} onTouchEnd={handleSliderEnd} onMouseUp={handleSliderEnd} disabled={isContractSigned} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" /><div className={`absolute top-1 bottom-1 w-10 rounded-full shadow-md flex items-center justify-center transition-all duration-100 z-10 pointer-events-none ${isContractSigned ? 'bg-green-500 text-white right-1' : 'bg-white text-gray-400 left-1'}`} style={!isContractSigned ? { left: `calc(${sliderValue}% - ${sliderValue * 0.4}px)` } : {}}>{isContractSigned ? <Lock className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}</div></div></div></div>
                    </div>
                </div>
                
                <div className="h-4"></div>
                
                <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 safe-area-bottom">
                    <div className="flex gap-2 md:gap-3 items-stretch">
                        <button onClick={handlePrimaryAction} disabled={!isContractSigned} className="group flex-grow h-14 flex flex-col items-center justify-center gap-1 p-2 md:p-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white transition-all active:scale-95 shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                        <span className="text-sm font-bold leading-tight">{CHECKOUT_CONTENT.actions.copy.label}</span>
                        </button>
                        <div className="relative" ref={popoverRef}>
                        <button onClick={() => setShowShieldPopover(prev => !prev)} className="group h-14 w-14 flex items-center justify-center p-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-500 transition-all active:scale-95">
                            <Shield className="w-6 h-6" />
                        </button>
                        {showShieldPopover && (
                            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 animate-fade-in-up z-30">
                            <a href={isContractSigned ? CONTACT_INFO.platformLink : undefined} target="_blank" rel="noopener noreferrer" className={`block w-full text-center text-xs p-2 rounded-lg transition-colors ${isContractSigned ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`} onClick={(e) => { if (!isContractSigned) e.preventDefault(); }}>
                                {CHECKOUT_CONTENT.actions.platform.popoverText}
                            </a>
                            </div>
                        )}
                        </div>
                    </div>
                    {!isContractSigned && (<div className="text-center mt-3 text-[10px] text-gray-400 flex items-center justify-center gap-1 animate-pulse"><ShieldAlert className="w-3 h-3" /><span>{CHECKOUT_CONTENT.actions.platform.lockedHint}</span></div>)}
                </div>
                </>
            )}
        </>
        )}
      </div>
      <style>{`.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 1rem); } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .animate-shake { animation: shake 0.3s ease-in-out; border-color: #fca5a5; box-shadow: 0 0 0 2px #fee2e2; }`}</style>
    </div>
  );
};

export default CheckoutModal;
