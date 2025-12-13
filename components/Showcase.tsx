import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Copy, Star, Check, Gift, Trophy } from 'lucide-react';
import { SHOWCASE_CONTENT, SHOWCASE_DATA } from '../content';
import { ShowcaseItem } from '../types';

interface ShowcaseCardProps {
  item: ShowcaseItem;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ item }) => {
  return (
    <div 
      className="relative w-64 md:w-72 shrink-0 rounded-2xl overflow-hidden shadow-lg select-none group"
      onDragStart={(e) => e.preventDefault()}
    >
      <img 
        src={item.img} 
        alt={`Showcase by ${item.author}`} 
        className="w-full h-auto aspect-[3/4] object-cover pointer-events-none" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0 border border-white/30">
              {item.avatar && <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />}
            </div>
            <h4 className="font-bold text-sm leading-tight whitespace-normal break-words flex-1">
              {item.author}
            </h4>
        </div>
         <p className="text-xs italic mt-2 opacity-80 line-clamp-2 font-light">
           {item.comment}
         </p>
      </div>
    </div>
  );
};

const Showcase: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { sectionTitle, sectionSubtitle, intro, cta } = SHOWCASE_CONTENT;

  const handleCopy = () => {
    navigator.clipboard.writeText('#小狼工坊');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 3 Sets for infinite looping
  const loopData = [...SHOWCASE_DATA, ...SHOWCASE_DATA, ...SHOWCASE_DATA];

  // Animation Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  
  // Physics State
  const state = useRef({
    currentX: -1000, // Initial placeholder
    velocity: 0.6,   // Base auto-scroll speed (positive = right)
    targetVelocity: 0.6,
    isDragging: false,
    lastMouseX: 0,
    initialized: false
  });

  const animate = useCallback(() => {
    const s = state.current;
    
    // Inertia & Auto-recovery
    if (!s.isDragging) {
      // Smoothly interpolate velocity back to targetVelocity
      // Uses a simple lerp for smooth recovery
      s.velocity += (s.targetVelocity - s.velocity) * 0.05;
    }
    
    // Apply velocity
    s.currentX += s.velocity;

    // Loop Logic
    if (innerRef.current) {
      const totalWidth = innerRef.current.scrollWidth;
      const oneSetWidth = totalWidth / 3;
      
      // Initialize position to middle set once width is known
      if (!s.initialized && totalWidth > 0) {
         s.currentX = -oneSetWidth;
         s.initialized = true;
      }

      // Infinite Loop Check (Moving Right typically increases X towards 0 from negative)
      // Logic: If we are moving right (positive velocity), we go from -2W to -W to 0.
      // When we hit 0 (start of Set 1), we look identical to start of Set 2 (-W). Jump back.
      if (s.currentX >= 0) {
        s.currentX = -oneSetWidth;
      }
      // If user drags left past the boundary
      else if (s.currentX <= -2 * oneSetWidth) {
        s.currentX = -oneSetWidth;
      }

      innerRef.current.style.transform = `translate3d(${s.currentX}px, 0, 0)`;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  // Event Handlers
  const handleStart = (clientX: number) => {
    state.current.isDragging = true;
    state.current.lastMouseX = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!state.current.isDragging) return;
    const delta = clientX - state.current.lastMouseX;
    state.current.lastMouseX = clientX;
    
    state.current.currentX += delta;
    state.current.velocity = delta; // Transfer momentum
  };

  const handleEnd = () => {
    state.current.isDragging = false;
  };

  return (
    <section id="star-echo" className="py-24 bg-gray-900 text-white overflow-hidden relative select-none">
      
      {/* REWARDS SECTION */}
      <div className="container mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* 星火奖 Card */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/80 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary-400" />
              【星火奖】· 被看见的微光
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              只要你的返图被小狼官网收录：
              立即获得 <span className="text-primary-300 font-bold">¥20 无门槛星尘金</span>
              <br/>
              <span className="opacity-60 text-xs">(不玩虚的折扣，直接当钱花！)</span>
            </p>
          </div>

          {/* 星灵奖 Card */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6 hover:bg-gray-800/80 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
               <Trophy className="w-5 h-5 text-yellow-400" />
               【星灵奖】· 命运的垂青
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              所有入选星火奖的作者，年底自动进入“免单锦鲤池”。
              <br/>
              工坊纪念日抽取一位送出 <span className="text-yellow-300 font-bold">【年度限定 · 绝对免单权】</span>
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
          {sectionTitle}
          <span className="text-primary-400 font-light ml-3 text-3xl">{sectionSubtitle}</span>
        </h2>
        <div className="w-16 h-1 bg-primary-500 mx-auto rounded-full my-4"></div>
        <p className="text-gray-400 max-w-2xl mx-auto">{intro}</p>
      </div>

      {/* Draggable WaterFall Container */}
      <div 
        className="w-full overflow-hidden pb-10 cursor-grab active:cursor-grabbing"
        ref={containerRef}
        onMouseDown={e => handleStart(e.clientX)}
        onMouseMove={e => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0].clientX)}
        onTouchMove={e => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
         <div 
           ref={innerRef}
           className="flex gap-6 w-max pl-6 will-change-transform"
         >
            {loopData.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                className={`transform transition-transform duration-300 ${idx % 2 === 0 ? 'translate-y-8' : '-translate-y-2'}`}
              >
                <ShowcaseCard item={item} />
              </div>
            ))}
         </div>
      </div>

      {/* CTA Banner */}
      <div className="container mx-auto px-6 mt-12">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-full p-2 pr-8 border border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
           <div className="flex items-center gap-4 px-6 py-2">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                 <Star className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                 <h3 className="text-white font-bold text-sm md:text-base">{cta.headline}</h3>
                 <p className="text-gray-400 text-xs hidden md:block">{cta.subhead}</p>
              </div>
           </div>
           
           <button 
              onClick={handleCopy}
              className={`px-6 py-2 rounded-full font-bold transition-all duration-300 shadow-lg text-sm flex items-center gap-2
              ${copied ? 'bg-green-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
           >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? cta.copiedText : cta.buttonText}
           </button>
        </div>
      </div>
    </section>
  );
};

export default Showcase;