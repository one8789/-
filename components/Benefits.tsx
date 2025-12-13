import React from 'react';
import { Gift, Heart, Zap, Star, Palette, Wand2, PartyPopper } from 'lucide-react';
import { BENEFITS_CONTENT } from '../content';

const Benefits: React.FC = () => {
  const { 
    sectionTitle, sectionSubtitle, intro, badge,
    global, special 
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
      case 'gift': return 'bg-red-50 text-red-500 border-red-100';
      case 'heart': return 'bg-pink-50 text-pink-500 border-pink-100';
      case 'zap': return 'bg-yellow-50 text-yellow-500 border-yellow-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  return (
    <section id="benefits" className="py-24 bg-gradient-to-b from-primary-50/30 to-white relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold mb-4 shadow-sm border border-red-100 animate-bounce">
             <PartyPopper className="w-4 h-4" />
             <span>{badge}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {sectionTitle}
            <span className="text-primary-400 font-light ml-2">{sectionSubtitle}</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {intro}
          </p>
        </div>

        {/* Part 1: Global Benefits - Compact Layout */}
        <div className="grid md:grid-cols-3 gap-4 mb-20">
          {global.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-primary-100 group relative overflow-hidden flex items-center justify-between">
               
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                   <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                   {item.badge && (
                     <span className="bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">{item.badge}</span>
                   )}
                 </div>
                 
                 <div className="flex items-baseline gap-2 mb-1">
                   <span className="text-xl font-bold text-primary-500 leading-none">{item.discount}</span>
                   <span className="text-xs text-gray-400 font-normal">{item.subDiscount}</span>
                 </div>
                 
                 <p className="text-gray-500 text-xs leading-tight pr-2">
                   {item.desc}
                 </p>
               </div>

               <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${getIconColor(item.iconType || '')}`}>
                 {getIcon(item.iconType || '')}
               </div>

            </div>
          ))}
        </div>

        {/* Part 2: Special Benefit */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl border border-primary-100 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 text-center mb-10">
             <div className="inline-flex items-center gap-2 text-primary-600 font-bold bg-primary-50 px-4 py-2 rounded-full mb-4 border border-primary-100 shadow-sm">
               <Star className="w-4 h-4 fill-current animate-pulse" />
               {special.badge}
               <Star className="w-4 h-4 fill-current animate-pulse" />
             </div>
             <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{special.title}</h3>
             <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed whitespace-pre-line text-sm md:text-base">
               {special.desc}
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10 relative z-10">
            {/* Mode 1 */}
            <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-6 rounded-3xl border border-white/60 relative hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-purple-500 shadow-sm border border-purple-100">
                     <Wand2 className="w-4 h-4" />
                   </div>
                   <h4 className="text-lg font-bold text-gray-800">{special.mode1.title}</h4>
                </div>
                <div className="bg-white/80 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-primary-500 shadow-sm border border-primary-100">
                  {special.mode1.tag}
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-3 min-h-[32px] leading-relaxed">
                {special.mode1.desc}
              </p>
              <ul className="text-xs text-gray-500 space-y-2 bg-white/60 p-4 rounded-xl">
                 {special.mode1.points.map((point, i) => (
                   <li key={i} className="flex gap-2 items-start">
                     <span className="text-purple-400 mt-0.5">●</span>
                     <span>{point}</span>
                   </li>
                 ))}
              </ul>
            </div>

            {/* Mode 2 */}
            <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-6 rounded-3xl border border-white/60 relative hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
                     <Palette className="w-4 h-4" />
                   </div>
                   <h4 className="text-lg font-bold text-gray-800">{special.mode2.title}</h4>
                </div>
                <div className="bg-white/80 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-blue-500 shadow-sm border border-blue-100">
                  {special.mode2.tag}
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-3 min-h-[32px] leading-relaxed">
                {special.mode2.desc}
              </p>
              <ul className="text-xs text-gray-500 space-y-2 bg-white/60 p-4 rounded-xl">
                 {special.mode2.points.map((point, i) => (
                   <li key={i} className="flex gap-2 items-start">
                     <span className="text-blue-400 mt-0.5">●</span>
                     <span>{point}</span>
                   </li>
                 ))}
              </ul>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-dashed border-primary-200 relative z-10">
            <h5 className="font-bold text-gray-800 mb-2 flex items-center justify-center gap-2 text-sm">
              <Heart className="w-3 h-3 text-primary-400 fill-current" />
              {special.reasonTitle}
            </h5>
            <p className="text-xs text-gray-500 max-w-3xl mx-auto italic leading-relaxed">
              {special.reasonDesc}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Benefits;