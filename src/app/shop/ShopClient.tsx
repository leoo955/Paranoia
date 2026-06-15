"use client";

import { useState } from "react";
import { Loader2, ShoppingCart, Sparkles, AlertCircle } from "lucide-react";
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
      color: "from-blue-500/20 to-indigo-500/20",
      border: "border-indigo-500/50",
      iconColor: "text-indigo-400"
    },
    {
      id: "pkg_500",
      amount: 500,
      price: "5,99€",
      popular: true,
      color: "from-purple-500/20 to-fuchsia-500/20",
      border: "border-purple-500/50",
      iconColor: "text-purple-400"
    },
    {
      id: "pkg_1000",
      amount: 1000,
      price: "9,99€",
      popular: false,
      color: "from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/50",
      iconColor: "text-yellow-400"
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
      // Simulate payment delay
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
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingPkg(null);
    }
  };

  return (
    <div className="w-full">
      {isLoggedIn && (
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-3 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] px-6 py-3 rounded-2xl shadow-lg">
            <span className="text-[var(--color-text-secondary)] font-medium">Votre solde :</span>
            <div className="flex items-center gap-2">
              <img src="/Paracoin.png" alt="PARA Coins" className="w-6 h-6 object-contain drop-shadow-md" />
              <span className="font-outfit font-black text-white text-2xl">{balance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 flex items-center justify-center gap-2 animate-fade-in shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {packages.map(pkg => (
          <div 
            key={pkg.id} 
            className={`relative group bg-gradient-to-br ${pkg.color} border ${pkg.border} rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-sm font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg animate-pulse-glow">
                Le plus populaire
              </div>
            )}
            
            <div className={`w-24 h-24 mb-6 relative flex items-center justify-center`}>
              <div className="absolute inset-0 bg-white/5 rounded-full blur-xl"></div>
              <img 
                src="/Paracoin.png" 
                alt="PARA Coins" 
                className={`w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
              />
            </div>
            
            <h3 className="text-3xl font-outfit font-black text-white mb-2 flex items-center gap-2">
              {pkg.amount}
              <span className={`text-sm font-bold ${pkg.iconColor} uppercase tracking-wider`}>Coins</span>
            </h3>
            
            <p className="text-[var(--color-text-secondary)] mb-8 flex-1">
              Idéal pour agrandir votre collection.
            </p>
            
            <button
              onClick={() => handleBuy(pkg.id, pkg.amount)}
              disabled={loadingPkg !== null}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                loadingPkg === pkg.id 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : `bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/30`
              }`}
            >
              {loadingPkg === pkg.id ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Acheter pour {pkg.price}
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4 max-w-3xl mx-auto">
        <AlertCircle className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
        <div>
          <h4 className="text-blue-400 font-bold mb-2">Informations d'achat</h4>
          <p className="text-blue-200/70 text-sm leading-relaxed">
            Les PARA Coins sont une monnaie virtuelle utilisable uniquement sur le serveur PARANOIA pour l'ouverture de Boosters de Trading Cards. 
            Aucun remboursement n'est possible après achat. L'achat est simulé pour le moment (aucun moyen de paiement réel n'est demandé).
          </p>
        </div>
      </div>
    </div>
  );
}
