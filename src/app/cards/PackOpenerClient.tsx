"use client";

import { useState } from "react";
import { PackageOpen, Loader2, X } from "lucide-react";
import CardDisplay from "@/components/cards/CardDisplay";

type Player = { id: string; minecraftName: string };
type TradingCard = { id: string; title: string; rarity: string; level: string; description: string; player: Player | null };
type UserCard = { id: string; obtainedAt: Date; tradingCard: TradingCard };

export default function PackOpenerClient({ initialInventory, isLoggedIn }: { initialInventory: UserCard[], isLoggedIn: boolean }) {
  const [inventory, setInventory] = useState<UserCard[]>(initialInventory);
  const [isOpening, setIsOpening] = useState(false);
  const [drawnCard, setDrawnCard] = useState<TradingCard | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TradingCard | null>(null);

  const openPack = async () => {
    if (!isLoggedIn) {
      alert("Vous devez être connecté pour ouvrir un booster.");
      return;
    }
    
    setIsOpening(true);
    setDrawnCard(null);
    setShowReveal(false);

    try {
      const res = await fetch("/api/packs", { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setDrawnCard(data.drawnCard);
      setTimeout(() => {
        setIsOpening(false);
        setShowReveal(true);
        setInventory(prev => [data.userCard, ...prev]);
      }, 1500);

    } catch (error: any) {
      alert(error.message);
      setIsOpening(false);
    }
  };

  // Group inventory by tradingCardId for Stacking
  const groupedInventory = inventory.reduce((acc, curr) => {
    const id = curr.tradingCard.id;
    if (!acc[id]) {
      acc[id] = { card: curr.tradingCard, count: 0, latestObtained: curr.obtainedAt };
    }
    acc[id].count += 1;
    if (new Date(curr.obtainedAt) > new Date(acc[id].latestObtained)) {
      acc[id].latestObtained = curr.obtainedAt;
    }
    return acc;
  }, {} as Record<string, { card: TradingCard, count: number, latestObtained: Date }>);

  // Convert to array and sort by latestObtained
  const stackedItems = Object.values(groupedInventory).sort((a, b) => new Date(b.latestObtained).getTime() - new Date(a.latestObtained).getTime());

  return (
    <div className="w-full">
      {/* Booster Opening Section */}
      <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-2xl p-8 mb-16 flex flex-col items-center text-center relative overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />
        
        <h2 className="text-3xl font-outfit font-black text-white mb-4 z-10">Ouvrir un Booster</h2>
        <p className="text-[var(--color-text-secondary)] mb-8 max-w-lg z-10">
          Tentez votre chance et obtenez une nouvelle carte aléatoire pour agrandir votre collection.
        </p>

        {!showReveal && (
          <div className="z-10 flex flex-col items-center">
            <button 
              onClick={openPack} 
              disabled={isOpening}
              className={`relative cursor-pointer transition-transform hover:scale-105 active:scale-95 outline-none ${isOpening ? "animate-shake animate-booster-flash pointer-events-none" : ""}`}
            >
              <img src="/Nouveau_projet_2.png" alt="Booster Pack" className="w-64 h-auto drop-shadow-[0_0_30px_rgba(179,102,255,0.4)]" />
            </button>
            {!isOpening && (
              <p className="mt-6 text-white font-bold tracking-widest uppercase animate-pulse">Cliquez pour ouvrir</p>
            )}
          </div>
        )}

        {/* The Drawn Card Reveal */}
        {showReveal && drawnCard && (
          <div className="z-10 flex flex-col items-center animate-slide-up relative">
            <CardDisplay card={drawnCard} size="lg" />
            
            <button onClick={() => setShowReveal(false)} className="mt-8 text-[var(--color-text-secondary)] hover:text-white transition-colors border border-[var(--color-border-color)] px-4 py-2 rounded-lg bg-[var(--color-bg-elevated)]">
              Ouvrir un autre booster
            </button>
          </div>
        )}
      </div>

      {/* Inventory Section */}
      <div>
        <h2 className="text-2xl font-outfit font-bold text-white mb-6">Votre Collection ({inventory.length} cartes)</h2>
        {stackedItems.length === 0 ? (
          <div className="text-center p-12 bg-[var(--color-bg-elevated)] rounded-xl border border-[var(--color-border-color)] text-[var(--color-text-secondary)]">
            Vous ne possédez aucune carte pour le moment. Ouvrez un booster pour commencer !
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {stackedItems.map(item => {
              const card = item.card;
              return (
                <div key={card.id} className="relative group">
                  <div 
                    onClick={() => setSelectedCard(card)}
                    className="cursor-pointer transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2"
                  >
                    <CardDisplay card={card} size="md" />
                  </div>

                  {/* Stacking Badge */}
                  {item.count > 1 && (
                    <div className="absolute -top-3 -right-3 z-50 bg-red-600 text-white font-black text-sm px-2.5 py-1 rounded-full border-2 border-[#111118] shadow-lg animate-bounce-slow">
                      x{item.count}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Fullscreen Card Modal */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="relative max-w-sm w-full animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCard(null)}
              className="absolute -top-12 right-0 md:-right-12 md:top-0 text-white hover:text-red-400 transition-colors z-50 bg-black/50 p-2 rounded-full border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
            <CardDisplay card={selectedCard} size="lg" />
          </div>
        </div>
      )}
    </div>
  );
}
