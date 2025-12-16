

import React, { useState } from 'react';
import { ArrowDown, Star, Sparkles, PenTool, Sprout, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { HERO_CONTENT } from '../content';
import { useOrder } from '../contexts/OrderContext';

const Hero: React.FC = () => {
  const { 
    welcomeTag, title, subtitle, slogan, story, buttons, heroImage, showcaseCard 
  } = HERO_CONTENT;

  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const { setConsultationMode, toggleModal } = useOrder();

  const handleAction = (e: React.MouseEvent, action?: string) => {
    if (action === 'consult') {
      e.preventDefault();
      setConsultationMode(true);
      toggleModal(true);
    }
  };

  const getButtonStyle = (style: string, isMain?: boolean) => {
    const baseClasses = "rounded-full transition-all flex items-center justify-center gap-2 group w-full md:w-auto font-semibold";
    if (isMain) {
      return `bg-primary-500 text-white px-8 py-4 hover:bg-primary-600 shadow-lg shadow-primary-200 ${baseClasses}`;
    }
    // Secondary button style
    return `relative overflow-hidden bg-white/70 text-primary-600 border border-primary-100 px-5 py-2 hover:text-primary-700 shadow-md shadow-primary-100/50 text-sm ${baseClasses}`;
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-20 left-1/3 w-[300px] h-[300px] bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-primary-100 shadow-sm text-primary-600 text-sm font-medium animate-fade-in-down">
            <Star className="w-4 h-4 fill-current" />
            <span>{welcomeTag}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight tracking-tight">
            {title} <span className="font-light text-3xl md:text-4xl lg:text-5xl text-gray-500">{subtitle}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-500 font-medium">
             {slogan}
          </p>

          {/* CTA Buttons - Placed prominently above the fold */}
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start pt-4 w-full md:w-auto items-center">
            {Array.isArray(buttons) && buttons.map((btn, idx) => (
              <a 
                key={idx}
                href={btn.href} 
                onClick={(e) => handleAction(e, btn.action)}
                className={getButtonStyle(btn.style, btn.main)}
              >
                {btn.style === 'light' && (
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                )}
                <span className="relative flex items-center gap-2">
                  {btn.label}
                </span>
              </a>
            ))}
          </div>

          {/* Progressive Disclosure: The Story */}
          <div className="w-full max-w-lg">
             <button 
                onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                className="flex items-center justify-center md:justify-start gap-1 text-sm text-gray-400 hover:text-primary-500 transition-colors mx-auto md:mx-0 mt-2 py-2 group"
             >
                <span>{isStoryExpanded ? '收起工坊故事' : '关于工坊主 / 了解更多'}</span>
                {isStoryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />}
             </button>

             <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isStoryExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white/50 p-6 rounded-2xl border border-white/60 shadow-sm backdrop-blur-sm text-left">
                   <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                      {story}
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Hero Image / Visualization */}
        <div className="relative group w-full max-w-md mx-auto md:max-w-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-300 to-purple-300 rounded-[2.5rem] rotate-3 opacity-20 transform transition-transform group-hover:rotate-6 duration-500"></div>
          <div className="relative bg-white p-4 rounded-[2rem] shadow-xl transform transition-transform group-hover:-translate-y-2 duration-500 border border-white/50">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 relative">
               <img 
                 src={heroImage} 
                 alt="Hero Showcase" 
                 className="w-full h-full object-cover"
               />
               {/* Overlay mimicking reflection/shine */}
               <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/10 pointer-events-none"></div>
            </div>
            <div className="pt-4 flex justify-between items-center px-2">
               <div>
                 <h3 className="font-bold text-gray-800">{showcaseCard.title}</h3>
                 <p className="text-sm text-gray-400">{showcaseCard.subtitle}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                 <Sparkles className="w-5 h-5" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce text-primary-300 hidden md:block">
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
};

export default Hero;