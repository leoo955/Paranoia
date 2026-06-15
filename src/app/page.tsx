import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Trophy, FileText, Sparkles, LogOut, ChevronRight, ShieldAlert, Swords } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Refresh data every 60 seconds

export default async function Home() {
  // Fetch stats from DB
  const [usersCount, topicsCount, cardsCount] = await Promise.all([
    prisma.user.count({ where: { isMcVerified: true } }).catch(() => 0),
    prisma.topic.count().catch(() => 0),
    prisma.userCard.count().catch(() => 0)
  ]);

  // Fallbacks if stats are 0
  const displayUsers = usersCount > 0 ? usersCount : "???";
  const displayTopics = topicsCount > 0 ? topicsCount : "∞";
  const displayCards = cardsCount > 0 ? cardsCount : "0";

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg-primary)]">
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 z-0"></div>
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--color-accent-red)] rounded-full blur-[200px] opacity-[0.15] z-0 animate-pulse-glow"></div>
        
        {/* Particle/Grid overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0"></div>

        <div className="relative z-10 text-center px-4 mt-20 max-w-5xl mx-auto flex flex-col items-center">
          <div className="animate-slide-up inline-block mb-8 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-purple-600/20 blur-2xl -z-10 rounded-full"></div>
            <Image 
              src="/Paranoia_logo.png" 
              alt="PARANOIA SMP" 
              width={800} 
              height={266} 
              className="w-full max-w-[500px] md:max-w-[700px] object-contain drop-shadow-[0_0_35px_rgba(220,38,38,0.5)]"
              priority
            />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black font-outfit text-white mb-6 uppercase tracking-wider drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
            Survivez. <span className="text-[var(--color-accent-red)]">Trahissez.</span> Dominez.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Une aventure Minecraft impitoyable sous liste blanche. Forgez des alliances, brisez-les, et laissez votre empreinte dans l'histoire du serveur.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/candidature" className="btn-primary group relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 text-lg w-full sm:w-auto">
              <span className="relative z-10 flex items-center gap-2">
                Rejoindre la Whitelist
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="#features" className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-lg w-full sm:w-auto">
              Explorer le Serveur
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-gray-500">
          <span className="text-xs uppercase tracking-widest mb-2 font-bold">Découvrir</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="w-full bg-black/40 backdrop-blur-md border-y border-white/5 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            <div className="p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
              <ShieldAlert className="w-8 h-8 text-[var(--color-accent-red)] mb-4 opacity-80" />
              <div className="text-5xl font-black font-outfit text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{displayUsers}</div>
              <div className="text-gray-400 uppercase tracking-widest text-xs font-bold">Survivants Vérifiés</div>
            </div>
            <div className="p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
              <MessageSquare className="w-8 h-8 text-blue-500 mb-4 opacity-80" />
              <div className="text-5xl font-black font-outfit text-white mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">{displayTopics}</div>
              <div className="text-gray-400 uppercase tracking-widest text-xs font-bold">Discussions & Conflits</div>
            </div>
            <div className="p-6 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
              <Sparkles className="w-8 h-8 text-[var(--color-accent-purple)] mb-4 opacity-80" />
              <div className="text-5xl font-black font-outfit text-white mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">{displayCards}</div>
              <div className="text-gray-400 uppercase tracking-widest text-xs font-bold">Cartes Tirées</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SHOWCASE --- */}
      <section id="features" className="w-full py-24 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          {/* Feature 1: Trading Cards */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-[var(--color-accent-purple)] rounded-full blur-[100px] opacity-20"></div>
              <div className="relative p-1 bg-gradient-to-br from-purple-500/30 to-blue-500/10 rounded-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-purple-900/50">
                <div className="bg-[#111118] rounded-xl p-8 border border-white/10 flex items-center justify-center h-[400px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                  <Sparkles className="w-32 h-32 text-purple-500/50 animate-pulse" />
                  <div className="absolute bottom-6 right-6 font-black text-6xl text-white/5">01</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold border border-purple-500/20">
                <Sparkles className="w-4 h-4" /> Collection exclusive
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-outfit text-white leading-tight">
                Collectionnez <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">L'Histoire du Serveur</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Le serveur possède sa propre économie de cartes à collectionner (TCG). Achetez des boosters avec vos ParaCoins, obtenez des cartes aux raretés variées (Common à Mythic) générées avec les véritables statistiques et skins 3D des joueurs légendaires.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Économie dynamique et équilibrée</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Effets 3D et designs premium</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Revendez et échangez avec les autres</li>
              </ul>
              <div className="pt-4">
                <Link href="/cards" className="btn-secondary inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 border-purple-500/30 hover:border-purple-500/60">
                  Ouvrir des Boosters <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 2: Tier List & PVP */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-yellow-500 rounded-full blur-[100px] opacity-10"></div>
              <div className="relative p-1 bg-gradient-to-bl from-yellow-500/30 to-orange-500/10 rounded-2xl rotate-[3deg] hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-yellow-900/20">
                <div className="bg-[#111118] rounded-xl p-8 border border-white/10 flex items-center justify-center h-[400px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50 mix-blend-overlay"></div>
                  <Swords className="w-32 h-32 text-yellow-500/50" />
                  <div className="absolute bottom-6 left-6 font-black text-6xl text-white/5">02</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-bold border border-yellow-500/20">
                <Trophy className="w-4 h-4" /> Compétition
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-outfit text-white leading-tight">
                Gravissez le <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Classement Officiel</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Qui est le meilleur joueur PvP ? Qui est le plus riche ? Qui est le plus grand traître ? La communauté établit les Tier Lists absolues. Chaque action en jeu peut influencer votre réputation.
              </p>
              <div className="pt-4">
                <Link href="/tier-list" className="btn-secondary inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 border-yellow-500/30 hover:border-yellow-500/60">
                  Voir les Classements <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 3: Forum */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px] opacity-10"></div>
              <div className="relative p-1 bg-gradient-to-br from-blue-500/30 to-cyan-500/10 rounded-2xl hover:-translate-y-2 transition-transform duration-500 shadow-2xl shadow-blue-900/20">
                <div className="bg-[#111118] rounded-xl p-8 border border-white/10 flex items-center justify-center h-[400px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                  <MessageSquare className="w-32 h-32 text-blue-500/50" />
                  <div className="absolute bottom-6 right-6 font-black text-6xl text-white/5">03</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold border border-blue-500/20">
                <FileText className="w-4 h-4" /> Diplomatie
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-outfit text-white leading-tight">
                La Parole est une <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Arme Redoutable</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Le forum intégré au site est le centre de la diplomatie. Déclarez vos alliances, dénoncez vos ennemis avec des preuves, partagez vos projets de build ou organisez des événements majeurs.
              </p>
              <div className="pt-4">
                <Link href="/forum" className="btn-secondary inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 border-blue-500/30 hover:border-blue-500/60">
                  Rejoindre les Discussions <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- CALL TO ACTION FOOTER --- */}
      <section className="relative w-full py-32 overflow-hidden mt-12 border-t border-white/10">
        <div className="absolute inset-0 bg-[#0a0510] z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50 mix-blend-overlay z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent-red)] rounded-full blur-[150px] opacity-20 z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <ShieldAlert className="w-16 h-16 text-[var(--color-accent-red)] mx-auto mb-8 opacity-80" />
          <h2 className="text-4xl md:text-6xl font-black font-outfit text-white mb-6 uppercase tracking-wider">
            Prêt à survivre ?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Le serveur est actuellement sous liste blanche stricte. Seuls les joueurs les plus motivés et stratèges seront acceptés.
          </p>
          <Link href="/candidature" className="btn-primary inline-flex items-center justify-center gap-3 px-10 py-5 text-xl font-bold rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] transition-all hover:scale-105">
            Soumettre ma Candidature
          </Link>
        </div>
      </section>
    </div>
  );
}
