"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, Sparkles, Clock, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import Countdown from "@/components/home/Countdown";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(179,102,255,0.15)_0%,transparent_60%)] rounded-full blur-[80px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="panel-matte rounded-3xl p-10 max-w-2xl w-full text-center relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-[var(--color-accent-purple)]/20"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-purple)]/5 to-transparent rounded-3xl pointer-events-none"></div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 relative inline-block"
        >
          <div className="absolute inset-0 bg-[var(--color-accent-purple)] blur-3xl opacity-20 rounded-full"></div>
          <Image 
            src="/Paranoia_no_effect.png" unoptimized 
            alt="PARANOIA SMP" 
            width={300} 
            height={100} 
            className="w-full max-w-[200px] md:max-w-[250px] object-contain mx-auto drop-shadow-[0_0_15px_rgba(179,102,255,0.5)]"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-purple)]/10 border border-[var(--color-accent-purple)]/30 text-[var(--color-accent-purple-glow)] text-sm font-semibold uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            Accès Restreint
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-black font-outfit text-white mb-6 tracking-tight text-gradient"
        >
          OUVERTURE PROCHAINE
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-[var(--color-text-secondary)] mb-10 leading-relaxed max-w-xl mx-auto"
        >
          Le site officiel de Paranoia SMP est actuellement en cours de préparation. 
          L'accès complet sera déverrouillé très bientôt pour tous les membres de la liste blanche.
        </motion.p>

        <Countdown />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 pt-8 border-t border-[var(--color-border-color)] flex flex-col items-center"
        >
          <p className="text-xs text-[var(--color-text-muted)] mb-4 uppercase tracking-widest">
            Accès Administrateur
          </p>
          <button 
            onClick={() => signIn("discord")}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] hover:border-[var(--color-accent-purple)]/50 hover:bg-[var(--color-accent-purple)]/10 transition-all text-sm font-semibold text-[var(--color-text-secondary)] hover:text-white"
          >
            <LogIn className="w-4 h-4" />
            Connexion Staff
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
