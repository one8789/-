
import React, { useState, useEffect } from 'react';
import { ArrowDown, Star, ChevronDown, ChevronUp, Clock, Heart, Users } from 'lucide-react';
import { HERO_CONTENT, GALLERY_PRODUCTS } from '../content';
import { useOrder } from '../contexts/OrderContext';

// Dynamic Star Trails Component (Simplified for performance & aesthetics)
const StarTrails = () => {
  const [stars, setStars] = useState<Array<{ id: number, top: number, left: number, size: number, delay: number }>>([]);

  useEffect(() => {
    const count = 12;
    const newStars = Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: Math.random() * 80 + 10, // Avoid edges
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * -20,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map(star => (
        <div 
          key={star.id}
          className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: Math.random() * 0.5 + 0.3,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
};

const Hero: React.FC = () => {
  const { 
    welcomeTag, title, subtitle, slogan, story, buttons
  } = HERO_CONTENT;

  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const { setConsultationMode, toggleModal } = useOrder();

  // Use real images for the showcase
  const showcaseImages = GALLERY_PRODUCTS.slice(0, 3);

  const handleAction = (e: React.MouseEvent, action?: string) => {
    if (action === 'consult') {
      e.preventDefault();
      setConsultationMode(true);
      toggleModal(true);
    }
  };

  const getButtonStyle = (style: string, isMain?: boolean) => {
    const baseClasses = "rounded-full transition-all flex items-center justify-center gap-2 group w-full md:w-auto font-semibold backdrop-blur-sm";
    if (isMain) {
      return `bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 hover:shadow-lg hover:shadow-primary-300/50 hover:-translate-y-1 ${baseClasses}`;
    }
    return `bg-white/60 text-primary-700 border border-white/50 px-6 py-4 hover:bg-white hover:text-primary-600 hover:shadow-md ${baseClasses}`;
  };

  return (
    <section id="home" className="relative min-h-[95vh] flex items-center pt-28 pb-12 overflow-hidden bg-gradient-to-b from-[#fff1f2] via-[#fff5f7] to-white">
      
      {/* --- Ambient Background Effects (Aurora) --- */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-primary-200/40 to-purple-300/30 rounded-full blur-[120px] mix-blend-multiply animate-float" style={{ animationDuration: '15s' }}></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-yellow-200/40 to-primary-100/40 rounded-full blur-[100px] mix-blend-multiply animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
      <StarTrails />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* --- LEFT: Text Content --- */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left relative">
            
            {/* Glass Card Container for Text (Desktop Only) */}
            <div className="lg:bg-white/30 lg:backdrop-blur-md lg:p-8 lg:rounded-[2rem] lg:border lg:border-white/50 lg:shadow-xl lg:shadow-primary-100/20 transition-all duration-500">
              
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary-100 shadow-sm text-primary-600 text-sm font-bold tracking-wide animate-fade-in-down mb-6">
                <Star className="w-4 h-4 fill-current animate-spin-slow" />
                <span>{welcomeTag}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-800 leading-[1.1] tracking-tight mb-4">
                <span className="block">{title}</span>
                <span className="block font-light text-3xl md:text-4xl lg:text-5xl text-gray-400 font-serif mt-2 italic">{subtitle}</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-purple-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                 {slogan}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 py-6 border-b border-dashed border-primary-200/50 mb-6">
                 <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4 text-primary-400" />
                    <span>纯手工慢酿</span>
                 </div>
                 <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Heart className="w-4 h-4 text-primary-400" />
                    <span>孤品级定制</span>
                 </div>
                 <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Users className="w-4 h-4 text-primary-400" />
                    <span>200+ 契约达成</span>
                 </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full items-center">
                {Array.isArray(buttons) && buttons.map((btn, idx) => (
                  <a 
                    key={idx}
                    href={btn.href} 
                    onClick={(e) => handleAction(e, btn.action)}
                    className={getButtonStyle(btn.style, btn.main)}
                  >
                    {btn.label}
                  </a>
                ))}
              </div>

              {/* Story Dropdown */}
              <div className="mt-6">
                 <button 
                    onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                    className="flex items-center justify-center lg:justify-start gap-1 text-xs text-gray-400 hover:text-primary-500 transition-colors mx-auto lg:mx-0 py-2 group font-medium tracking-widest uppercase"
                 >
                    <span>{isStoryExpanded ? 'Close Story' : 'Read The Story'}</span>
                    {isStoryExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />}
                 </button>

                 <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isStoryExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="bg-white/60 p-4 rounded-xl border border-white/60 text-left text-sm text-gray-600 leading-relaxed whitespace-pre-line shadow-inner">
                       {story}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: Visual Showcase (Desktop Only) --- */}
          {/* This creates a floating, layered card effect to showcase the products */}
          <div className="hidden lg:block lg:col-span-6 relative h-[600px] w-full perspective-1000">
             
             {/* Decorative Orbit Rings */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-dashed border-primary-200/50 rounded-full animate-[spin_60s_linear_infinite]" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-primary-100/60 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
             
             {/* Main Floating Cards Composition */}
             <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Back Card (Left) */}
                <div className="absolute top-20 left-10 w-48 h-64 bg-white p-2 rounded-2xl shadow-xl transform -rotate-12 animate-float opacity-80 blur-[1px] hover:blur-0 hover:opacity-100 transition-all duration-500 hover:z-20" style={{ animationDelay: '0s' }}>
                   <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
                      <img src={showcaseImages[1]?.imageUrl || 'https://picsum.photos/300/400'} className="w-full h-full object-cover" alt="Showcase Back" />
                   </div>
                </div>

                {/* Back Card (Right) */}
                <div className="absolute bottom-24 right-10 w-44 h-60 bg-white p-2 rounded-2xl shadow-xl transform rotate-12 animate-float opacity-80 blur-[1px] hover:blur-0 hover:opacity-100 transition-all duration-500 hover:z-20" style={{ animationDelay: '2s' }}>
                   <div className="w-full h-full bg-gray-100 rounded-xl overflow-hidden">
                      <img src={showcaseImages[2]?.imageUrl || 'https://picsum.photos/300/400'} className="w-full h-full object-cover" alt="Showcase Back" />
                   </div>
                </div>

                {/* Center Hero Card */}
                <div className="relative z-10 w-64 h-80 bg-white/80 backdrop-blur-md p-3 rounded-[2rem] shadow-2xl border border-white transform hover:scale-105 transition-transform duration-500 animate-float" style={{ animationDelay: '1s' }}>
                   <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg animate-bounce">
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                   </div>
                   <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden shadow-inner relative group cursor-default">
                      <img src={showcaseImages[0]?.imageUrl || 'https://picsum.photos/400/500'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Showcase Main" />
                      
                      {/* Reflection Glare */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full" style={{ transitionDuration: '1s' }}></div>
                      
                      {/* Label */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <p className="font-bold text-sm">N°{showcaseImages[0]?.archiveId || '001'}</p>
                         <p className="text-xs opacity-80">点击下方按钮定制同款</p>
                      </div>
                   </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-primary-400 rounded-full blur-[2px] animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full blur-[1px] animate-pulse" style={{ animationDelay: '1s' }}></div>
             </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce text-primary-300 hidden md:flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}>
        <span className="text-[10px] font-bold tracking-widest uppercase">Explore</span>
        <ArrowDown className="w-5 h-5" />
      </div>
    </section>
  );
};

export default Hero;
