"use client";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-accent-purple)] rounded-full blur-[200px] opacity-10 pointer-events-none animate-pulse"></div>

      {/* Logo Pulse */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl animate-pulse">
          <svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="absolute -inset-4 bg-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
      </div>

      {/* Loading Bar */}
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mb-6">
        <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full animate-loading-bar"></div>
      </div>

      {/* Text */}
      <p className="text-sm text-[var(--color-text-muted)] uppercase tracking-[0.3em] font-bold animate-pulse">
        Chargement
      </p>

      {/* Decorative */}
      <div className="absolute bottom-10 left-10 text-[10vw] font-black text-white/[0.015] select-none pointer-events-none uppercase">
        Loading
      </div>
    </div>
  );
}
