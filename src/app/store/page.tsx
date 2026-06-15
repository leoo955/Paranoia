import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, Diamond } from "lucide-react";

export const metadata = {
  title: "Boutique | PARANOIA SMP",
  description: "Achetez des ParaCoins pour obtenir des Trading Cards."
};

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none"></div>
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[200px] opacity-[0.15] z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20 mb-6">
            <ShieldCheck className="w-4 h-4" /> Boutique Sécurisée
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-outfit text-white mb-6 uppercase tracking-wider">
            Boutique <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">ParaCoins</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Les ParaCoins vous permettent d'acheter des boosters de Trading Cards. Soutenez le serveur tout en collectionnant les cartes des joueurs légendaires !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pack Basique */}
          <div className="bg-[var(--color-bg-elevated)] border border-white/5 rounded-2xl p-8 flex flex-col relative group hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Sparkles className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-outfit">Pack Standard</h3>
              <p className="text-gray-400 mb-6 h-12">Pour commencer votre collection en douceur.</p>
              
              <div className="text-4xl font-black text-white mb-8 flex items-baseline gap-2">
                500 <span className="text-lg text-indigo-400 font-bold uppercase">PC</span>
              </div>
              
              <ul className="space-y-3 mb-8 text-sm text-gray-300 flex-1">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 
                  Permet d'acheter 3 Boosters Standard
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> 
                  Soutien direct au serveur
                </li>
              </ul>
              
              {/* Bouton d'achat générique */}
              <button className="w-full btn-secondary text-center block py-3 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10">
                Acheter
              </button>
            </div>
          </div>

          {/* Pack Populaire */}
          <div className="bg-gradient-to-b from-[#161622] to-[#0a0a0f] border border-purple-500/30 rounded-2xl p-8 flex flex-col relative group transform md:-translate-y-4 shadow-2xl shadow-purple-900/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-b-lg">
              Le plus populaire
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-2xl"></div>
            
            <div className="relative z-10 mt-4">
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <Zap className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-outfit">Pack Premium</h3>
              <p className="text-gray-400 mb-6 h-12">Le meilleur compromis pour obtenir des cartes rares.</p>
              
              <div className="text-5xl font-black text-white mb-8 flex items-baseline gap-2">
                1200 <span className="text-lg text-purple-400 font-bold uppercase">PC</span>
              </div>
              
              <ul className="space-y-3 mb-8 text-sm text-gray-300 flex-1">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> 
                  Permet d'acheter 3 Boosters Légendaires
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> 
                  Ou 8 Boosters Standard
                </li>
                <li className="flex items-center gap-3 text-purple-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_#a855f7]"></span> 
                  +200 PC Bonus Inclus
                </li>
              </ul>
              
              {/* Bouton d'achat générique */}
              <button className="w-full btn-primary text-center block py-4 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                Acheter
              </button>
            </div>
          </div>

          {/* Pack Ultime */}
          <div className="bg-[var(--color-bg-elevated)] border border-white/5 rounded-2xl p-8 flex flex-col relative group hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 border border-pink-500/20">
                <Diamond className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-outfit">Pack Mythique</h3>
              <p className="text-gray-400 mb-6 h-12">Pour les vrais collectionneurs qui visent le sommet.</p>
              
              <div className="text-4xl font-black text-white mb-8 flex items-baseline gap-2">
                2500 <span className="text-lg text-pink-400 font-bold uppercase">PC</span>
              </div>
              
              <ul className="space-y-3 mb-8 text-sm text-gray-300 flex-1">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> 
                  Permet d'acheter 3 Boosters Mythiques
                </li>
                <li className="flex items-center gap-3 text-pink-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_5px_#ec4899]"></span> 
                  +500 PC Bonus Inclus
                </li>
              </ul>
              
              {/* Bouton d'achat générique */}
              <button className="w-full btn-secondary text-center block py-3 text-pink-400 border-pink-500/30 hover:bg-pink-500/10">
                Acheter
              </button>
            </div>
          </div>

        </div>
        
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Les paiements sont traités de manière sécurisée. Les ParaCoins sont crédités sur votre compte.</p>
          <p className="mt-2">Vous devrez être connecté pour que votre compte soit crédité sur ce site.</p>
        </div>
      </div>
    </div>
  );
}
