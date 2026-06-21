"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] bg-[#0a0510] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Deep Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>

      {/* Cyberpunk Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      {/* Main Logo & Text container */}
      <div className="relative flex flex-col items-center z-10">
        
        {/* Animated Paranoia Glitch Text */}
        <div className="relative">
          <h1 className="text-6xl md:text-8xl font-black font-outfit text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500 tracking-widest uppercase drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] z-20" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
            PARANOIA
          </h1>
          <h1 className="absolute inset-0 text-6xl md:text-8xl font-black font-outfit text-white tracking-widest uppercase opacity-50 z-10" style={{ transform: 'translateX(-4px)', animation: 'glitch-r 2s infinite linear alternate-reverse' }}>
            PARANOIA
          </h1>
          <h1 className="absolute inset-0 text-6xl md:text-8xl font-black font-outfit text-fuchsia-500 tracking-widest uppercase opacity-50 z-10" style={{ transform: 'translateX(4px)', animation: 'glitch-b 3s infinite linear alternate' }}>
            PARANOIA
          </h1>
        </div>

        {/* Loading Bar Container */}
        <div className="mt-12 w-64 h-1.5 bg-white/5 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          {/* Progress fill */}
          <div className="h-full w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 origin-left animate-[scale-x_2s_ease-in-out_infinite]"></div>
          {/* Glare overlay */}
          <div className="absolute inset-0 bg-white/20 w-1/4 blur-sm animate-[slide-right_1.5s_ease-in-out_infinite]"></div>
        </div>

        {/* Loading text */}
        <div className="mt-6 flex items-center gap-3 text-purple-200/60 font-bold uppercase tracking-[0.4em] text-sm">
          <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping"></span>
          Initialisation
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" style={{ animationDelay: '0.2s' }}></span>
        </div>

      </div>

      {/* CSS additions for this loading screen */}
      <style jsx>{`
        @keyframes scale-x {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
