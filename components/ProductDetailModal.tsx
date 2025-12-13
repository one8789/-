import React, { useEffect } from 'react';
import { X, Clock, Ruler, Wrench, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  
  // Lock Body Scroll on Mount
  useEffect(() => {
    // Save original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Prevent clicks inside the modal from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleStartCommission = () => {
    onClose();
    window.location.href = '#process';
  };

  // Combine all images into one array for consistent rendering
  const allImages = [product.imageUrl, ...(product.galleryImages || [])];

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[2rem] shadow-2xl relative animate-scale-up flex flex-col overflow-hidden"
        onClick={handleContentClick}
      >
        {/* Close Button - Safe Area Aware 
            Using style top ensures it respects safe area inset on supported browsers/PWA contexts 
        */}
        <button 
          onClick={onClose}
          className="absolute right-4 z-50 p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full transition-colors text-gray-600 hover:text-red-500 shadow-md"
          style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <X className="w-6 h-6" />
        </button>

        {/* 
           Unified Scrollable Container 
           - overflow-y-auto handles the scroll for the whole modal content
           - flex-col for Mobile (Images Top, Text Bottom)
           - md:flex-row for Desktop (Images Left, Text Right)
           - overscroll-y-contain prevents body scroll chaining
        */}
        <div className="overflow-y-auto custom-scrollbar flex flex-col md:flex-row h-full w-full bg-white overscroll-y-contain">
            
            {/* 
               Left Side: Visuals 
               - w-full on mobile, w-3/5 on desktop
               - Stacks images vertically (gap-4)
               - No height restrictions, let images flow
            */}
            <div className="w-full md:w-3/5 bg-gray-100 p-4 md:p-8 flex flex-col gap-6">
               {allImages.map((img, idx) => (
                 <div key={idx} className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100/50">
                    <img 
                      src={img} 
                      alt={`${product.codeName} view ${idx + 1}`} 
                      className="w-full h-auto object-cover block"
                      loading="lazy"
                    />
                 </div>
               ))}
            </div>

            {/* 
               Right Side: Archive Decryption (Text)
               - w-full on mobile, w-2/5 on desktop
            */}
            <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col bg-white">
            
              {/* Header */}
              {/* Added mt-6 md:mt-0 to give space on mobile in case close button floats over content area */}
              <div className="mb-8 border-b border-gray-100 pb-6 mt-6 md:mt-0">
                  <div className="flex items-center gap-3 text-gray-400 text-xs font-mono uppercase tracking-widest mb-2">
                  <span>Archive Report</span>
                  <span className="w-px h-3 bg-gray-300"></span>
                  <span>{product.archiveId}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight">{product.codeName}</h2>
                  <p className="text-primary-500 font-medium">{product.title}</p>
              </div>

              {/* Craft Parameters */}
              <div className="space-y-6 mb-8">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  工艺参数
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <Ruler className="w-3 h-3" />
                      <span>尺寸规格</span>
                      </div>
                      <div className="font-semibold text-gray-700 text-sm md:text-base">{product.craftParams.size}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <Clock className="w-3 h-3" />
                      <span>制作耗时</span>
                      </div>
                      <div className="font-semibold text-gray-700 text-sm md:text-base">{product.craftParams.time}</div>
                  </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>工艺技法</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                      {product.craftParams.techniques.map((tech, idx) => (
                          <span key={idx} className="text-xs border border-gray-200 bg-white px-2 py-1 rounded text-gray-600">
                          {tech}
                          </span>
                      ))}
                      </div>
                  </div>
              </div>

              {/* Story Description */}
              <div className="mb-10">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">灵感档案</h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line text-justify">
                  {product.fullDescription || product.description}
                  </p>
              </div>

              {/* Footer / CTA - Pushed to bottom of this column */}
              <div className="mt-auto pt-6 border-t border-gray-100">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-medium mb-3">
                      <Lock className="w-3 h-3" />
                      <span>此档案已封存，不可直接购买</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 px-2">
                      但如果你也被这份“{product.codeName.split('·')[0]}”打动，或者有属于你自己的颜色想要封存……
                      </p>
                      
                      <button 
                      onClick={handleStartCommission}
                      className="w-full bg-gray-900 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-primary-200 flex items-center justify-center gap-2 group"
                      >
                      <span>发起你的专属委托</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <div className="mt-2 text-xs text-gray-400">
                      点击跳转至流沙定制指南
                      </div>
                  </div>
              </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;