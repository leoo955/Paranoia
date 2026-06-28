"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Trophy, FileText, Sparkles, ChevronRight, ShieldAlert, Swords, Layers, Zap } from "lucide-react";

interface HomePageClientProps {
  stats: {
    users: number | string;
    topics: number | string;
    cards: number | string;
  };
}

export default function HomePageClient({ stats }: HomePageClientProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] overflow-hidden selection:bg-purple-500/30">
      <section className="relative w-full min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c0f2e] via-[#120a1f] to-[#0a0a0f] z-0"></div>
        <div className="relative z-10 text-center px-4 mt-20 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block mb-8 relative"
          >
            <Image 
              src="/Paranoia_logo.png" unoptimized 
              alt="PARANOIA SMP" 
              width={800} 
              height={266} 
              className="w-full max-w-[400px] md:max-w-[700px] object-contain drop-shadow-lg"
              priority
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-black font-outfit text-zinc-100 mb-6 uppercase tracking-wider glitch-text"
          >
            Survivez. <span className="text-[var(--color-accent-purple)]">Trahissez.</span> Dominez.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-zinc-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Une aventure Minecraft impitoyable sous liste blanche. Forgez des alliances, brisez-les, et laissez votre empreinte dans l'histoire du serveur.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link href="/candidature" className="group flex items-center justify-center gap-3 w-full sm:w-auto btn-primary">
              Rejoindre la Whitelist
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="flex items-center justify-center gap-2 w-full sm:w-auto btn-secondary">
              Explorer
            </Link>
          </motion.div>
        </div>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-500"
        >
          <span className="text-xs uppercase tracking-widest mb-2 font-bold opacity-50">Découvrir</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-gray-500/50 to-transparent"></div>
        </motion.div>
      </section>

      <section className="w-full bg-zinc-950 border-y border-zinc-800 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-800 text-center">
            {[
              { icon: ShieldAlert, color: "text-red-500", value: stats.users, label: "Survivants Vérifiés" },
              { icon: MessageSquare, color: "text-zinc-400", value: stats.topics, label: "Discussions & Conflits" },
              { icon: Sparkles, color: "text-amber-500", value: stats.cards, label: "Cartes Tirées" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 flex flex-col items-center justify-center group"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                <div className="text-5xl font-black font-outfit text-zinc-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-zinc-500 uppercase tracking-widest text-xs font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-32 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black font-outfit text-zinc-100 mb-4 glitch-text"
            >
              Plus qu&apos;un simple serveur.
            </motion.h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Une expérience connectée totale. Le site web interagit en temps réel avec le serveur Minecraft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-[300px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950"
            >
              <div className="relative z-10 h-full flex flex-col p-8 md:p-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 w-fit mb-4">
                  <Sparkles className="w-4 h-4" /> Trading Cards
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-4 font-outfit leading-tight">
                  Collectionnez <br/> <span className="text-purple-500">les Légendes.</span>
                </h3>
                <p className="text-zinc-400 text-lg max-w-md mb-8">
                  Achetez des boosters, droppez des cartes 3D animées des joueurs du serveur et complétez votre collection.
                </p>
                <div className="mt-auto">
                  <Link href="/cards" className="inline-flex items-center gap-2 font-bold text-purple-500 hover:text-purple-400 transition-colors group/link">
                    Ouvrir des Boosters <ChevronRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 pointer-events-none perspective-[1000px]">
                <div className="w-full h-full bg-[url('/MythiqueB.png')] bg-contain bg-no-repeat bg-bottom opacity-50 group-hover:opacity-100 group-hover:rotate-[-5deg] group-hover:scale-110 transition-all duration-700 transform-gpu"></div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 p-8 flex flex-col"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 w-fit mb-4">
                <Trophy className="w-4 h-4" /> Compétition
              </div>
              <h3 className="text-2xl font-black text-white mb-3 font-outfit">Tier Lists</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Le classement officiel du serveur. Votez et définissez qui sont les meilleurs joueurs en PvP.
              </p>
              <div className="mt-auto relative z-10">
                <Link href="/tier-list" className="inline-flex items-center gap-2 font-bold text-amber-500 hover:text-amber-400 transition-colors group/link">
                  Voir les classements <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              <Swords className="absolute -bottom-4 -right-4 w-32 h-32 text-amber-500/5 group-hover:text-amber-500/10 group-hover:scale-110 transition-all duration-500 rotate-[-15deg]" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative group rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 p-8 flex flex-col"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 w-fit mb-4">
                <MessageSquare className="w-4 h-4" /> Diplomatie
              </div>
              <h3 className="text-2xl font-black text-white mb-3 font-outfit">Forum Intégré</h3>
              <p className="text-zinc-400 text-sm mb-6">
                Annonces officielles, déclarations de guerre, recherche de factions. Tout se passe ici.
              </p>
              <div className="mt-auto relative z-10">
                <Link href="/forum" className="inline-flex items-center gap-2 font-bold text-blue-500 hover:text-blue-400 transition-colors group/link">
                  Rejoindre le forum <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
              <MessageSquare className="absolute -bottom-4 -right-4 w-32 h-32 text-blue-500/5 group-hover:text-blue-500/10 group-hover:scale-110 transition-all duration-500" />
            </motion.div>

          </div>
        </div>
      </section>

      <section className="relative w-full py-32 overflow-hidden mt-12 border-t border-zinc-800 bg-[#0a0a0f]">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
          <ShieldAlert className="w-16 h-16 text-purple-500 mx-auto mb-8 opacity-80" />
          <h2 className="text-4xl md:text-6xl font-black font-outfit text-white mb-6 uppercase tracking-wider glitch-text">
            Prêt à survivre ?
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Le serveur est actuellement sous liste blanche stricte. Seuls les joueurs les plus motivés et stratèges seront acceptés.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/candidature" className="inline-flex items-center justify-center gap-3 btn-primary text-xl">
              Soumettre ma Candidature
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
