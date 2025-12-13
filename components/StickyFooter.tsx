import React, { useState } from 'react';
import { ArrowRight, ChevronUp, Trash2 } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

const StickyFooter: React.FC = () => {
  const { finalPrice, selectedSize, toggleModal, hasComplexItems, consultationMode, clearOrder } = useOrder();

  const showEstimateBar = selectedSize || consultationMode;

  return (
    <>
      {/* Spacer to prevent content from being hidden behind footer */}
      <div className="h-24"></div>
      
      {showEstimateBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none animate-slide-up">
          <div className="max-w-screen-md mx-auto pointer-events-auto">
            
            {/* FLOATING ACTION BAR - 70/30 SPLIT */}
            <div className="flex h-16 rounded-full overflow-hidden shadow-2xl ring-1 ring-white/20">
              
              {/* LEFT SIDE: Price & Detail (70%) */}
              <button 
                onClick={() => toggleModal(true)}
                className="w-[70%] bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-between px-6 transition-colors relative group"
              >
                 <div className="flex flex-col text-left">
                    <span className="text-[10px] opacity-60 font-medium uppercase tracking-wider">
                      {consultationMode ? 'Status' : 'Estimate'}
                    </span>
                    <div className="flex items-baseline gap-2">
                       {consultationMode ? (
                          <span className="text-sm font-bold text-indigo-300">深度定制咨询</span>
                       ) : (
                          <>
                             <span className="text-xl font-bold font-mono">¥{finalPrice}</span>
                             {hasComplexItems && <span className="text-[10px] text-yellow-500 border border-yellow-500/50 px-1 rounded">含待询项</span>}
                          </>
                       )}
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-white transition-colors">
                    <span>明细</span>
                    <ChevronUp className="w-3 h-3" />
                 </div>

                 {!consultationMode && (
                    <div 
                      onClick={(e) => { e.stopPropagation(); clearOrder(); }}
                      className="absolute top-1/2 -translate-y-1/2 left-[50%] md:left-[60%] w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-600 hover:text-red-400 transition-colors"
                      title="清空订单"
                    >
                       <Trash2 className="w-3 h-3" />
                    </div>
                 )}
              </button>

              {/* RIGHT SIDE: CTA (30%) */}
              <button 
                onClick={() => toggleModal(true)}
                className="w-[30%] bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm flex items-center justify-center gap-1 transition-colors group"
              >
                 <span>{consultationMode ? '下一步' : '去结算'}</span>
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default StickyFooter;