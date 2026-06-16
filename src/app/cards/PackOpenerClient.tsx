"use client";

import { useState, useMemo, useEffect } from "react";
import { PackageOpen, Loader2, X, Search, Filter, Sparkles, Layers, Lock, BookOpen, Flame, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import CardDisplay from "@/components/cards/CardDisplay";
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';


type Player = { id: string; minecraftName: string };
type TradingCard = { id: string; title: string; rarity: string; level: string; edition: string; description: string | null; player: Player | null; attributes?: string };
type UserCard = { id: string; obtainedAt: Date; tradingCard: TradingCard; specialEffect?: string | null };

const FlippableCard = ({ card, index, boxType, allCards }: { card: TradingCard, index: number, boxType: string, allCards: any[] }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showWow, setShowWow] = useState(false);

  const handleFlip = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    if (card.rarity === 'MYTHIC' || card.rarity === 'LEGENDARY') {
      setShowWow(true);
      // Trigger Confetti
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 300,
          colors: card.rarity === 'MYTHIC' ? ['#ef4444', '#dc2626', '#b91c1c', '#ffffff'] : ['#facc15', '#eab308', '#ca8a04', '#ffffff']
        });
        confetti({
          particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 300,
          colors: card.rarity === 'MYTHIC' ? ['#ef4444', '#dc2626', '#b91c1c', '#ffffff'] : ['#facc15', '#eab308', '#ca8a04', '#ffffff']
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
      setTimeout(() => setShowWow(false), 3500);
    }
  };

  return (
    <>
      {showWow && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center pointer-events-none">
          <div className={`absolute inset-0 animate-flash-fade ${card.rarity === 'MYTHIC' ? 'bg-red-500/40' : 'bg-yellow-500/40'} mix-blend-screen`}></div>

        </div>
      )}
      <div 
        className="relative z-10 animate-epic-card-reveal cursor-pointer group shrink-0" 
        style={{ animationDelay: `${index * 0.4}s`, animationFillMode: 'both', perspective: '1000px', width: '16rem', height: '22.4rem', minWidth: '16rem' }}
        onClick={handleFlip}
      >
        {/* Wrapper pour le survol */}
        <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
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
      </div>
    </>
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
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [drawnCards, setDrawnCards] = useState<TradingCard[]>([]);
  const [showReveal, setShowReveal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TradingCard | null>(null);
  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = 'hidden';
      // Optionnel: document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Optionnel: document.documentElement.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedCard]);
  const [selectedUserCardEffect, setSelectedUserCardEffect] = useState<string | null>(null);
  const [openingGlow, setOpeningGlow] = useState<string | null>(null);
  const [showRatesModal, setShowRatesModal] = useState(false);
  
  // Fake recent drops for massive FOMO
  const [fomoDrop, setFomoDrop] = useState<{player: string, rarity: string, time: number}>({ player: 'GamerX_99', rarity: 'Légendaire', time: 2 });

  const [activeTab, setActiveTab] = useState<"opener" | "collection" | "catalogue">("opener");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRarity, setFilterRarity] = useState("ALL");
  const [filterEdition, setFilterEdition] = useState("ALL");
  const [filterEffect, setFilterEffect] = useState("ALL");
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
      toast("Vous devez être connecté.", { icon: '⚠️', position: 'top-center' });
      return;
    }
    if (coins < price) {
      toast.error("Fonds insuffisants !", { position: 'top-center' });
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
      toast.error(e.message, { position: 'top-center' });
    } finally {
      setIsBuying(false);
    }
  };

  const openPack = async () => {
    if (!isLoggedIn) {
      toast("Vous devez être connecté pour ouvrir des boosters.", { icon: '⚠️', position: 'top-center' });
      return;
    }

    const userBox = boxes.find(b => b.boxType === selectedBoxType);
    if (!userBox || userBox.amount <= 0) {
      toast(`Vous ne possédez aucun Booster ${selectedBoxType}.`, { icon: '⚠️', position: 'top-center' });
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
      toast.error(error.message, { position: 'top-center' });
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
      image: "/LegendaireB.png",
      price: 400,
      owned: ownedLegendary,
      glow: "bg-amber-500",
      text: "text-amber-400",
      border: "border-amber-500",
      bgBase: "bg-amber-900/20",
      shadow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
      hueRotate: "",
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.15)_0%,_transparent_70%)] -z-10 rounded-full" />
        
        {/* Premium Tabs */}
        <div className="flex gap-2 p-1.5 bg-black/60 border border-white/10 rounded-2xl shadow-2xl">
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
            {activeTab === 'catalogue' && <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/80 to-purple-600/80 shadow-[0_0_20px_rgba(192,38,211,0.5)]" />}
            <BookOpen className="w-5 h-5 relative z-10" /> 
            <span className="relative z-10 tracking-wide">Catalogue</span>
          </button>
        </div>
        
        {/* Coin Balance Display */}
        {isLoggedIn && (
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md border border-amber-500/20 px-6 py-3 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.15)] group hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 group-hover:scale-110 transition-transform duration-300">
              <img src="/Paracoin.png" alt="PARA Coins" className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] " />
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="text-xs text-amber-500/70 font-bold uppercase tracking-wider">Solde</span>
              <span className="font-outfit font-black text-white text-2xl leading-none tracking-tight">{coins.toLocaleString()}</span>
            </div>
            

          </div>
        )}
      </div>

      {activeTab === "opener" && (
        <div className="bg-[#0f0f16] border border-indigo-500/20 rounded-3xl p-4 lg:p-6 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0f0f16] to-[#0f0f16] pointer-events-none" />
          


          {!showReveal && (
            <div className="w-full flex flex-col items-center z-10 mt-4 relative">
              
              {/* Dynamic Background matching the active booster */}
              <div className={`absolute inset-0 opacity-20 blur-xl rounded-[100px] transition-colors duration-1000 ${activeBox.glow} pointer-events-none`} />



              
                
                {/* Title & Stock info moved TO TOP */}
              <div className="mb-2 text-center z-20 h-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBox.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className={`text-4xl font-black uppercase tracking-widest ${activeBox.text} drop-shadow-2xl`}>
                      {activeBox.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-2 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 w-fit mx-auto shadow-xl">
                      <div className={`w-2.5 h-2.5 rounded-full ${activeBox.owned > 0 ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
                      <span className={`text-sm font-bold tracking-wider ${activeBox.owned > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        STOCK: {activeBox.owned}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Carousel Container */}
              <div className="relative w-full max-w-5xl h-[320px] md:h-[400px] flex items-center justify-center">
                
                {/* Navigation Arrows */}
                <button 
                  onClick={() => !isOpening && setSelectedBoxType(Object.keys(boxesData)[(Object.keys(boxesData).indexOf(selectedBoxType) - 1 + Object.keys(boxesData).length) % Object.keys(boxesData).length])}
                  className="absolute left-2 md:left-12 z-30 p-4 rounded-full bg-black/50 border border-white/10 hover:bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button 
                  onClick={() => !isOpening && setSelectedBoxType(Object.keys(boxesData)[(Object.keys(boxesData).indexOf(selectedBoxType) + 1) % Object.keys(boxesData).length])}
                  className="absolute right-2 md:right-12 z-30 p-4 rounded-full bg-black/50 border border-white/10 hover:bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="relative w-full h-full flex items-center justify-center perspective-[1200px]">
                  <AnimatePresence initial={false}>
                    {Object.keys(boxesData).map((key, index) => {
                      const box = boxesData[key];
                      const keys = Object.keys(boxesData);
                      const activeIndex = keys.indexOf(selectedBoxType);
                      const n = keys.length;
                      
                      // Correct index logic for wrapping
                      let offset = (index - activeIndex + n) % n;
                      if (offset === 3) offset = -1; // Specific for 4 items

                      const isActive = offset === 0;
                      const isVisible = Math.abs(offset) <= 1;

                      if (!isVisible) return null;

                      // Tailwind v4 uses standard filter names directly, but combining them needs to be done on the img tag class.
                      // The red dot bug is fixed by wrapping the img in a relative inline-block div.
                      return (
                        <motion.div
                          key={key}
                          onClick={() => {
                            if (!isOpening && !isActive) setSelectedBoxType(key);
                          }}
                          initial={false}
                          animate={{
                            x: offset * 320, 
                            scale: isActive ? 1.2 : 0.75,
                            opacity: isActive ? 1 : 0.4,
                            rotateY: offset * -15,
                            zIndex: isActive ? 20 : 10,
                          }}
                          transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1.2 }}
                          className={`absolute flex flex-col items-center justify-center cursor-pointer ${isActive ? 'pointer-events-auto' : 'pointer-events-auto hover:opacity-80'}`}
                          drag={isActive ? "x" : false}
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.2}
                          onDragEnd={(e, { offset, velocity }) => {
                            const swipe = offset.x;
                            if (swipe < -50) {
                              setSelectedBoxType(keys[(activeIndex + 1) % n]);
                            } else if (swipe > 50) {
                              setSelectedBoxType(keys[(activeIndex - 1 + n) % n]);
                            }
                          }}
                        >
                          <div className={`relative flex justify-center ${isActive && isOpening ? 'animate-shake' : isActive ? 'animate-float' : ''}`}>
                            {isActive && <div className={`absolute inset-0 opacity-50 blur-3xl rounded-full ${box.glow} transition-all duration-700 ${isOpening ? 'scale-150' : ''}`} />}
                            
                            <div className="relative inline-block">
                              <img 
                                src={box.image} 
                                alt={box.name} 
                                className={`w-48 md:w-56 h-auto drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] relative z-10 ${box.hueRotate ? box.hueRotate : ''} ${isActive && isOpening ? 'brightness-150 contrast-125' : ''}`}
                                draggable={false}
                              />
                            </div>
                            
                            {isActive && isOpening && (
                              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                                <Sparkles className={`w-40 h-40 animate-ping ${box.text}`} />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Area & Sleek Drop Rates */}
              <div className="w-full max-w-3xl mt-4 px-4 flex flex-col items-center justify-center relative z-20">
                {/* Center: Action Buttons */}
                <div className="w-full md:w-[400px] flex flex-col gap-3 mb-6">
                  {!isOpening && activeBox.owned > 0 && (
                    <button 
                      onClick={openPack}
                      disabled={isOpening || isBuying}
                      className={`group relative w-full py-4 rounded-2xl font-black text-2xl text-white overflow-hidden transition-all hover:-translate-y-1 active:translate-y-1 active:border-b-0 shadow-xl border-t border-x border-b-4 ${activeBox.border} bg-black/60`}
                    >
                      <div className={`absolute inset-0 ${activeBox.glow} opacity-30 group-hover:opacity-50 transition-opacity`} />
                      <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-45deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                      <span className="relative flex items-center justify-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                        <Sparkles className="w-7 h-7 text-white animate-pulse" />
                        OUVRIR LE BOOSTER
                      </span>
                    </button>
                  )}
                  {!isOpening && (
                    coins < activeBox.price ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push('/shop'); }}
                        className={`flex items-center justify-center gap-2 w-full bg-red-950/80 hover:bg-red-900/80 rounded-xl font-bold text-white transition-all shadow-lg border-t border-x border-b-4 border-red-800 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-0 ${activeBox.owned > 0 ? 'py-3 text-xs uppercase' : 'py-4 text-lg'}`}
                      >
                        <Lock className="w-4 h-4" /> Fonds insuffisants - Boutique
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); buyBooster(selectedBoxType, activeBox.price); }} 
                        disabled={isBuying} 
                        className={`group relative overflow-hidden flex items-center justify-center gap-2 w-full rounded-xl font-black text-white transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-0 shadow-lg border-t border-x border-b-4 ${activeBox.border} bg-black/60 ${activeBox.owned > 0 ? 'py-3 text-sm' : 'py-4 text-xl'}`}
                      >
                        <div className={`absolute inset-0 ${activeBox.glow} opacity-10 group-hover:opacity-30 transition-opacity`} />
                        <span className="relative flex items-center gap-2 drop-shadow-md uppercase tracking-widest">
                          ACHETER POUR <img src="/Paracoin.png" alt="PARA" className="w-5 h-5 object-contain" /> {activeBox.price}
                        </span>
                      </button>
                    )
                  )}
                  {isOpening && (
                    <div className="w-full py-4 text-center text-white/50 font-bold animate-pulse text-xl tracking-widest uppercase">
                      Ouverture en cours...
                    </div>
                  )}
                </div>

                {/* Sleek Drop Rates Row using CSS Grid for perfect wrapping */}
                <div className="w-full mt-2 flex flex-col items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-white/10"></span>
                    Probabilités d'obtention
                    <span className="w-8 h-[1px] bg-white/10"></span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-xl">
                    {activeBox.rates.map((rate: any, idx: number) => (
                      <div key={idx} className={`flex justify-between items-center px-3 py-1.5 rounded-lg border border-white/5 bg-black/40 backdrop-blur-sm shadow-inner ${rate.c}`}>
                        <span className="text-xs font-bold uppercase tracking-wider truncate mr-2">{rate.r}</span>
                        <span className="text-xs font-mono font-black opacity-80">{rate.p}</span>
                      </div>
                    ))}
                  </div>
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
  
              {/* HUGE TEXT OVERLAY FOR BIG WINS */}
              {showReveal && (openingGlow === 'MYTHIC' || openingGlow === 'LEGENDARY') && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center pointer-events-none">
                  <h2 className={`font-black uppercase tracking-widest animate-huge-reveal ${
                    openingGlow === 'MYTHIC' ? 'text-red-500 drop-shadow-[0_0_80px_rgba(239,68,68,1)] text-stroke-mythic' : 
                    'text-yellow-400 drop-shadow-[0_0_80px_rgba(250,204,21,1)] text-stroke-legendary'
                  }`} style={{ WebkitTextStroke: '3px white', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.8))' }}>
                    {openingGlow === 'MYTHIC' ? 'MYTHIQUE !' : 'LÉGENDAIRE !'}
                  </h2>
                </div>
              )}

              {openingGlow && (
                   <div className={`absolute inset-0 z-0  blur-lg ${
                     openingGlow === 'MYTHIC' ? 'bg-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.5)]' :
                     openingGlow === 'LEGENDARY' ? 'bg-yellow-400/30 shadow-[0_0_50px_rgba(250,204,21,0.5)]' :
                     'bg-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.5)]'
                   }`} />
                )}
                <img src={selectedBoxType === "standard" ? "/StandardB.png" : selectedBoxType === "premium" ? "/PreniumB.png" : selectedBoxType === "legendary" ? "/LegendaireB.png" : "/MythiqueB.png"} alt="Booster Pack" className={`w-80 h-auto relative z-10 transition-all duration-700 ${
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

              {/* HUGE TEXT OVERLAY FOR BIG WINS */}
              {showReveal && (openingGlow === 'MYTHIC' || openingGlow === 'LEGENDARY') && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center pointer-events-none">
                  <h2 className={`font-black uppercase tracking-widest animate-huge-reveal ${
                    openingGlow === 'MYTHIC' ? 'text-red-500 drop-shadow-[0_0_80px_rgba(239,68,68,1)] text-stroke-mythic' : 
                    'text-yellow-400 drop-shadow-[0_0_80px_rgba(250,204,21,1)] text-stroke-legendary'
                  }`} style={{ WebkitTextStroke: '3px white', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.8))' }}>
                    {openingGlow === 'MYTHIC' ? 'MYTHIQUE !' : 'LÉGENDAIRE !'}
                  </h2>
                </div>
              )}

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
                  <FlippableCard key={i} card={card} index={i} boxType={selectedBoxType} allCards={allCards} />
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
            <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 items-center justify-between sticky top-4 z-40">
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
                              <div className="absolute -top-3 -right-3 z-50 bg-red-600 text-white font-black text-sm px-2.5 py-1 rounded-full border-2 border-[#111118] shadow-[0_0_10px_rgba(220,38,38,0.6)] ">
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
          <div className="relative mb-12 p-[1px] rounded-2xl bg-gradient-to-r from-fuchsia-500/30 via-purple-500/30 to-blue-500/30 shadow-2xl">
            <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 items-center justify-between sticky top-4 z-40">
              <div className="flex flex-col items-center lg:items-start gap-1 w-full lg:w-auto">
                <h2 className="text-3xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 flex items-center gap-3">
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
                              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center ">
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="relative w-full max-w-5xl flex flex-col md:flex-row items-center md:items-stretch gap-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute -top-16 right-0 md:-top-6 md:-right-16 text-white/50 hover:text-white transition-colors z-50 bg-white/5 hover:bg-purple-500/20 p-3 rounded-full border border-white/10"
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
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.2)_0%,_transparent_70%)] rounded-full pointer-events-none"></div>
              
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
                {(() => {
                   try {
                      const attrs = typeof selectedCard.attributes === 'string' ? JSON.parse(selectedCard.attributes) : (selectedCard.attributes || {});
                      
                      // Find if this card is a parent (has evolutions)
                      const evolutions = allCards.filter(c => {
                         try {
                            return JSON.parse(c.attributes || '{}').parentCardId === selectedCard.id;
                         } catch { return false; }
                      });

                      return (
                        <div className="flex flex-col gap-2 mt-4">
                          {attrs.parentCardTitle && (
                            <p className="text-sm font-bold text-fuchsia-400 bg-fuchsia-500/10 px-3 py-2 rounded-lg border border-fuchsia-500/20 inline-block w-fit">
                              ✨ Variante de : {attrs.parentCardTitle}
                            </p>
                          )}
                          {evolutions.length > 0 && (
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                              <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> Évolution(s) Possible(s)
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {evolutions.map(evo => (
                                  <span key={evo.id} className="text-sm bg-black/40 text-indigo-200 px-3 py-1 rounded-full border border-indigo-500/30">
                                    ➡️ {evo.title || evo.player?.minecraftName}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                   } catch (e) {}
                   return null;
                })()}
              </div>

              {selectedCard.player && (
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative z-10 bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <img src={`https://vzge.me/bust/512/${selectedCard.player.minecraftName}.png`} alt="Skin" className="w-12 h-12 object-contain drop-shadow-lg" />
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
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300"
          onClick={() => setShowRatesModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#0f0f16] border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
            
            <button 
              onClick={() => setShowRatesModal(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 bg-white/5 hover:bg-purple-500/20 p-2 rounded-full border border-white/10"
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
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.7)] hover:-translate-y-1"
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
