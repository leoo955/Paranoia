"use client";

import { useState } from "react";
import { Loader2, ShoppingCart, Sparkles, AlertCircle, Zap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopClient({ initialBalance, isLoggedIn }: { initialBalance: number, isLoggedIn: boolean }) {
  const [balance, setBalance] = useState(initialBalance);
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const packages = [
    {
      id: "pkg_100",
      amount: 100,
      price: "2,99€",
      popular: false,
      title: "Pack Débutant",
      baseAmount: 100,
      bonusAmount: 0,
      color: "from-blue-600/40 to-indigo-600/10",
      glow: "bg-blue-500/20",
      border: "border-blue-500/40 hover:border-blue-400/80",
      iconColor: "text-blue-400",
      buttonBg: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
    },
    {
      id: "pkg_500",
      amount: 500,
      price: "5,99€",
      popular: true,
      title: "Pack Épique",
      baseAmount: 450,
      bonusAmount: 50,
      color: "from-purple-600/40 to-fuchsia-600/10",
      glow: "bg-purple-500/30",
      border: "border-purple-500/50 hover:border-purple-400",
      iconColor: "text-purple-400",
      buttonBg: "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]"
    },
    {
      id: "pkg_1000",
      amount: 1000,
      price: "9,99€",
      popular: false,
      title: "Pack Légendaire",
      baseAmount: 850,
      bonusAmount: 150,
      color: "from-amber-500/40 to-orange-600/10",
      glow: "bg-amber-500/20",
      border: "border-amber-500/40 hover:border-amber-400/80",
      iconColor: "text-amber-400",
      buttonBg: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] text-black"
    }
  ];

  const handleBuy = async (pkgId: string, amount: number) => {
    if (!isLoggedIn) {
      alert("Vous devez être connecté pour faire un achat.");
      return;
    }

    setLoadingPkg(pkgId);
    setSuccessMsg(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const res = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'achat");

      setBalance(data.newBalance);
      setSuccessMsg(`Succès ! Vous avez reçu ${amount} PARA Coins.`);
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingPkg(null);
    }
  };

  return (
    <div className="w-full relative z-10">
      
      {/* HUD Balance */}
      {isLoggedIn && (
        <div className="flex justify-center md:justify-end mb-12">
          <div className="relative group cursor-default">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-red)] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex items-center gap-4 bg-[#111118]/90 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl">
              <span className="text-[var(--color-text-secondary)] font-medium uppercase tracking-widest text-sm">Votre Banque</span>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="flex items-center gap-3">
                <img src="/Paracoin.png" alt="PARA Coins" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-pulse-glow" />
                <span className="font-outfit font-black text-white text-3xl tracking-tight">{balance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="mb-12 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 flex items-center justify-center gap-3 animate-fade-in shadow-[0_0_30px_rgba(34,197,94,0.15)] backdrop-blur-md">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="font-bold text-lg">{successMsg}</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
        {packages.map((pkg, i) => (
          <div 
            key={pkg.id} 
            className={`relative group bg-gradient-to-br ${pkg.color} bg-opacity-10 backdrop-blur-xl border ${pkg.border} rounded-[2rem] p-8 flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.02] hover:-translate-y-4`}
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 ${pkg.glow} blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]`}></div>
            
            {pkg.popular && (
              <div className="absolute -top-5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-black px-6 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse-glow border border-white/20 z-10 flex items-center gap-2">
                <Zap className="w-4 h-4 fill-white" />
                Plus Populaire
              </div>
            )}
            
            <div className="text-[var(--color-text-secondary)] font-bold tracking-widest uppercase text-sm mb-6 relative z-10">
              {pkg.title}
            </div>

            <div className={`w-32 h-32 mb-4 relative flex items-center justify-center`}>
              <div className={`absolute inset-0 ${pkg.glow} rounded-full blur-2xl opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700`}></div>
              <img 
                src="/Paracoin.png" 
                alt="PARA Coins" 
                className={`relative z-10 w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12`}
              />
            </div>
            
            {pkg.bonusAmount > 0 && (
              <div className="bg-gradient-to-r from-red-600 to-red-500 border border-red-400/50 text-white font-black text-sm px-4 py-1 rounded shadow-[0_0_15px_rgba(239,68,68,0.5)] mb-6 transform -rotate-2 group-hover:scale-110 transition-transform duration-300">
                {pkg.baseAmount} + {pkg.bonusAmount} EN PLUS
              </div>
            )}
            {pkg.bonusAmount === 0 && (
              <div className="h-8 mb-6"></div> // spacer
            )}
            
            <h3 className="text-5xl font-outfit font-black text-white mb-2 flex items-baseline gap-2 relative z-10 drop-shadow-lg">
              {pkg.amount}
              <span className={`text-lg font-bold ${pkg.iconColor} uppercase tracking-widest`}>Coins</span>
            </h3>
            
            <p className="text-[var(--color-text-secondary)] mb-10 flex-1 relative z-10 font-medium px-4">
              Idéal pour agrandir rapidement votre collection de Trading Cards.
            </p>
            
            <button
              onClick={() => handleBuy(pkg.id, pkg.amount)}
              disabled={loadingPkg !== null}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group/btn z-10 ${
                loadingPkg === pkg.id 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/10' 
                  : `${pkg.buttonBg} text-white`
              }`}
            >
              {loadingPkg !== pkg.id && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
              )}
              
              <span className="relative z-10 flex items-center gap-2 text-lg">
                {loadingPkg === pkg.id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validation...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Acheter {pkg.price}
                  </>
                )}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-20 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 backdrop-blur-md border border-blue-500/20 rounded-3xl p-8 flex items-start gap-6 max-w-4xl mx-auto shadow-[0_0_30px_rgba(59,130,246,0.05)]">
        <div className="bg-blue-500/20 p-4 rounded-full shrink-0 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <ShieldCheck className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h4 className="text-xl font-outfit text-white font-bold mb-3">Paiement 100% Sécurisé</h4>
          <p className="text-blue-200/70 leading-relaxed font-medium">
            Les PARA Coins sont une monnaie virtuelle exclusive au serveur PARANOIA, conçue pour l'ouverture de Boosters de Trading Cards. 
            Aucun remboursement n'est possible après l'achat. Ce module est actuellement en phase de test (simulateur).
          </p>
        </div>
      </div>
    </div>
  );
}
