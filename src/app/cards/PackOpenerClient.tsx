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


  const boxesData: any = {
    standard: {
      name: "Standard",
      image: "/StandardB.png",
      price: 150,
      owned: ownedStandard,
      glow: "bg-blue-500",
      text: "text-blue-400",
      border: "border-blue-500",
      bgBase: "bg-blue-900/20",
      shadow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
      hueRotate: "",
      rates: [ {r: "Commune", p: "40%", c: "text-gray-400"}, {r: "Peu Commune", p: "30%", c: "text-green-400"}, {r: "Rare", p: "20%", c: "text-blue-400"}, {r: "Épique", p: "7.8%", c: "text-purple-400"}, {r: "Légendaire", p: "2%", c: "text-yellow-400"}, {r: "Mythique", p: "0.2%", c: "text-red-500"} ]
    },
    premium: {
      name: "Premium",
      image: "/PreniumB.png",
      price: 250,
      owned: ownedPremium,
      glow: "bg-purple-500",
      text: "text-purple-400",
      border: "border-purple-500",
      bgBase: "bg-purple-900/20",
      shadow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
      hueRotate: "",
      rates: [ {r: "Commune", p: "20%", c: "text-gray-400"}, {r: "Peu Commune", p: "25%", c: "text-green-400"}, {r: "Rare", p: "35%", c: "text-blue-400"}, {r: "Épique", p: "14.5%", c: "text-purple-400"}, {r: "Légendaire", p: "5%", c: "text-yellow-400"}, {r: "Mythique", p: "0.5%", c: "text-red-500"} ]
    },
    legendary: {
      name: "Légendaire",
      image: "/StandardB.png",
      price: 400,
      owned: ownedLegendary,
      glow: "bg-amber-500",
      text: "text-amber-400",
      border: "border-amber-500",
      bgBase: "bg-amber-900/20",
      shadow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
      hueRotate: "hue-rotate-180 brightness-150",
      rates: [ {r: "Commune", p: "10%", c: "text-gray-400"}, {r: "Peu Commune", p: "15%", c: "text-green-400"}, {r: "Rare", p: "40%", c: "text-blue-400"}, {r: "Épique", p: "23%", c: "text-purple-400"}, {r: "Légendaire", p: "10%", c: "text-yellow-400"}, {r: "Mythique", p: "2%", c: "text-red-500"} ]
    },
    mythic: {
      name: "Mythique",
      image: "/MythiqueB.png",
      price: 750,
      owned: ownedMythic,
      glow: "bg-red-600",
      text: "text-red-500",
      border: "border-red-500",
      bgBase: "bg-red-900/20",
      shadow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
      hueRotate: "",
      rates: [ {r: "Épique", p: "75%", c: "text-purple-400"}, {r: "Légendaire", p: "20%", c: "text-yellow-400"}, {r: "Mythique", p: "5%", c: "text-red-500"} ]
    }
  };
  const activeBox = boxesData[selectedBoxType] || boxesData['standard'];

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
        <div className="bg-[#0f0f16] border border-indigo-500/20 rounded-3xl p-4 lg:p-6 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
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

          {!showReveal && (
            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-10 mb-4 z-10 mt-14 relative">
              {/* LEFT COLUMN: Booster Selection List */}
              <div className="w-full lg:w-1/3 flex flex-col gap-3 z-20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 px-2">
                  <Layers className="w-5 h-5 text-indigo-400" /> Sélecteur de Boosters
                </h3>
                
                {Object.keys(boxesData).map(key => {
                  const box = boxesData[key];
                  const isSelected = selectedBoxType === key;
                  return (
                    <div 
                      key={key}
                      onClick={() => !isOpening && setSelectedBoxType(key)}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                        isSelected 
                        ? `${box.bgBase} ${box.border} ${box.shadow} scale-[1.02]` 
                        : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      {isSelected && <div className={`absolute inset-0 opacity-20 bg-gradient-to-r from-transparent to-${box.glow.split('-')[1]}-500 pointer-events-none`} />}
                      
                      <div className={`relative w-16 h-16 rounded-xl flex items-center justify-center border-2 shrink-0 overflow-hidden ${isSelected ? box.border + ' bg-black/50' : 'border-white/10 bg-black/40'}`}>
                        {isSelected && <div className={`absolute inset-0 ${box.glow} opacity-30 blur-md`}></div>}
                        <img src={box.image} alt={box.name} className={`w-12 h-12 object-contain drop-shadow-lg relative z-10 ${box.hueRotate}`} />
                        {key === 'mythic' && (
                          <div className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse z-20">
                            <Clock className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col flex-1 relative z-10">
                        <h4 className={`text-lg font-black uppercase tracking-wide ${isSelected ? box.text : 'text-gray-300'}`}>{box.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${box.owned > 0 ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                            Stock: {box.owned}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT COLUMN: The Stage */}
              <div className="w-full lg:w-2/3 relative flex flex-col items-center justify-center p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[500px]">
                {/* Dynamic Background Glow */}
                <div className={`absolute inset-0 opacity-10 blur-3xl rounded-full ${activeBox.glow} transition-colors duration-700 pointer-events-none`} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

                {/* Booster Info Header */}
                <div className="absolute top-6 left-6 z-20 pointer-events-none">
                  <h2 className={`text-3xl font-black uppercase tracking-wider ${activeBox.text} drop-shadow-lg`}>
                    Booster {activeBox.name}
                  </h2>
                  <p className="text-white/60 text-sm font-medium mt-1">
                    {activeBox.owned > 0 ? 'Prêt à être ouvert' : 'Achetez pour obtenir de nouvelles cartes'}
                  </p>
                </div>

                {/* Drop Rates Table */}
                <div className="absolute top-6 right-6 z-20 bg-black/60 border border-white/10 rounded-xl p-4 shadow-xl backdrop-blur-md hidden sm:block pointer-events-none">
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 border-b border-white/10 pb-2 ${activeBox.text}`}>
                    Taux de Drop
                  </h4>
                  <ul className="text-xs space-y-1.5 w-32">
                    {activeBox.rates.map((rate: any, idx: number) => (
                      <li key={idx} className={`flex justify-between font-medium ${rate.c}`}>
                        <span>{rate.r}</span>
                        <span className="font-mono">{rate.p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The Booster Image */}
                <div className="relative mt-12 mb-4 z-10 w-full flex justify-center pointer-events-none">
                  <div className={`absolute inset-0 opacity-40 blur-3xl rounded-full ${activeBox.glow} transition-all duration-700 ${isOpening ? 'scale-150' : ''}`} />
                  <img 
                    src={activeBox.image} 
                    alt={activeBox.name} 
                    className={`w-64 h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 ease-in-out relative z-10 ${isOpening ? 'animate-shake scale-110' : 'animate-float'} ${activeBox.hueRotate}`} 
                    style={isOpening ? { filter: 'brightness(1.5) contrast(1.2)' } : {}}
                  />
                  {isOpening && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                       <Sparkles className={`w-40 h-40 animate-ping ${activeBox.text}`} />
                    </div>
                  )}
                </div>

                {/* Action Area */}
                <div className="mt-auto pt-8 w-full max-w-sm relative z-20 flex flex-col gap-3">
                  {!isOpening && activeBox.owned > 0 && (
                    <button 
                      onClick={openPack}
                      disabled={isOpening || isBuying}
                      className={`group relative w-full py-4 rounded-xl font-black text-xl text-white overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl border ${activeBox.border}`}
                    >
                      <div className={`absolute inset-0 ${activeBox.glow} opacity-50 group-hover:opacity-80 transition-opacity`} />
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative flex items-center justify-center gap-3 drop-shadow-md">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        Ouvrir le Booster
                      </span>
                    </button>
                  )}
                  {!isOpening && (
                    coins < activeBox.price ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push('/shop'); }}
                        className={`flex items-center justify-center gap-2 w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-xl font-bold text-white transition-all shadow-[0_0_15px_rgba(156,163,175,0.2)] border border-gray-600 ${activeBox.owned > 0 ? 'py-3 text-sm' : 'py-4 text-lg'}`}
                      >
                        Fonds insuffisants - Boutique
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); buyBooster(selectedBoxType, activeBox.price); }} 
                        disabled={isBuying} 
                        className={`relative overflow-hidden flex items-center justify-center gap-2 w-full rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-2xl border ${activeBox.border} ${activeBox.owned > 0 ? 'py-3 text-sm' : 'py-4 text-lg'}`}
                      >
                        <div className={`absolute inset-0 ${activeBox.glow} opacity-30 group-hover:opacity-50 transition-opacity`} />
                        <span className="relative flex items-center gap-2 drop-shadow-md">
                          Acheter pour <img src="/Paracoin.png" alt="PARA" className="w-5 h-5 object-contain" /> {activeBox.price}
                        </span>
                      </button>
                    )
                  )}
                  {isOpening && (
                    <div className="w-full py-4 text-center text-white/50 font-bold animate-pulse text-lg tracking-widest uppercase">
                      Ouverture en cours...
                    </div>
                  )}
                </div>
              </div>
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
            <div className="z-10 flex flex-col items-center animate-slide-up relative mt-2 w-full max-w-7xl mx-auto">
              
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
