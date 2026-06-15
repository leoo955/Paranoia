import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Trophy, FileText, Sparkles, LogOut } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent-red)] rounded-full blur-[150px] opacity-20 z-0 animate-pulse-glow"></div>
        
        <div className="relative z-10 text-center px-4 mt-20 max-w-4xl mx-auto">
          <div className="animate-slide-up inline-block mb-6">
            <Image 
              src="/Paranoia_logo.png" 
              alt="PARANOIA SMP" 
              width={600} 
              height={200} 
              className="w-full max-w-[400px] md:max-w-[600px] object-contain drop-shadow-[0_0_25px_rgba(179,102,255,0.6)]"
              priority
            />
          </div>
          <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] font-medium mb-10 max-w-2xl mx-auto">
            Rejoignez une aventure Minecraft impitoyable. Forgez des alliances, trahissez vos amis, et dominez le classement du serveur.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/candidature" className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
              <LogOut className="w-5 h-5 rotate-180" />
              <span>Nous Rejoindre</span>
            </Link>
            <Link href="#features" className="btn-secondary w-full sm:w-auto text-center">
              Découvrir le Serveur
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-[var(--color-bg-elevated)] border-y border-[var(--color-border-color)] py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-black font-outfit text-white mb-2">?</div>
              <div className="text-[var(--color-text-secondary)] uppercase tracking-wider text-sm font-semibold">Joueurs Actifs</div>
            </div>
            <div className="p-6 md:border-x border-[var(--color-border-color)]">
              <div className="text-4xl font-black font-outfit text-white mb-2">∞</div>
              <div className="text-[var(--color-text-secondary)] uppercase tracking-wider text-sm font-semibold">Topics Forum</div>
            </div>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-outfit font-black text-white mb-4">L'Expérience PARANOIA</h2>
              <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Plus qu'un simple serveur Vanilla, une véritable expérience sociale où la confiance est une monnaie rare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/forum" className="panel-matte p-8 rounded-2xl card-hover group block">
              <div className="w-14 h-14 bg-[var(--color-bg-elevated)] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent-red)] transition-colors duration-300">
                <MessageSquare className="w-7 h-7 text-[var(--color-text-primary)] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-outfit">Forum Communautaire</h3>
              <p className="text-[var(--color-text-secondary)]">Discutez avec les autres joueurs, partagez vos projets, déclarez des guerres ou proposez des événements.</p>
            </Link>

            <Link href="/tier-list" className="panel-matte p-8 rounded-2xl card-hover group block">
              <div className="w-14 h-14 bg-[var(--color-bg-elevated)] rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors duration-300">
                <Trophy className="w-7 h-7 text-[var(--color-text-primary)] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-outfit">Classement Officiel</h3>
              <p className="text-[var(--color-text-secondary)]">Qui est le meilleur joueur PvP ? Le plus riche ? Votez et établissez la Tier List absolue de la saison.</p>
            </Link>

            <Link href="/candidature" className="panel-matte p-8 rounded-2xl card-hover group block">
              <div className="w-14 h-14 bg-[var(--color-bg-elevated)] rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors duration-300">
                <FileText className="w-7 h-7 text-[var(--color-text-primary)] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-outfit">Candidatures</h3>
              <p className="text-[var(--color-text-secondary)]">Le serveur est sous liste blanche (Whitelist). Soumettez votre profil pour avoir une chance de nous rejoindre.</p>
            </Link>

            <Link href="/cards" className="panel-matte p-8 rounded-2xl card-hover group block">
              <div className="w-14 h-14 bg-[var(--color-bg-elevated)] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent-purple)] transition-colors duration-300">
                <Sparkles className="w-7 h-7 text-[var(--color-text-primary)] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-outfit">Trading Cards</h3>
              <p className="text-[var(--color-text-secondary)]">Collectionnez les cartes des joueurs légendaires du serveur, générées avec leurs statistiques et skins 3D.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
