"use client";

import { useState, useEffect } from "react";
import { Plus, GripVertical, Settings, Save, Trash2, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function TierListPage() {
  const { data: session } = useSession();
  const GAME_MODES = ["GÉNERAL", "CRYSTAL", "SWORD", "UHC", "POT", "NETHPOT", "SMP", "AXE", "DIASMP", "MACE"];
  const [activeMode, setActiveMode] = useState("GÉNERAL");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  type Tier = {
    id: string;
    name: string;
    color: string;
    items: string[];
  };

  const defaultTiers: Tier[] = [
    { id: "s", name: "S", color: "bg-red-500", items: [] },
    { id: "a", name: "A", color: "bg-orange-500", items: [] },
    { id: "b", name: "B", color: "bg-yellow-500", items: [] },
    { id: "c", name: "C", color: "bg-green-500", items: [] },
    { id: "d", name: "D", color: "bg-blue-500", items: [] },
  ];

  const [tiers, setTiers] = useState<Tier[]>(defaultTiers);

  useEffect(() => {
    const loadTierList = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/tierlist?gameMode=${activeMode}`);
        if (res.ok) {
          const { data } = await res.json();
          if (data) {
            setTiers(data);
          } else {
            setTiers(defaultTiers);
          }
        }
      } catch (err) {
        console.error("Failed to load tierlist", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTierList();
  }, [activeMode]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/tierlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameMode: activeMode, data: tiers })
      });
      if (res.ok) {
        alert("Tier List sauvegardée avec succès !");
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    } finally {
      setIsSaving(false);
    }
  };
  const [allPlayers, setAllPlayers] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/players")
      .then(res => res.json())
      .then(data => {
        setAllPlayers(data.map((p: any) => p.minecraftName));
      });
  }, []);

  const rankedNames = tiers.flatMap(t => t.items);
  const unranked = allPlayers.filter(name => !rankedNames.includes(name));

  const handleDragStart = (e: React.DragEvent, itemName: string) => {
    e.dataTransfer.setData("text/plain", itemName);
  };

  const handleDropToTier = (e: React.DragEvent, targetTierId: string) => {
    e.preventDefault();
    const itemName = e.dataTransfer.getData("text/plain");
    if (!itemName) return;

    setTiers(prev => {
      // Remove item from any existing tier
      const newTiers = prev.map(t => ({ ...t, items: t.items.filter(i => i !== itemName) }));
      // Add to target tier
      const target = newTiers.find(t => t.id === targetTierId);
      if (target) {
        target.items.push(itemName);
      }
      return newTiers;
    });
  };

  const handleDropToUnranked = (e: React.DragEvent) => {
    e.preventDefault();
    const itemName = e.dataTransfer.getData("text/plain");
    if (!itemName) return;

    setTiers(prev => prev.map(t => ({ ...t, items: t.items.filter(i => i !== itemName) })));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleRemoveFromTier = (itemName: string) => {
    setTiers(prev => prev.map(t => ({ ...t, items: t.items.filter(i => i !== itemName) })));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white glow-red inline-block mb-2 text-gradient">Classement Top 100</h1>
          <p className="text-[var(--color-text-secondary)]">Classement officiel du serveur.</p>
        </div>
        <div className="flex gap-2">
          {(session?.user as any)?.role === "ADMIN" && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm hidden md:flex text-green-400 border-green-500/30 hover:bg-green-500/10"
            >
              <Save className="w-4 h-4" /> {isSaving ? "Enregistrement..." : "Sauvegarder"}
            </button>
          )}
          <button className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm hidden md:flex">
            <Share2 className="w-4 h-4" /> Partager
          </button>
          <button className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm hidden md:flex">
            <Settings className="w-4 h-4" /> Paramètres
          </button>
        </div>
      </div>

      {/* Barre des Modes de Jeu */}
      <div className="panel-matte p-4 rounded-xl mb-6 flex flex-wrap gap-2 justify-center">
        {GAME_MODES.map((mode) => (
          <button 
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`px-4 py-2 rounded-lg font-outfit font-bold text-sm transition-all duration-200 border ${
              activeMode === mode 
                ? "bg-[var(--color-accent-purple)] text-white border-transparent" 
                : "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border-color)] hover:text-white hover:border-[var(--color-text-muted)]"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="panel-matte rounded-2xl overflow-hidden border border-[var(--color-border-color)]">
        <div className="flex flex-col">
          {tiers.map((tier) => (
            <div key={tier.id} className="flex min-h-[100px] border-b border-[var(--color-border-color)] last:border-b-0">
              {/* Tier Label */}
              <div className={`w-24 md:w-32 flex-shrink-0 flex items-center justify-center font-outfit font-black text-2xl text-white shadow-inner relative group ${tier.color}`}>
                {tier.name}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Settings className="w-5 h-5" />
                </div>
              </div>
              
              {/* Tier Content Area */}
              <div 
                className="flex-1 bg-[rgba(0,0,0,0.3)] p-3 flex flex-wrap gap-2 items-start content-start"
                onDrop={(e) => handleDropToTier(e, tier.id)}
                onDragOver={handleDragOver}
              >
                {tier.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] px-3 py-2 rounded shadow-sm text-sm font-medium text-white flex flex-col items-center gap-1 cursor-grab hover:border-[var(--color-accent-purple)] transition-colors relative group"
                  >
                    <img src={`https://render.crafty.gg/3d/bust/${item}`} alt={item} className="w-12 h-12 object-contain pointer-events-none" />
                    <span>{item}</span>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => handleRemoveFromTier(item)}>
                      <Trash2 className="w-3 h-3 text-red-500 hover:text-red-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unranked Pool */}
      <div className="mt-8 panel-matte p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-outfit font-bold text-white text-lg">Éléments non classés</h3>
          <button className="text-[var(--color-text-secondary)] hover:text-white transition-colors flex items-center gap-1 text-sm">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
        <div 
          className="min-h-[100px] bg-[rgba(0,0,0,0.3)] rounded-lg border border-dashed border-[var(--color-border-color)] p-3 flex flex-wrap gap-2"
          onDrop={handleDropToUnranked}
          onDragOver={handleDragOver}
        >
          {unranked.map(item => (
            <div 
               key={item} 
               draggable
               onDragStart={(e) => handleDragStart(e, item)}
               className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] px-3 py-2 rounded shadow-sm text-sm font-medium text-white flex flex-col items-center gap-1 cursor-grab hover:border-[var(--color-accent-purple)] transition-colors relative group"
            >
               <img src={`https://render.crafty.gg/3d/bust/${item}`} alt={item} className="w-12 h-12 object-contain pointer-events-none" />
               <span>{item}</span>
            </div>
          ))}
          {unranked.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-sm italic">
              Glissez des éléments ici... ou ajoutez des joueurs dans l'Espace Admin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
