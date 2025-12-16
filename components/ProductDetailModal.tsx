
import React, { useEffect } from 'react';
import { X, Clock, Ruler, Wrench, Sparkles, Wand2, Zap, Settings, Search } from 'lucide-react';
import { Product } from '../types';
import { useOrder } from '../contexts/OrderContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { loadPreset, toggleModal } = useOrder();
  
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

  // One-Click Replica Handler
  const handleReplica = (mode: 'checkout' | 'tweak') => {
    if (product.presetConfig) {
        loadPreset(product.presetConfig);
        onClose();
        
        if (mode === 'checkout') {
            toggleModal(true); // Open Checkout
        } else {
            window.location.href = '#process'; // Go to process
        }
    }
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
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 z-50 p-2 bg-white/80 hover:bg-white backdrop-blur rounded-full transition-colors text-gray-600 hover:text-red-500 shadow-md"
          style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Unified Scrollable Container */}
        <div className="overflow-y-auto custom-scrollbar flex flex-col md:flex-row h-full w-full bg-white overscroll-y-contain">
            
            {/* Left Side: Visuals */}
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

            {/* Right Side: Archive Decryption (Text) */}
            <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col bg-white">
            
              {/* Header */}
              <div className="mb-8 border-b border-gray-100 pb-6 mt-6 md:mt-0">
                  <div className="flex items-center gap-3 text-gray-400 text-xs font-mono uppercase tracking-widest mb-2">
                  <span>Archive Report</span>
                  <span className="w-px h-3 bg-gray-300"></span>
                  <span>{product.archiveId}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight">{product.codeName}</h2>
                  <p className="text-primary-500 font-medium">{product.title}</p>
              </div>

              {/* Static Params (Always visible now as specs) */}
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
              <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">灵感档案</h3>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line text-justify">
                  {product.fullDescription || product.description}
                  </p>
              </div>

              {/* ACTION MODULE: REPLICA (Bottom Placement) */}
              {product.presetConfig && (
                <div className="mt-auto pt-6 border-t border-gray-100 animate-fade-in-up">
                    <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-5 border border-primary-100 shadow-inner relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wand2 className="w-24 h-24 text-primary-500" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                    <Sparkles className="w-3 h-3 fill-current" /> 魔法配方
                                </span>
                                <span className="text-xs font-bold text-primary-800">想要同款魔法？</span>
                            </div>
                            
                            <div className="mb-4">
                                <div className="text-sm font-bold text-gray-800 line-clamp-1">
                                    预设方案：{product.presetConfig.sizeName}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {product.presetConfig.fluidDesc}
                                </div>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-2xl font-bold text-primary-600">¥{product.presetConfig.estimatedPrice || '??'}</span>
                                    <span className="text-xs text-gray-400 font-normal">(包含全套装饰估价)</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => handleReplica('checkout')}
                                    className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold py-3 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                    立即复刻
                                </button>
                                <button 
                                    onClick={() => handleReplica('tweak')}
                                    className="bg-white hover:bg-gray-50 text-primary-600 border border-primary-200 text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
                                >
                                    <Settings className="w-3.5 h-3.5" />
                                    调整配置
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
