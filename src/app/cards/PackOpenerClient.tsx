"use client";

import { useState, useMemo, useEffect } from "react";
import { PackageOpen, Loader2, X, Search, Filter, Sparkles, Layers, Lock, BookOpen, Flame, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import CardDisplay from "@/components/cards/CardDisplay";

type Player = { id: string; minecraftName: string };
type TradingCard = { id: string; title: string; rarity: string; level: string; edition: string; description: string | null; player: Player | null };
type UserCard = { id: string; obtainedAt: Date; tradingCard: TradingCard };

const FlippableCard = ({ card, index, boxType }: { card: TradingCard, index: number, boxType: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative z-10 transform transition-transform hover:scale-105 duration-500 animate-epic-reveal cursor-pointer group shrink-0" 
      style={{ animationDelay: `${index * 0.4}s`, animationFillMode: 'both', perspective: '1000px', width: '16rem', height: '22.4rem', minWidth: '16rem' }}
      onClick={() => setIsFlipped(true)}
    >
      <div 
        className="w-full h-full relative transition-transform duration-700" 
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
      >
        {/* Front */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
          <CardDisplay card={card} size="md" />
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl border-2 border-purple-500/30 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]" 
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'radial-gradient(circle at center, #1e1b4b 0%, #0a0a0f 100%)' }}
        >
          {/* Textures pour remplir toute la carte */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-60 mix-blend-screen pointer-events-none"></div>
          
          {/* Cercle magique central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-dashed border-purple-500/20 animate-[spin_20s_linear_infinite] pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-purple-400/30 animate-[spin_15s_linear_infinite_reverse] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none w-full px-4">
            <img src="/Paranoia_logo.png" className="w-[85%] h-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" alt="Paranoia Card Back" />
          </div>
          
          {/* Bordure interne façon carte de jeu */}
          <div className="absolute inset-2 border-2 border-white/5 rounded-xl pointer-events-none"></div>
          
          {/* Subtle shine on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default function PackOpenerClient({ 
  initialInventory, 
  initialBoxes, 
  initialCoins, 
  isLoggedIn, 
  allCards = [],
  serverPlayers = [],
  currentUserMCName = ""
}: { 
  initialInventory: UserCard[], 
  initialBoxes?: any[], 
  initialCoins: number, 
  isLoggedIn: boolean, 
  allCards?: TradingCard[],
  serverPlayers?: string[],
  currentUserMCName?: string
}) {
  const [inventory, setInventory] = useState<UserCard[]>(initialInventory);
  const [boxes, setBoxes] = useState<any[]>(initialBoxes || []);
  const [coins, setCoins] = useState<number>(initialCoins || 0);
  const [selectedBoxType, setSelectedBoxType] = useState<string>("standard");
  const [isOpening, setIsOpening] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [drawnCards, setDrawnCards] = useState<TradingCard[]>([]);
  const [showReveal, setShowReveal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TradingCard | null>(null);
  const [openingGlow, setOpeningGlow] = useState<string | null>(null);
  const [showRatesModal, setShowRatesModal] = useState(false);
  
  // Fake recent drops for massive FOMO
  const [fomoDrop, setFomoDrop] = useState<{player: string, rarity: string, time: number}>({ player: 'GamerX_99', rarity: 'Légendaire', time: 2 });

  const [activeTab, setActiveTab] = useState<"opener" | "collection" | "catalogue">("opener");
  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState("ALL");
  const router = useRouter();

  useEffect(() => {
    // Filter out the current user
    const eligiblePlayers = serverPlayers.filter(name => name && name !== currentUserMCName);
    
    // Fallback if no other players exist
    const fomoPlayers = eligiblePlayers.length > 0 ? eligiblePlayers : ["Joueur_Mystère"];
    const fomoRarities = ["Légendaire", "Mythique", "Épique"];
    
    const interval = setInterval(() => {
      setFomoDrop({
        player: fomoPlayers[Math.floor(Math.random() * fomoPlayers.length)],
        rarity: fomoRarities[Math.floor(Math.random() * fomoRarities.length)],
        time: Math.floor(Math.random() * 5) + 1
      });
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, [serverPlayers, currentUserMCName]);

  const buyBooster = async (type: string, price: number) => {
    if (!isLoggedIn) {
      alert("Vous devez être connecté.");
      return;
    }
    if (coins < price) {
      alert("Fonds insuffisants !");
      return;
    }
    setIsBuying(true);
    try {
      const res = await fetch("/api/boosters/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boxType: type })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'achat");
      
      setCoins(data.remainingCoins);
      setBoxes(prev => {
        const existing = prev.find(b => b.boxType === type);
        if (existing) return prev.map(b => b.boxType === type ? { ...b, amount: b.amount + 1 } : b);
        return [...prev, { boxType: type, amount: 1 }];
      });
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsBuying(false);
    }
  };

  const openPack = async () => {
    if (!isLoggedIn) {
      alert("Vous devez être connecté pour ouvrir des boosters.");
      return;
    }

    const userBox = boxes.find(b => b.boxType === selectedBoxType);
    if (!userBox || userBox.amount <= 0) {
      alert(`Vous ne possédez aucun Booster ${selectedBoxType}.`);
      return;
    }
    
    // S'assurer qu'on est bien en haut de page pour que l'animation et le reveal soient parfaits
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setIsOpening(true);
    setDrawnCards([]);
    setShowReveal(false);
    setOpeningGlow(null);

    try {
      const res = await fetch("/api/packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boxType: selectedBoxType })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      const rarityWeight: Record<string, number> = {
        'COMMON': 1, 'UNCOMMON': 2, 'RARE': 3, 'EPIC': 4, 'LEGENDARY': 5, 'MYTHIC': 6
      };
      
      let bestCardRarity = 'COMMON';
      let maxWeight = 0;
      if (data.drawnCards) {
        data.drawnCards.forEach((c: any) => {
          const weight = rarityWeight[c.rarity] || 0;
          if (weight > maxWeight) {
            maxWeight = weight;
            bestCardRarity = c.rarity;
          }
        });
      }
      
      if (['MYTHIC', 'LEGENDARY', 'EPIC'].includes(bestCardRarity)) {
        setOpeningGlow(bestCardRarity);
      }

      setBoxes(prev => prev.map(b => b.boxType === selectedBoxType ? { ...b, amount: b.amount - 1 } : b));

      setTimeout(() => {
        setDrawnCards(data.drawnCards);
        setShowReveal(true);
        setIsOpening(false);
        setInventory(prev => [...data.userCards, ...prev]);
        router.refresh();
      }, 1400);

    } catch (error: any) {
      alert(error.message);
      setIsOpening(false);
    }
  };

  const groupedInventory = useMemo(() => {
    const acc: Record<string, { card: TradingCard, count: number, latestObtained: Date }> = {};
    
    // Initialiser avec toutes les cartes publiées (count = 0)
    allCards.forEach(card => {
      acc[card.id] = { card, count: 0, latestObtained: new Date(0) };
    });

    inventory.forEach(curr => {
      if (!curr || !curr.tradingCard) return;
      const id = curr.tradingCard.id;
      if (!acc[id]) {
        acc[id] = { card: curr.tradingCard, count: 0, latestObtained: curr.obtainedAt || new Date(0) };
      }
      acc[id].count += 1;
      if (curr.obtainedAt && new Date(curr.obtainedAt) > new Date(acc[id].latestObtained)) {
        acc[id].latestObtained = curr.obtainedAt;
      }
    });
    return acc;
  }, [inventory, allCards]);

  const stackedItems = useMemo(() => {
    return Object.values(groupedInventory)
      .filter(item => {
        const matchesSearch = item.card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (item.card.player && item.card.player.minecraftName.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesRarity = rarityFilter === "ALL" || item.card.rarity === rarityFilter;
        return matchesSearch && matchesRarity;
      })
      .sort((a, b) => new Date(b.latestObtained).getTime() - new Date(a.latestObtained).getTime());
  }, [groupedInventory, searchQuery, rarityFilter]);

  const ownedStandard = boxes.find(b => b.boxType === "standard")?.amount || 0;
  const ownedPremium = boxes.find(b => b.boxType === "premium")?.amount || 0;
  const ownedLegendary = boxes.find(b => b.boxType === "legendary")?.amount || 0;
  const ownedMythic = boxes.find(b => b.boxType === "mythic")?.amount || 0;

  return (
    <div className="w-full">

      {/* Header HUD */}
      <div className="relative mb-12 flex flex-col md:flex-row justify-between items-center gap-6 z-20">
        
        {/* Glowing backdrop for tabs */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-fuchsia-500/10 blur-3xl -z-10 rounded-full" />
        
        {/* Premium Tabs */}
        <div className="flex gap-2 p-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <button 
            onClick={() => setActiveTab("opener")}
            className={`relative flex items-center gap-3 px-8 py-3.5 font-bold rounded-xl transition-all duration-300 overflow-hidden ${activeTab === 'opener' ? 'text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
          >
            {activeTab === 'opener' && <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-blue-600/80 shadow-[0_0_20px_rgba(79,70,229,0.5)]" />}
            <PackageOpen className="w-5 h-5 relative z-10" /> 
            <span className="relative z-10 tracking-wide">Boosters</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("collection")}
            className={`relative flex items-center gap-3 px-8 py-3.5 font-bold rounded-xl transition-all duration-300 overflow-hidden ${activeTab === 'collection' ? 'text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
          >
            {activeTab === 'collection' && <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 shadow-[0_0_20px_rgba(168,85,247,0.5)]" />}
            <Layers className="w-5 h-5 relative z-10" /> 
            <span className="relative z-10 tracking-wide">Collection</span>
          </button>

          <button 
            onClick={() => setActiveTab("catalogue")}
            className={`relative flex items-center gap-3 px-8 py-3.5 font-bold rounded-xl transition-all duration-300 overflow-hidden ${activeTab === 'catalogue' ? 'text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}
          >
            {activeTab === 'catalogue' && <div className="absolute inset-0 bg-gradient-to-r from-rose-600/80 to-red-600/80 shadow-[0_0_20px_rgba(225,29,72,0.5)]" />}
            <BookOpen className="w-5 h-5 relative z-10" /> 
            <span className="relative z-10 tracking-wide">Catalogue</span>
          </button>
        </div>
        
        {/* Coin Balance Display */}
        {isLoggedIn && (
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-amber-500/20 px-6 py-3 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.15)] group hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 group-hover:scale-110 transition-transform duration-300">
              <img src="/Paracoin.png" alt="PARA Coins" className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse-glow" />
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="text-xs text-amber-500/70 font-bold uppercase tracking-wider">Solde</span>
              <span className="font-outfit font-black text-white text-2xl leading-none tracking-tight">{coins.toLocaleString()}</span>
            </div>
            
            {/* DEBUG BUTTON: to remove later */}
            <button 
              onClick={async () => {
                const res = await fetch("/api/boosters/add-coins", { method: "POST" });
                const data = await res.json();
                if(data.coins) setCoins(data.coins);
              }}
              className="ml-4 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white/50 hover:text-white transition-colors"
            >
              +1000
            </button>
          </div>
        )}
      </div>

      {activeTab === "opener" && (
        <div className="bg-[#0f0f16] border border-indigo-500/20 rounded-3xl p-8 lg:p-16 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0f0f16] to-[#0f0f16] pointer-events-none" />
          
          {/* FOMO TICKER */}
          <div className="absolute top-4 w-full flex justify-center z-20">
            <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-md px-6 py-2 rounded-full flex items-center gap-3 animate-pulse-glow">
              <Flame className="w-5 h-5 text-red-500" />
              <p className="text-sm font-bold text-white tracking-wide">
                <span className="text-red-400">{fomoDrop.player}</span> vient d'obtenir une carte <span className={
                  fomoDrop.rarity === 'Mythique' ? 'text-red-500 font-black' :
                  fomoDrop.rarity === 'Légendaire' ? 'text-yellow-400 font-black' : 'text-purple-400 font-black'
                }>{fomoDrop.rarity}</span> ! 
                <span className="text-white/40 ml-2 font-normal text-xs">il y a {fomoDrop.time} min</span>
              </p>
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-outfit font-black text-white mt-10 mb-4 z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-lg">Ouvrir des Boosters</h2>
          
          <div className="flex flex-col items-center gap-4 mb-12 z-10">
            <p className="text-[var(--color-text-secondary)] max-w-xl text-lg">
              Sélectionnez un booster et ouvrez-le pour obtenir de nouvelles cartes !
            </p>
            <button 
              onClick={() => setShowRatesModal(true)}
              className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-white/70 hover:text-white transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Voir les Drop Rates
            </button>
          </div>

          {!showReveal && (
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 z-10">
              {/* Standard Box */}
              <div 
                onClick={() => setSelectedBoxType("standard")}
                className={`p-6 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center gap-4 cursor-pointer relative overflow-hidden group ${selectedBoxType === "standard" ? "bg-blue-900/30 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-105" : "bg-black/40 backdrop-blur-md border-white/10 hover:border-blue-500/50 opacity-80 hover:opacity-100"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <img src="/StandardB.png" alt="Standard" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] relative z-10" />
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-black text-blue-300 drop-shadow-md tracking-wide font-outfit uppercase">Standard</h3>
                  <p className="text-xs text-blue-200/70 mt-2 font-medium">Toutes les raretés</p>
                </div>
                <div className="mt-4 w-full flex flex-col gap-3 relative z-10">
                  <div className="px-4 py-1.5 mx-auto rounded-full bg-black/60 border border-white/10 font-mono font-bold text-white shadow-inner">
                    x{ownedStandard} en stock
                  </div>
                  {ownedStandard === 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); buyBooster("standard", 150); }}
                      disabled={isBuying}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
                    >
                      <span className="flex items-center gap-1.5"><img src="/Paracoin.png" alt="PARA" className="w-5 h-5 object-contain" /> 150</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Premium Box */}
              <div 
                onClick={() => setSelectedBoxType("premium")}
                className={`p-6 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center gap-4 cursor-pointer relative overflow-hidden group ${selectedBoxType === "premium" ? "bg-purple-900/30 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)] scale-105" : "bg-black/40 backdrop-blur-md border-white/10 hover:border-purple-500/50 opacity-80 hover:opacity-100"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50 relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <img src="/PreniumB.png" alt="Premium" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] relative z-10" />
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-black text-purple-300 drop-shadow-md tracking-wide font-outfit uppercase">Premium</h3>
                  <p className="text-xs text-purple-200/70 mt-2 font-medium">Mini. Rare garanti</p>
                </div>
                <div className="mt-4 w-full flex flex-col gap-3 relative z-10">
                  <div className="px-4 py-1.5 mx-auto rounded-full bg-black/60 border border-white/10 font-mono font-bold text-white shadow-inner">
                    x{ownedPremium} en stock
                  </div>
                  {ownedPremium === 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); buyBooster("premium", 250); }}
                      disabled={isBuying}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
                    >
                      <span className="flex items-center gap-1.5"><img src="/Paracoin.png" alt="PARA" className="w-5 h-5 object-contain" /> 250</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Legendary Box */}
              <div 
                onClick={() => setSelectedBoxType("legendary")}
                className={`p-6 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center gap-4 cursor-pointer relative overflow-hidden group ${selectedBoxType === "legendary" ? "bg-amber-900/30 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] scale-105" : "bg-black/40 backdrop-blur-md border-white/10 hover:border-amber-500/50 opacity-80 hover:opacity-100"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/50 relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <img src="/StandardB.png" alt="Legendary" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] hue-rotate-180 brightness-150 relative z-10" />
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-black text-amber-400 drop-shadow-md tracking-wide font-outfit uppercase">Légendaire</h3>
                  <p className="text-xs text-amber-200/70 mt-2 font-medium">Mini. Épique garanti</p>
                </div>
                <div className="mt-4 w-full flex flex-col gap-3 relative z-10">
                  <div className="px-4 py-1.5 mx-auto rounded-full bg-black/60 border border-white/10 font-mono font-bold text-white shadow-inner">
                    x{ownedLegendary} en stock
                  </div>
                  {ownedLegendary === 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); buyBooster("legendary", 400); }}
                      disabled={isBuying}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 rounded-xl font-bold text-white transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]"
                    >
                      <span className="flex items-center gap-1.5"><img src="/Paracoin.png" alt="PARA" className="w-5 h-5 object-contain" /> 400</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mythic Box */}
              <div 
                onClick={() => setSelectedBoxType("mythic")}
                className={`p-6 rounded-3xl border-2 transition-all duration-500 flex flex-col items-center gap-4 cursor-pointer relative overflow-hidden group ${selectedBoxType === "mythic" ? "bg-red-900/30 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-105" : "bg-black/40 backdrop-blur-md border-white/10 hover:border-red-500/50 opacity-80 hover:opacity-100"}`}
              >
                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg tracking-wider shadow-[0_0_10px_rgba(220,38,38,0.8)] z-20 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Offre Flash
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50 relative z-10 group-hover:scale-110 transition-transform duration-500 mt-2">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <img src="/MythiqueB.png" alt="Mythique" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] relative z-10 animate-pulse-glow" />
                </div>
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,1)] tracking-wide font-outfit uppercase">Mythique</h3>
                  <p className="text-xs text-red-200/70 mt-2 font-medium">Légendaire ou Mythique</p>
                  <p className="text-[10px] text-red-400 font-bold mt-1 bg-red-500/20 rounded-full px-2 py-0.5 inline-block">Il n'en reste que 3 !</p>
                </div>
                <div className="mt-4 w-full flex flex-col gap-3 relative z-10">
                  <div className="px-4 py-1.5 mx-auto rounded-full bg-black/60 border border-white/10 font-mono font-bold text-white shadow-inner">
                    x{ownedMythic} en stock
                  </div>
                  {ownedMythic === 0 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); buyBooster("mythic", 750); }}
                      disabled={isBuying}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]"
                    >
                      <span className="flex items-center gap-1.5"><img src="/Paracoin.png" alt="PARA" className="w-5 h-5 object-contain" /> 750</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!showReveal && (
            <div className="z-10 flex flex-col items-center mt-4">
              {/* Only show the normal booster if NOT opening */}
              {!isOpening && (
                <button 
                  onClick={openPack} 
                  className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95 outline-none group"
                >
                  <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity ${selectedBoxType === 'standard' ? 'bg-blue-500' : selectedBoxType === 'premium' ? 'bg-purple-500' : selectedBoxType === 'legendary' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                  <img src={selectedBoxType === "standard" ? "/StandardB.png" : selectedBoxType === "premium" ? "/PreniumB.png" : selectedBoxType === "legendary" ? "/StandardB.png" : "/MythiqueB.png"} alt="Booster Pack" className={`w-64 h-auto relative z-10 drop-shadow-2xl transition-all duration-300 transform hover:scale-110 ${selectedBoxType === 'legendary' ? 'hue-rotate-180 brightness-150' : ''}`} />
                  
                  {/* Floating particles effect on hover */}
                  <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Sparkles className={`w-32 h-32 animate-ping ${selectedBoxType === 'standard' ? 'text-blue-400' : selectedBoxType === 'premium' ? 'text-purple-400' : selectedBoxType === 'legendary' ? 'text-amber-400' : 'text-red-400'}`} />
                  </div>
                </button>
              )}
              
              {!isOpening && (
                <button 
                  onClick={openPack}
                  disabled={isOpening || isBuying || (selectedBoxType === "standard" ? ownedStandard : selectedBoxType === "premium" ? ownedPremium : selectedBoxType === "legendary" ? ownedLegendary : ownedMythic) <= 0}
                  className="group relative px-12 py-4 mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-black text-xl text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(129,140,248,0.5)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-3">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    Ouvrir le Booster
                  </span>
                </button>
              )}
            </div>
          )}
          
          {/* Cinematic Opening Overlay */}
          {isOpening && (
            <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-colors duration-1000 ${
              openingGlow === 'MYTHIC' ? 'bg-red-900/20' : 
              openingGlow === 'LEGENDARY' ? 'bg-yellow-900/20' : 
              openingGlow === 'EPIC' ? 'bg-purple-900/20' : 
              'bg-black/90'
            }`}>
              <div className="animate-booster-open relative flex items-center justify-center">
                {openingGlow && (
                   <div className={`absolute inset-0 z-0 animate-pulse-glow blur-2xl ${
                     openingGlow === 'MYTHIC' ? 'bg-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.5)]' :
                     openingGlow === 'LEGENDARY' ? 'bg-yellow-400/30 shadow-[0_0_50px_rgba(250,204,21,0.5)]' :
                     'bg-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.5)]'
                   }`} />
                )}
                <img src={selectedBoxType === "standard" ? "/StandardB.png" : selectedBoxType === "premium" ? "/PreniumB.png" : selectedBoxType === "legendary" ? "/StandardB.png" : "/MythiqueB.png"} alt="Booster Pack" className={`w-80 h-auto relative z-10 transition-all duration-700 ${selectedBoxType === 'legendary' ? 'hue-rotate-180 brightness-150' : ''} ${
                  openingGlow === 'MYTHIC' ? 'drop-shadow-[0_0_30px_rgba(239,68,68,0.7)]' :
                  openingGlow === 'LEGENDARY' ? 'drop-shadow-[0_0_30px_rgba(250,204,21,0.7)]' :
                  openingGlow === 'EPIC' ? 'drop-shadow-[0_0_30px_rgba(168,85,247,0.7)]' :
                  'drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                }`} />
              </div>
            </div>
          )}

          {/* The Drawn Cards Reveal */}
          {showReveal && drawnCards.length > 0 && (
            <div className="z-10 flex flex-col items-center animate-slide-up relative mt-8 w-full max-w-7xl mx-auto">
              
              {/* BIG WIN EXPLOSION (Sparkles & Flash) */}
              {openingGlow && (
                <div className="fixed inset-0 z-[150] pointer-events-none flex items-center justify-center">
                  <div className={`absolute inset-0 animate-flash-fade ${
                    openingGlow === 'MYTHIC' ? 'bg-red-500/20 mix-blend-screen' :
                    openingGlow === 'LEGENDARY' ? 'bg-yellow-500/20 mix-blend-screen' :
                    'bg-purple-500/20 mix-blend-screen'
                  }`}></div>
                  {Array.from({ length: 50 }).map((_, i) => (
                    <Sparkles 
                      key={i} 
                      className={`absolute animate-particle ${
                        openingGlow === 'MYTHIC' ? 'text-red-400' :
                        openingGlow === 'LEGENDARY' ? 'text-yellow-400' :
                        'text-purple-400'
                      }`}
                      style={{ 
                        '--tx': `${(Math.random() - 0.5) * 1200}px`, 
                        '--ty': `${(Math.random() - 0.5) * 1200}px`,
                        animationDelay: `${Math.random() * 0.2}s`,
                        width: `${Math.random() * 60 + 20}px`,
                        height: `${Math.random() * 60 + 20}px`,
                      } as React.CSSProperties} 
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-row justify-center items-center gap-6 md:gap-10 px-4 flex-wrap w-fit mx-auto max-w-full overflow-visible">
                {drawnCards.map((card, i) => (
                  <FlippableCard key={i} card={card} index={i} boxType={selectedBoxType} />
                ))}
              </div>
              
              <div className="mt-20 flex gap-6 z-10">
                <button onClick={() => setShowReveal(false)} className="btn-primary px-8 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  Ouvrir un autre booster
                </button>
                <button onClick={() => {setShowReveal(false); setActiveTab("collection");}} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold border border-white/20 transition-colors backdrop-blur-md">
                  Aller à la collection
                </button>
              </div>
            </div>
          )}
          
          {/* Flash Overlay when booster bursts */}
          {isOpening && (
            <div className="fixed inset-0 z-[100] pointer-events-none animate-flash-burst flex items-center justify-center">
              <div className="w-[150vw] h-[150vw] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.1)_30%,transparent_70%)] rounded-full mix-blend-screen"></div>
            </div>
          )}
        </div>
      )}

      {activeTab === "collection" && (
        <div className="animate-fade-in">

          <div className="relative mb-12 p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-fuchsia-500/30 shadow-2xl">
            <div className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 flex flex-col lg:flex-row gap-6 items-center justify-between sticky top-4 z-40">
              <div className="flex flex-col items-center lg:items-start gap-1 w-full lg:w-auto">
                <h2 className="text-3xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 flex items-center gap-3">
                  <Layers className="w-8 h-8 text-indigo-400" /> Ma Collection
                </h2>
                <span className="text-indigo-200/50 font-medium tracking-wider uppercase text-sm ml-11">
                  {inventory.length} cartes possédées
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-72 group">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Rechercher une carte..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-indigo-200/30 outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                    />
                  </div>
                </div>
                
                <div className="relative w-full sm:w-56 group">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center">
                    <Filter className="absolute left-4 w-5 h-5 text-purple-300/50 group-focus-within:text-purple-400 transition-colors" />
                    <select 
                      value={rarityFilter}
                      onChange={(e) => setRarityFilter(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500/50 transition-all appearance-none shadow-inner cursor-pointer"
                    >
                      <option value="ALL">Toutes Raretés</option>
                      <option value="COMMON">Commune</option>
                      <option value="UNCOMMON">Peu Commune</option>
                      <option value="RARE">Rare</option>
                      <option value="EPIC">Épique</option>
                      <option value="LEGENDARY">Légendaire</option>
                      <option value="MYTHIC">Mythique</option>
                    </select>
                    <div className="absolute right-4 pointer-events-none text-purple-300/50">▼</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Render Sections */}
          {stackedItems.length === 0 ? (
            <div className="text-center py-24 bg-[var(--color-bg-elevated)] rounded-2xl border border-dashed border-[var(--color-border-color)] flex flex-col items-center">
              <div className="w-20 h-20 bg-black/30 rounded-full flex items-center justify-center mb-4 border border-white/5">
                <Layers className="w-10 h-10 text-[var(--color-text-muted)]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Aucune carte trouvée</h3>
              <p className="text-[var(--color-text-secondary)] max-w-md">
                Aucune carte ne correspond à vos filtres actuels.
              </p>
              <button onClick={() => {setSearchQuery(""); setRarityFilter("ALL");}} className="mt-6 text-[var(--color-accent-purple)] hover:text-white underline transition-colors">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              
              {/* Catalogue par Rareté */}
              <div>
                <h3 className="text-3xl font-outfit font-black text-white mb-8 border-b border-white/10 pb-4">Vos Cartes</h3>
                {['MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'].map(rarity => {
                  const cardsOfRarity = stackedItems.filter(item => item.card.rarity === rarity && item.count > 0);
                  if (cardsOfRarity.length === 0) return null;
                  
                  return (
                    <div key={rarity} className="mb-12">
                      <h4 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                        rarity === 'MYTHIC' ? 'text-red-500' :
                        rarity === 'LEGENDARY' ? 'text-yellow-500' :
                        rarity === 'EPIC' ? 'text-purple-500' :
                        rarity === 'RARE' ? 'text-blue-500' :
                        rarity === 'UNCOMMON' ? 'text-green-500' :
                        'text-gray-400'
                      }`}>
                        {rarity === 'MYTHIC' ? 'Mythique' :
                         rarity === 'LEGENDARY' ? 'Légendaire' :
                         rarity === 'EPIC' ? 'Épique' :
                         rarity === 'RARE' ? 'Rare' :
                         rarity === 'UNCOMMON' ? 'Peu Commune' : 'Commune'}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {cardsOfRarity.map(item => (
                          <div key={item.card.id} className="relative group perspective-1000">
                            <div 
                              onClick={() => setSelectedCard(item.card)}
                              className="cursor-pointer transition-all duration-500 transform-style-3d group-hover:scale-105 group-hover:-translate-y-4 group-hover:shadow-[0_20px_30px_rgba(0,0,0,0.5)] rounded-xl"
                            >
                              <CardDisplay card={item.card} size="md" />
                            </div>
                            {item.count > 1 && (
                              <div className="absolute -top-3 -right-3 z-50 bg-red-600 text-white font-black text-sm px-2.5 py-1 rounded-full border-2 border-[#111118] shadow-[0_0_10px_rgba(220,38,38,0.6)] animate-pulse-glow">
                                x{item.count}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      )}

      {activeTab === "catalogue" && (
        <div className="animate-fade-in">
          <div className="relative mb-12 p-[1px] rounded-2xl bg-gradient-to-r from-rose-500/30 via-red-500/30 to-orange-500/30 shadow-2xl">
            <div className="bg-black/60 backdrop-blur-2xl rounded-2xl p-6 flex flex-col lg:flex-row gap-6 items-center justify-between sticky top-4 z-40">
              <div className="flex flex-col items-center lg:items-start gap-1 w-full lg:w-auto">
                <h2 className="text-3xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-red-300 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-rose-400" /> Catalogue Complet
                </h2>
                <span className="text-rose-200/50 font-medium tracking-wider uppercase text-sm ml-11">
                  Découvrez toutes les cartes
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-16">
            {['MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'].map(rarity => {
              const cardsOfRarity = allCards.filter(c => c.rarity === rarity);
              if (cardsOfRarity.length === 0) return null;

              // Check owned cards for this rarity
              const ownedCount = cardsOfRarity.filter(c => inventory.some(i => i.tradingCard?.id === c.id)).length;

              return (
                <div key={rarity}>
                  <h2 className={`text-3xl font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-4 ${
                    rarity === 'MYTHIC' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
                    rarity === 'LEGENDARY' ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                    rarity === 'EPIC' ? 'text-purple-400' :
                    rarity === 'RARE' ? 'text-blue-400' :
                    rarity === 'UNCOMMON' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    <Sparkles className="w-8 h-8" />
                    {rarity === 'MYTHIC' ? 'Mythique' : 
                     rarity === 'LEGENDARY' ? 'Légendaire' : 
                     rarity === 'EPIC' ? 'Épique' : 
                     rarity === 'RARE' ? 'Rare' : 
                     rarity === 'UNCOMMON' ? 'Peu Commune' : 'Commune'}
                    <span className="text-sm font-normal text-[var(--color-text-secondary)] bg-white/5 px-3 py-1 rounded-full ml-4 border border-white/10 drop-shadow-none flex items-center gap-2">
                      <Layers className="w-4 h-4" /> {ownedCount} / {cardsOfRarity.length} possédées
                    </span>
                  </h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {cardsOfRarity.map(card => {
                      const isOwned = inventory.some(i => i.tradingCard?.id === card.id);
                      return (
                        <div key={card.id} className={`relative group perspective-1000 ${!isOwned ? 'opacity-50 grayscale hover:grayscale-0 transition-all duration-500' : ''}`}>
                          <div 
                            onClick={() => isOwned && setSelectedCard(card)}
                            className={`transition-all duration-500 transform-style-3d group-hover:scale-105 group-hover:-translate-y-4 group-hover:shadow-[0_20px_30px_rgba(0,0,0,0.5)] rounded-xl ${isOwned ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                          >
                            <CardDisplay card={card as any} size="md" />
                            {!isOwned && (
                              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                                <Lock className="w-10 h-10 text-white/50" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {allCards.length === 0 && (
              <div className="text-center py-20 text-[var(--color-text-secondary)]">
                Aucune carte n'a encore été publiée.
              </div>
            )}
          </div>
        </div>
      )}

      {selectedCard && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="relative w-full max-w-5xl flex flex-col md:flex-row items-center md:items-stretch gap-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute -top-16 right-0 md:-top-6 md:-right-16 text-white/50 hover:text-white transition-colors z-50 bg-white/5 hover:bg-red-500/20 p-3 rounded-full border border-white/10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Card Side */}
            <div className="flex-shrink-0 w-full max-w-[400px] flex items-center justify-center">
              <div className="animate-float shadow-[0_0_50px_rgba(255,255,255,0.1)] rounded-2xl">
                <CardDisplay card={selectedCard} size="lg" />
              </div>
            </div>

            {/* Info Pane Side */}
            <div className="flex-1 w-full bg-gradient-to-br from-[#161622] to-[#0a0a0f] border border-[var(--color-border-color)] rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
              {/* Background decorative element */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--color-accent-purple)] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
              
              <h3 className="text-4xl font-outfit font-black text-white mb-4 relative z-10">{selectedCard.title}</h3>
              
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border uppercase tracking-wider ${
                  selectedCard.rarity === 'COMMON' ? 'bg-gray-500/20 text-gray-300 border-gray-500/50 shadow-[0_0_10px_rgba(107,114,128,0.2)]' : 
                  selectedCard.rarity === 'UNCOMMON' ? 'bg-green-500/20 text-green-300 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 
                  selectedCard.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 
                  selectedCard.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 
                  selectedCard.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 
                  'bg-red-500/20 text-red-300 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                }`}>
                  {selectedCard.rarity}
                </span>
                <span className="px-4 py-1.5 rounded-full text-sm font-bold border bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
                  Niveau {selectedCard.level}
                </span>
              </div>

              <div className="flex-1 bg-black/40 rounded-2xl p-6 border border-white/5 relative z-10">
                <h4 className="text-xs font-bold text-[var(--color-text-secondary)] mb-3 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Lore de la Carte
                </h4>
                <p className="text-white/90 whitespace-pre-wrap leading-relaxed font-medium text-lg">
                  {selectedCard.description || "Une aura mystérieuse entoure cette relique. Son histoire reste à écrire..."}
                </p>
              </div>

              {selectedCard.player && (
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative z-10 bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <img src={`https://render.crafty.gg/3d/bust/${selectedCard.player.minecraftName}`} alt="Skin" className="w-12 h-12 object-contain drop-shadow-lg" />
                    <div>
                      <span className="text-xs text-[var(--color-text-secondary)] block uppercase tracking-wider font-bold">Joueur Associé</span>
                      <span className="text-lg font-black text-white">{selectedCard.player.minecraftName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--color-text-secondary)] block">Authentifié par</span>
                    <span className="text-sm font-bold text-indigo-400">Le Serveur Paranoia</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOMO Rates Modal */}
      {showRatesModal && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300"
          onClick={() => setShowRatesModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#0f0f16] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
            
            <button 
              onClick={() => setShowRatesModal(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 bg-white/5 hover:bg-red-500/20 p-2 rounded-full border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-3xl font-outfit font-black text-white mb-2 relative z-10 flex items-center gap-3">
              <Search className="w-8 h-8 text-indigo-400" /> Taux d'Obtention (Drop Rates)
            </h3>
            <p className="text-white/50 mb-8 relative z-10">Consultez vos chances d'obtenir les cartes les plus rares.</p>

            <div className="relative z-10 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-black/60 uppercase text-white/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Rareté</th>
                    <th className="px-6 py-4 font-bold text-blue-400">Standard</th>
                    <th className="px-6 py-4 font-bold text-purple-400">Premium</th>
                    <th className="px-6 py-4 font-bold text-yellow-400">Légendaire</th>
                    <th className="px-6 py-4 font-bold text-red-400">Mythique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-black/30 font-medium text-white">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-400">Commune</td>
                    <td className="px-6 py-4">70%</td>
                    <td className="px-6 py-4">45%</td>
                    <td className="px-6 py-4">25%</td>
                    <td className="px-6 py-4 opacity-30">0%</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-blue-400">Rare</td>
                    <td className="px-6 py-4">20%</td>
                    <td className="px-6 py-4">35%</td>
                    <td className="px-6 py-4">40%</td>
                    <td className="px-6 py-4 opacity-30">0%</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-purple-400">Épique</td>
                    <td className="px-6 py-4">8%</td>
                    <td className="px-6 py-4">15%</td>
                    <td className="px-6 py-4">25%</td>
                    <td className="px-6 py-4">75%</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-yellow-400 font-bold">Légendaire</td>
                    <td className="px-6 py-4">2%</td>
                    <td className="px-6 py-4">5%</td>
                    <td className="px-6 py-4 text-yellow-400">10%</td>
                    <td className="px-6 py-4 text-yellow-400">20%</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors bg-red-900/10">
                    <td className="px-6 py-4 text-red-500 font-black">Mythique</td>
                    <td className="px-6 py-4 opacity-30">0%</td>
                    <td className="px-6 py-4 opacity-30">0%</td>
                    <td className="px-6 py-4 opacity-30">0%</td>
                    <td className="px-6 py-4 text-red-500 font-black">5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 text-center relative z-10">
              <button 
                onClick={() => { setShowRatesModal(false); setSelectedBoxType('mythic'); }}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] hover:-translate-y-1"
              >
                Tenter la Mythique (5% !)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
