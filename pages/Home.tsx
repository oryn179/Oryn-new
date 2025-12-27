
import React, { useState, useEffect } from 'react';
import { GOOGLE_FORM_LINK, TOURNAMENT_END_DATE } from '../constants';

const Home: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TOURNAMENT_END_DATE - now;
      
      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 animate-pulse">
        <h1 className="text-5xl md:text-8xl font-bold font-mono mb-4 tracking-tighter">
          <span className="neon-text">ORYN</span> TOURNAMENT
        </h1>
        <p className="text-gray-400 text-xl font-mono tracking-widest uppercase">
          Elite Video Editor Championship
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 max-w-4xl mx-auto">
        {Object.entries(timeLeft).map(([label, value]) => (
          <div key={label} className="bg-white/5 border border-[#39FF14]/20 p-6 rounded-lg text-center backdrop-blur-sm shadow-xl">
            <div className="text-4xl md:text-6xl font-bold font-mono neon-text">{value}</div>
            <div className="text-xs font-mono uppercase text-gray-500 mt-2">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#39FF14]/5 border-2 border-[#39FF14] p-8 md:p-12 rounded-2xl text-center max-w-3xl mx-auto mb-20 shadow-[0_0_30px_rgba(57,255,20,0.1)]">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 italic">
          “Want to register and want to see your edit and want to win?”
        </h2>
        <a 
          href={GOOGLE_FORM_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-12 py-4 neon-button text-xl font-bold font-mono rounded-full transform hover:scale-105 transition-transform"
        >
          REGISTER HERE
        </a>
      </div>

      <section className="mb-20">
        <h3 className="text-3xl font-bold font-mono mb-8 neon-text border-b border-[#39FF14]/30 pb-2">PRIZE PREVIEW</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative overflow-hidden rounded-xl bg-white/5 aspect-video border border-white/10">
              <img 
                src={`https://picsum.photos/seed/${i + 10}/800/450`} 
                alt={`Prize ${i}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-2xl font-bold font-mono neon-text">#{i} PLACE</span>
                  <p className="text-gray-300 text-sm">Professional Editing Gear + Cash Prize</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
