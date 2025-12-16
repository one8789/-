

import React from 'react';
import { Gift, Heart, Zap, Star, Palette, Wand2, PartyPopper } from 'lucide-react';
import { BENEFITS_CONTENT } from '../content';

const Benefits: React.FC = () => {
  const { 
    sectionTitle, sectionSubtitle, intro, badge,
    global
  } = BENEFITS_CONTENT;

  const getIcon = (type: string) => {
    switch (type) {
      case 'gift': return <Gift className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'gift': return 'bg-red-50 text-red-600 border-red-200';
      case 'heart': return 'bg-pink-50 text-pink-600 border-pink-200';
      case 'zap': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <section id="benefits" className="py-24 bg-gradient-to-b from-primary-50/30 to-white relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold mb-4 shadow-lg shadow-red-200 animate-bounce">
             <PartyPopper className="w-4 h-4" />
             <span>{badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {sectionTitle}
            <span className="text-primary-400 font-light ml-2">{sectionSubtitle}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {intro}
          </p>
        </div>

        {/* Part 1: Global Benefits - Compact Layout */}
        <div className="grid md:grid-cols-3 gap-4">
          {global.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-primary-100 group relative overflow-hidden flex items-center justify-between transform hover:-translate-y-1">
               
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                   <h3 className="font-bold text-gray-700 text-sm tracking-wide uppercase">{item.title}</h3>
                   {item.badge && (
                     <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">{item.badge}</span>
                   )}
                 </div>
                 
                 <div className="flex items-baseline gap-2 mb-2">
                   <span className="text-3xl md:text-4xl font-black text-primary-600 leading-none tracking-tight">{item.discount}</span>
                   <span className="text-xs text-gray-400 font-medium">{item.subDiscount}</span>
                 </div>
                 
                 <p className="text-gray-500 text-xs leading-tight pr-2 font-medium">
                   {item.desc}
                 </p>
               </div>

               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 ${getIconColor(item.iconType || '')}`}>
                 {getIcon(item.iconType || '')}
               </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Benefits;