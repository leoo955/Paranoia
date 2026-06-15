"use client";

import { useState, useEffect } from "react";
import { Plus, Users, LayoutList, Trash2, ShieldAlert, Sparkles } from "lucide-react";
import CardDisplay from "@/components/cards/CardDisplay";

type Player = {
  id: string;
  minecraftName: string;
  status: string;
};

type CustomBadge = {
  id: string;
  url: string;
  x: number;
  y: number;
  size: number;
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("players");
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cards, setCards] = useState<any[]>([]);
  const [cardPlayerId, setCardPlayerId] = useState("");
  const [cardRarity, setCardRarity] = useState("COMMON");
  const [cardLevel, setCardLevel] = useState("Normal");
  const [cardProba, setCardProba] = useState(100);
  const [cardDesc, setCardDesc] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardCustomBg, setCardCustomBg] = useState("");
  const [cardImageUrl, setCardImageUrl] = useState("");
  const [cardBorderColor, setCardBorderColor] = useState("");
  const [cardBgColor, setCardBgColor] = useState("");
  const [cardGlowColor, setCardGlowColor] = useState("");
  const [mainColor, setMainColor] = useState("");
  const [rarityBadgeColor, setRarityBadgeColor] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showDesc, setShowDesc] = useState(true);
  const [showRarityBadge, setShowRarityBadge] = useState(true);
  const [showLevelText, setShowLevelText] = useState(true);
  const [showLevelIcon, setShowLevelIcon] = useState(true);
  
  // New Full Art & Color States
  const [isFullArt, setIsFullArt] = useState(false);
  const [cardEffect, setCardEffect] = useState("");
  const [titleColor, setTitleColor] = useState("");
  const [descColor, setDescColor] = useState("");
  const [levelColor, setLevelColor] = useState("");

  const [cardFrameUrl, setCardFrameUrl] = useState("");
  const [cardCustomBadges, setCardCustomBadges] = useState<CustomBadge[]>([]);
  const [charPosX, setCharPosX] = useState(50);
  const [charPosY, setCharPosY] = useState(50);
  const [charScale, setCharScale] = useState(100);
  const [titlePos, setTitlePos] = useState({ x: 50, y: 75, scale: 100 });
  const [descPos, setDescPos] = useState({ x: 50, y: 92, scale: 100 });
  const [rarityBadgePos, setRarityBadgePos] = useState({ x: 15, y: 65, scale: 100 });
  const [levelTextPos, setLevelTextPos] = useState({ x: 50, y: 82, scale: 100 });
  const [levelBadgePos, setLevelBadgePos] = useState({ x: 10, y: 8, scale: 100 });
  const [levelBadgeUrl, setLevelBadgeUrl] = useState("");
  const [draggingItem, setDraggingItem] = useState<{type: string, id: string} | null>(null);
  
  const [templates, setTemplates] = useState<any[]>([]);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingSkin, setUploadingSkin] = useState(false);
  const [uploadingFrame, setUploadingFrame] = useState(false);
  const [creatingCard, setCreatingCard] = useState(false);
  const [cardError, setCardError] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [appUsers, setAppUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setAppUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
        alert("Rôle mis à jour avec succès !");
      } else {
        const msg = await res.text();
        alert("Erreur: " + msg);
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/players");
      if (res.ok) {
        const data = await res.json();
        setPlayers(data);
        if (data.length > 0) setCardPlayerId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch players:", error);
    }
  };

  const fetchCards = async () => {
    try {
      const res = await fetch("/api/cards");
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  useEffect(() => {
    const preventScroll = (e: WheelEvent) => { e.preventDefault(); };
    const el = document.getElementById('live-preview-card');
    if (el) {
      el.addEventListener('wheel', preventScroll, { passive: false });
      return () => el.removeEventListener('wheel', preventScroll);
    }
  });

  useEffect(() => {
    fetchPlayers();
    fetchCards();
    fetchTemplates();
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!draggingItem) return;
      
      const deltaX = (e.movementX / 300) * 100;
      const deltaY = (e.movementY / 420) * 100;
      
      if (draggingItem.type === 'character') {
         setCharPosX(prev => prev + deltaX);
         setCharPosY(prev => prev + deltaY);
      } else if (draggingItem.type === 'title') {
         setTitlePos(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
      } else if (draggingItem.type === 'desc') {
         setDescPos(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
      } else if (draggingItem.type === 'rarityBadge') {
         setRarityBadgePos(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
      } else if (draggingItem.type === 'levelText') {
         setLevelTextPos(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
      } else if (draggingItem.type === 'levelBadge') {
         setLevelBadgePos(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
      } else if (draggingItem.type === 'customBadge') {
         setCardCustomBadges(prev => prev.map((b, i) => String(i) === draggingItem.id || b.id === draggingItem.id ? { ...b, x: b.x + deltaX, y: b.y + deltaY } : b));
      }
    };
    
    const handleGlobalMouseUp = () => {
      setDraggingItem(null);
    };

    if (draggingItem) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggingItem]);

  const handleUpdateElement = (type: string, id: string, data: any) => {
    if (data.action === "drag_start") {
      setDraggingItem({ type, id });
    } else if (data.action === "wheel") {
      const delta = data.deltaY > 0 ? -5 : 5;
      if (type === 'character') setCharScale(prev => Math.max(10, Math.min(300, prev + delta)));
      if (type === 'title') setTitlePos(prev => ({...prev, scale: Math.max(10, Math.min(300, prev.scale + delta))}));
      if (type === 'desc') setDescPos(prev => ({...prev, scale: Math.max(10, Math.min(300, prev.scale + delta))}));
      if (type === 'rarityBadge') setRarityBadgePos(prev => ({...prev, scale: Math.max(10, Math.min(300, prev.scale + delta))}));
      if (type === 'levelText') setLevelTextPos(prev => ({...prev, scale: Math.max(10, Math.min(300, prev.scale + delta))}));
      if (type === 'levelBadge') setLevelBadgePos(prev => ({...prev, scale: Math.max(10, Math.min(300, prev.scale + delta))}));
      if (type === 'customBadge') {
         setCardCustomBadges(prev => prev.map((b, i) => String(i) === id || b.id === id ? { ...b, size: Math.max(10, Math.min(200, b.size + delta)) } : b));
      }
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardPlayerId) {
      setCardError("Veuillez sélectionner un joueur.");
      return;
    }

    setCreatingCard(true);
    setCardError("");

    try {
      const player = players.find(p => p.id === cardPlayerId);
      const url = "/api/cards";
      const method = editingCardId ? "PUT" : "POST";
      
      const payload: any = {
        title: cardTitle || player?.minecraftName,
        playerName: player?.minecraftName,
        playerId: cardPlayerId,
        rarity: cardRarity,
        level: cardLevel,
        proba: cardProba,
        description: cardDesc,
        customBackground: cardCustomBg,
        imageUrl: cardImageUrl,
        customBadges: cardCustomBadges,
        characterPosition: { x: charPosX, y: charPosY, scale: charScale },
        attributes: {
          borderColor: cardBorderColor,
          cardBgColor,
          cardGlowColor,
          mainColor,
          rarityBadgeColor,
          frameUrl: cardFrameUrl,
          titlePos, descPos, rarityBadgePos, levelTextPos,
          levelBadgePos,
          levelBadgeUrl,
          isFullArt,
          effect: cardEffect,
          titleColor,
          descColor,
          levelColor,
          showTitle,
          showDesc,
          showRarityBadge,
          showLevelText,
          showLevelIcon
        }
      };

      if (editingCardId) {
        payload.id = editingCardId;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setCardPlayerId("");
        setCardRarity("COMMON");
        setCardLevel("Normal");
        setCardProba(100);
        setCardDesc("");
        setCardTitle("");
        setCardCustomBg("");
        setCardImageUrl("");
        setCardBorderColor(""); setCardBgColor(""); setCardGlowColor(""); setMainColor(""); setRarityBadgeColor("");
        setShowTitle(true); setShowDesc(true); setShowRarityBadge(true); setShowLevelText(true); setShowLevelIcon(true);
        setIsFullArt(false); setCardEffect(""); setTitleColor(""); setDescColor(""); setLevelColor("");
        setCardFrameUrl("");
        setCardCustomBadges([]);
        setCharPosX(50);
        setCharPosY(50);
        setCharScale(100);
        setTitlePos({ x: 50, y: 75, scale: 100 }); setDescPos({ x: 50, y: 92, scale: 100 }); setRarityBadgePos({ x: 15, y: 65, scale: 100 }); setLevelTextPos({ x: 50, y: 82, scale: 100 });
        setLevelBadgePos({ x: 10, y: 8, scale: 100 });
        setLevelBadgeUrl("");
        setEditingCardId(null);
        fetchCards();
      } else {
        const msg = await res.text();
        setCardError(msg);
      }
    } catch (err) {
      setCardError("Erreur de connexion");
    } finally {
      setCreatingCard(false);
    }
  };

  const startEditCard = (card: any) => {
    setEditingCardId(card.id);
    setCardPlayerId(card.playerId);
    setCardRarity(card.rarity);
    setCardLevel(card.level);
    setCardProba(card.proba ?? 100);
    setCardDesc(card.description || "");
    setCardTitle(card.title || "");
    setCardCustomBg(card.customBackground || "");
    setCardImageUrl(card.imageUrl || "");
    
    try {
      const attrs = typeof card.attributes === 'string' ? JSON.parse(card.attributes) : (card.attributes || {});
      setCardBorderColor(attrs.borderColor || "");
      setCardBgColor(attrs.cardBgColor || "");
      setCardGlowColor(attrs.cardGlowColor || "");
      setMainColor(attrs.mainColor || "");
      setRarityBadgeColor(attrs.rarityBadgeColor || "");
      setCardFrameUrl(attrs.frameUrl || "");
      
      setIsFullArt(attrs.isFullArt || false);
      setCardEffect(attrs.effect || "");
      setCardEffect(attrs.effect || "");
      setTitleColor(attrs.titleColor || "");
      setDescColor(attrs.descColor || "");
      setLevelColor(attrs.levelColor || "");
      setShowTitle(attrs.showTitle !== false);
      setShowDesc(attrs.showDesc !== false);
      setShowRarityBadge(attrs.showRarityBadge !== false);
      setShowLevelText(attrs.showLevelText !== false);
      setShowLevelIcon(attrs.showLevelIcon !== false);

      setTitlePos(attrs.titlePos || { x: 50, y: 75, scale: 100 }); setDescPos(attrs.descPos || { x: 50, y: 92, scale: 100 }); setRarityBadgePos(attrs.rarityBadgePos || { x: 15, y: 65, scale: 100 }); setLevelTextPos(attrs.levelTextPos || { x: 50, y: 82, scale: 100 });
      setLevelBadgePos(attrs.levelBadgePos || { x: 10, y: 8, scale: 100 });
      setLevelBadgeUrl(attrs.levelBadgeUrl || "");
    } catch {
      setCardBorderColor(""); setCardBgColor(""); setCardGlowColor(""); setMainColor(""); setRarityBadgeColor("");
      setShowTitle(true); setShowDesc(true); setShowRarityBadge(true); setShowLevelText(true); setShowLevelIcon(true);
      setIsFullArt(false); setCardEffect(""); setTitleColor(""); setDescColor(""); setLevelColor("");
      setCardFrameUrl("");
      setTitlePos({ x: 50, y: 75, scale: 100 }); setDescPos({ x: 50, y: 92, scale: 100 }); setRarityBadgePos({ x: 15, y: 65, scale: 100 }); setLevelTextPos({ x: 50, y: 82, scale: 100 });
      setLevelBadgePos({ x: 10, y: 8, scale: 100 });
      setLevelBadgeUrl("");
    }

    try {
      setCardCustomBadges(typeof card.customBadges === 'string' ? JSON.parse(card.customBadges) : (card.customBadges || []));
    } catch {
      setCardCustomBadges([]);
    }
    try {
      const pos = typeof card.characterPosition === 'string' ? JSON.parse(card.characterPosition) : card.characterPosition;
      setCharPosX(pos?.x ?? 50);
      setCharPosY(pos?.y ?? 50);
      setCharScale(pos?.scale ?? 100);
    } catch {
      setCharPosX(50); setCharPosY(50); setCharScale(100);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingCardId(null);
    setCardPlayerId("");
    setCardRarity("COMMON");
    setCardLevel("Normal");
    setCardProba(100);
    setCardDesc("");
    setCardTitle("");
    setCardCustomBg("");
    setCardImageUrl("");
    setCardBorderColor(""); setCardBgColor(""); setCardGlowColor(""); setMainColor(""); setRarityBadgeColor("");
    setShowTitle(true); setShowDesc(true); setShowRarityBadge(true); setShowLevelText(true); setShowLevelIcon(true);
    setCardFrameUrl("");
    setCardCustomBadges([]);
    setCharPosX(50);
    setCharPosY(50);
    setCharScale(100);
    setTitlePos({ x: 50, y: 75, scale: 100 }); setDescPos({ x: 50, y: 92, scale: 100 }); setRarityBadgePos({ x: 15, y: 65, scale: 100 }); setLevelTextPos({ x: 50, y: 82, scale: 100 });
    setLevelBadgePos({ x: 10, y: 8, scale: 100 });
    setLevelBadgeUrl("");
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBg(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setCardCustomBg(data.url);
      } else {
        alert("Erreur lors de l'upload");
      }
    } catch (err) {
      alert("Erreur de connexion");
    } finally {
      setUploadingBg(false);
    }
  };

  const handleSkinUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSkin(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setCardImageUrl(data.url);
      } else {
        alert("Erreur lors de l'upload du skin");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion");
    } finally {
      setUploadingSkin(false);
    }
  };

  const handleFrameUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFrame(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setCardFrameUrl(data.url);
      } else {
        alert("Erreur lors de l'upload du cadre");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion");
    } finally {
      setUploadingFrame(false);
    }
  };

  const handleLevelBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setLevelBadgeUrl(data.url);
      } else {
        alert("Erreur lors de l'upload du badge custom");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion");
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette carte ?")) return;
    try {
      const res = await fetch(`/api/cards?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCards();
      else alert("Erreur lors de la suppression.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveTemplate = async () => {
    const name = window.prompt("Nom du template ?");
    if (!name) return;
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        body: JSON.stringify({
          name,
          customBackground: cardCustomBg,
          customBadges: cardCustomBadges,
          characterPosition: { x: charPosX, y: charPosY, scale: charScale },
          level: cardLevel,
          attributes: {
            borderColor: cardBorderColor,
            cardBgColor,
            cardGlowColor,
            mainColor,
            rarityBadgeColor,
            frameUrl: cardFrameUrl,
            titlePos, descPos, rarityBadgePos, levelTextPos,
            levelBadgePos,
            levelBadgeUrl,
            isFullArt,
          effect: cardEffect,
            titleColor,
            descColor,
            levelColor,
            showTitle,
            showDesc,
            showRarityBadge,
            showLevelText,
            showLevelIcon
          }
        })
      });
      if (res.ok) {
        alert("Template sauvegardé !");
        fetchTemplates();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    if (!templateId) return;
    const t = templates.find(x => x.id === templateId);
    if (!t) return;
    setCardCustomBg(t.customBackground || "");
    if (t.level) setCardLevel(t.level);
    try { setCardCustomBadges(typeof t.customBadges === 'string' ? JSON.parse(t.customBadges) : t.customBadges || []); } catch {}
    try { 
      const pos = typeof t.characterPosition === 'string' ? JSON.parse(t.characterPosition) : t.characterPosition;
      setCharPosX(pos?.x ?? 50); setCharPosY(pos?.y ?? 50); setCharScale(pos?.scale ?? 100);
    } catch {}
    try {
      const attrs = typeof t.attributes === 'string' ? JSON.parse(t.attributes) : (t.attributes || {});
      setCardBorderColor(attrs.borderColor || "");
      setCardBgColor(attrs.cardBgColor || "");
      setCardGlowColor(attrs.cardGlowColor || "");
      setMainColor(attrs.mainColor || "");
      setRarityBadgeColor(attrs.rarityBadgeColor || "");
      setCardFrameUrl(attrs.frameUrl || "");
      setIsFullArt(attrs.isFullArt || false);
      setCardEffect(attrs.effect || "");
      setCardEffect(attrs.effect || "");
      setTitleColor(attrs.titleColor || "");
      setDescColor(attrs.descColor || "");
      setLevelColor(attrs.levelColor || "");
      setShowTitle(attrs.showTitle !== false);
      setShowDesc(attrs.showDesc !== false);
      setShowRarityBadge(attrs.showRarityBadge !== false);
      setShowLevelText(attrs.showLevelText !== false);
      setShowLevelIcon(attrs.showLevelIcon !== false);

      setTitlePos(attrs.titlePos || { x: 50, y: 75, scale: 100 }); 
      setDescPos(attrs.descPos || { x: 50, y: 92, scale: 100 }); 
      setRarityBadgePos(attrs.rarityBadgePos || { x: 15, y: 65, scale: 100 }); 
      setLevelTextPos(attrs.levelTextPos || { x: 50, y: 82, scale: 100 });
      setLevelBadgePos(attrs.levelBadgePos || { x: 10, y: 8, scale: 100 });
      setLevelBadgeUrl(attrs.levelBadgeUrl || "");
    } catch {}
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minecraftName: newPlayerName.trim() }),
      });

      if (res.ok) {
        setNewPlayerName("");
        fetchPlayers();
      } else {
        const msg = await res.text();
        setError(msg);
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce joueur de la base de données ?")) return;
    
    try {
      const res = await fetch(`/api/players?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPlayers();
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-4xl font-outfit font-black text-white inline-block mb-2">Espace Administration</h1>
        <p className="text-[var(--color-text-secondary)]">Gestion de la base de données du SMP.</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-[var(--color-border-color)] pb-4">
        <button 
          onClick={() => setActiveTab("players")}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'players' ? 'bg-[var(--color-accent-purple)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-white'}`}
        >
          <Users className="w-5 h-5" /> Base de Joueurs
        </button>
        <button 
          onClick={() => setActiveTab("cards")}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'cards' ? 'bg-[var(--color-accent-purple)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-white'}`}
        >
          <Sparkles className="w-5 h-5" /> Cartes
        </button>
        <button 
          onClick={() => setActiveTab("moderation")}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'moderation' ? 'bg-red-500 text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-white'}`}
        >
          <ShieldAlert className="w-5 h-5" /> Modération
        </button>
      </div>

      <div className="panel-matte p-8 rounded-2xl">
        {activeTab === "players" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-outfit text-white mb-6">Ajouter un Joueur</h2>
              <form onSubmit={handleAddPlayer} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Pseudo Minecraft (Exact)</label>
                  <input 
                    type="text" 
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]" 
                    placeholder="Ex: Xx_Slayer_xX" 
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary mt-4 flex items-center gap-2 w-full justify-center">
                  <Plus className="w-4 h-4" /> {loading ? "Ajout..." : "Ajouter au serveur"}
                </button>
              </form>
            </div>

            <div className="pt-8 border-t border-[var(--color-border-color)]">
              <h2 className="text-2xl font-bold font-outfit text-white mb-6">Joueurs Enregistrés ({players.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {players.map(player => (
                  <div key={player.id} className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <img src={`https://render.crafty.gg/3d/bust/${player.minecraftName}`} alt={player.minecraftName} className="w-10 h-10 object-contain" />
                      <span className="font-bold text-white">{player.minecraftName}</span>
                    </div>
                    <button onClick={() => handleDeletePlayer(player.id)} className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {players.length === 0 && (
                  <p className="text-[var(--color-text-secondary)] col-span-full">Aucun joueur dans la base de données. Ajoutez-en un pour peupler la Tier List et les Cartes.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "cards" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold font-outfit text-white mb-6 border-b border-[var(--color-border-color)] pb-2 flex justify-between items-center">
                <span>{editingCardId ? "Modifier la carte" : "Nouvelle Carte"}</span>
                {editingCardId && (
                  <button onClick={cancelEdit} className="text-sm font-normal text-red-400 hover:text-red-300">Annuler la modification</button>
                )}
              </h2>

              <div className="mb-6 bg-black/40 p-4 rounded-lg border border-[var(--color-border-color)] flex gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Appliquer un Template</label>
                  <select onChange={(e) => handleApplyTemplate(e.target.value)} className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]">
                    <option value="">-- Choisir un template --</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1 opacity-0">-</label>
                  <button type="button" onClick={handleSaveTemplate} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 font-bold">
                    Sauvegarder la config actuelle
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-12">
                <form onSubmit={handleCreateCard} className="space-y-4 flex-1 max-w-md">
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Pseudo affiché (Optionnel)</label>
                  <input 
                    type="text"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                    placeholder="Surcharge le nom Minecraft"
                    disabled={creatingCard}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Joueur Lié</label>
                  <select 
                    value={cardPlayerId}
                    onChange={(e) => setCardPlayerId(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                    disabled={creatingCard}
                  >
                    <option value="" className="bg-[var(--color-bg-elevated)] text-white">Sélectionner un joueur...</option>
                    {players.map(p => (
                      <option key={p.id} value={p.id} className="bg-[var(--color-bg-elevated)] text-white">{p.minecraftName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Rareté</label>
                  <select 
                    value={cardRarity}
                    onChange={(e) => setCardRarity(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                    disabled={creatingCard}
                  >
                    <option value="COMMON" className="bg-[var(--color-bg-elevated)] text-white">COMMON</option>
                    <option value="UNCOMMON" className="bg-[var(--color-bg-elevated)] text-white">UNCOMMON</option>
                    <option value="RARE" className="bg-[var(--color-bg-elevated)] text-white">RARE</option>
                    <option value="EPIC" className="bg-[var(--color-bg-elevated)] text-white">EPIC</option>
                    <option value="LEGENDARY" className="bg-[var(--color-bg-elevated)] text-white">LEGENDARY</option>
                    <option value="MYTHIC" className="bg-[var(--color-bg-elevated)] text-red-400 font-bold">MYTHIC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Niveau</label>
                  <select 
                    value={cardLevel}
                    onChange={(e) => setCardLevel(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                    disabled={creatingCard}
                  >
                    <option value="Normal" className="bg-[var(--color-bg-elevated)] text-white">Normal</option>
                    <option value="Iron" className="bg-[var(--color-bg-elevated)] text-white">Iron</option>
                    <option value="Gold" className="bg-[var(--color-bg-elevated)] text-white">Gold</option>
                    <option value="Diamond" className="bg-[var(--color-bg-elevated)] text-white">Diamond</option>
                    <option value="Netherite" className="bg-[var(--color-bg-elevated)] text-white">Netherite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Fond Custom (Image)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={cardCustomBg}
                      onChange={(e) => setCardCustomBg(e.target.value)}
                      className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                      placeholder="URL ou Upload ->"
                      disabled={creatingCard || uploadingBg}
                    />
                    <label className="bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-color)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 cursor-pointer flex items-center justify-center transition-colors">
                      {uploadingBg ? "..." : "Upload"}
                      <input type="file" accept="image/png, image/jpeg, image/gif, video/mp4, video/webm" className="hidden" onChange={handleBgUpload} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Skin Custom (Image du perso)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={cardImageUrl}
                      onChange={(e) => setCardImageUrl(e.target.value)}
                      className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                      placeholder="URL de l'image ou laisser vide"
                      disabled={creatingCard}
                    />
                    <label className="bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-color)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 cursor-pointer flex items-center justify-center transition-colors">
                      {uploadingSkin ? "..." : "Upload"}
                      <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={handleSkinUpload} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Cadre Custom (Overlay Image)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={cardFrameUrl}
                      onChange={(e) => setCardFrameUrl(e.target.value)}
                      className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                      placeholder="URL de l'image transparente"
                      disabled={creatingCard}
                    />
                    <label className="bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-color)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 cursor-pointer flex items-center justify-center transition-colors">
                      {uploadingFrame ? "..." : "Upload"}
                      <input type="file" accept="image/png, image/gif" className="hidden" onChange={handleFrameUpload} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Couleur du Fond Custom (Code Hex)</label>
                  <input 
                    type="text"
                    value={cardBgColor}
                    onChange={(e) => setCardBgColor(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)] mb-4"
                    placeholder="Ex: #1a1a2e, rgba(0,0,0,0.8)"
                    disabled={creatingCard}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Couleur de la Lueur/Glow (Code Hex)</label>
                  <input 
                    type="text"
                    value={cardGlowColor}
                    onChange={(e) => setCardGlowColor(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)] mb-4"
                    placeholder="Ex: #ff00ff, gold"
                    disabled={creatingCard}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Couleur du Cadre Custom (Code Hex)</label>
                  <input 
                    type="text"
                    value={cardBorderColor}
                    onChange={(e) => setCardBorderColor(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                    placeholder="Ex: #ff0000, rgba(255,0,0,0.5)"
                    disabled={creatingCard}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Badge de Niveau Custom (Image)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={levelBadgeUrl}
                      onChange={(e) => setLevelBadgeUrl(e.target.value)}
                      className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                      placeholder="URL ou laisser vide pour défaut"
                      disabled={creatingCard}
                    />
                    <label className="bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-color)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 cursor-pointer flex items-center justify-center transition-colors">
                      Upload
                      <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={handleLevelBadgeUpload} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Probabilité d'obtention (%)</label>
                  <input 
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={cardProba}
                    onChange={(e) => setCardProba(Number(e.target.value))}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                    disabled={creatingCard}
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Description</label>
                  <input 
                    type="text"
                    value={cardDesc}
                    onChange={(e) => setCardDesc(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                    disabled={creatingCard}
                  />
                </div>
                
                <div className="pt-4 border-t border-[var(--color-border-color)]">
                  <h4 className="text-sm font-bold text-white mb-4">Mode Full Art & Visibilité</h4>
                  
                  <label className="flex items-center gap-2 mb-4 cursor-pointer text-sm text-[var(--color-accent-purple)] font-bold">
                    <input type="checkbox" checked={isFullArt} onChange={(e) => {
                      const checked = e.target.checked;
                      setIsFullArt(checked);
                      if (checked) {
                        setTitlePos({ x: 15, y: 8, scale: 100 });
                        setRarityBadgePos({ x: 50, y: 8, scale: 100 });
                        setLevelTextPos({ x: 85, y: 8, scale: 100 });
                      } else {
                        setTitlePos({ x: 50, y: 75, scale: 100 });
                        setRarityBadgePos({ x: 15, y: 65, scale: 100 });
                        setLevelTextPos({ x: 50, y: 82, scale: 100 });
                      }
                    }} className="rounded border-gray-600 bg-gray-700" />
                    Activer le Mode "Full Art" (Layout Personnalisé)
                  </label>

                  
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Effet Spécial (Holo/Shiny)</label>
                    <select
                      value={cardEffect}
                      onChange={(e) => setCardEffect(e.target.value)}
                      className="w-full bg-[#111118] border border-[var(--color-border-color)] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[var(--color-accent-purple)]"
                    >
                      <option value="">Aucun effet</option>
                      <option value="holo">Holographique</option>
                      <option value="shiny">Shiny (Foil)</option>
                      <option value="glitch">Glitch</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <input type="checkbox" checked={showTitle} onChange={(e) => setShowTitle(e.target.checked)} className="rounded" /> Afficher Pseudo
                    </label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-xs text-gray-400">Couleur Pseudo</span>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <input type="checkbox" checked={showDesc} onChange={(e) => setShowDesc(e.target.checked)} className="rounded" /> Afficher Description
                    </label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={descColor} onChange={(e) => setDescColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-xs text-gray-400">Couleur Description</span>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <input type="checkbox" checked={showRarityBadge} onChange={(e) => setShowRarityBadge(e.target.checked)} className="rounded" /> Afficher Rareté
                    </label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={rarityBadgeColor} onChange={(e) => setRarityBadgeColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-xs text-gray-400">Couleur Rareté</span>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <input type="checkbox" checked={showLevelText} onChange={(e) => setShowLevelText(e.target.checked)} className="rounded" /> Afficher Niveau (Texte)
                    </label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={levelColor} onChange={(e) => setLevelColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-xs text-gray-400">Couleur Niveau</span>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] col-span-2">
                      <input type="checkbox" checked={showLevelIcon} onChange={(e) => setShowLevelIcon(e.target.checked)} className="rounded" /> Afficher Icône de Niveau (Top Left)
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border-color)]">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-bold text-white">Badges Flottants</label>
                    <button type="button" onClick={() => setCardCustomBadges([...cardCustomBadges, { id: Math.random().toString(36).substr(2, 9), url: '', x: 50, y: 50, size: 64 }])} className="text-xs bg-[var(--color-accent-purple)] text-white px-3 py-1 rounded hover:bg-purple-500">
                      + Ajouter
                    </button>
                  </div>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {cardCustomBadges.map((badge, idx) => (
                      <div key={badge.id} className="bg-black/30 p-4 rounded border border-[var(--color-border-color)]">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-gray-400">Badge #{idx + 1}</span>
                          <button type="button" onClick={() => setCardCustomBadges(cardCustomBadges.filter(b => b.id !== badge.id))} className="text-red-400 text-xs hover:text-red-300">Supprimer</button>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <input type="text" placeholder="URL de l'image" value={badge.url} onChange={(e) => { const newB = [...cardCustomBadges]; newB[idx].url = e.target.value; setCardCustomBadges(newB); }} className="flex-1 w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded px-2 py-1 text-white text-sm" />
                          <label className="btn-secondary text-xs cursor-pointer px-2 py-1 flex items-center shrink-0">
                            Upload
                            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                              const file = e.target.files?.[0]; if(!file) return;
                              const fd = new FormData(); fd.append("file", file);
                              try { const res = await fetch("/api/upload", {method: "POST", body: fd}); if(res.ok) { const data = await res.json(); const newB = [...cardCustomBadges]; newB[idx].url = data.url; setCardCustomBadges(newB); } } catch(err){}
                            }} />
                          </label>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg border border-white/5 mt-2">
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            Déplacez et redimensionnez ce badge (molette souris) directement sur la carte !
                          </p>
                        </div>
                      </div>
                    ))}
                    {cardCustomBadges.length === 0 && <p className="text-xs text-[var(--color-text-muted)] italic">Aucun badge ajouté. Cliquez sur Ajouter pour insérer un badge flottant.</p>}
                  </div>
                </div>

                {cardError && <p className="text-red-400 text-sm">{cardError}</p>}
                <div className="flex gap-2 mt-4">
                  <button type="submit" disabled={creatingCard} className="btn-primary flex-1 flex items-center gap-2 justify-center">
                    <Sparkles className="w-4 h-4" /> {creatingCard ? "Chargement..." : (editingCardId ? "Sauvegarder" : "Créer la Carte")}
                  </button>
                  {editingCardId && (
                    <button type="button" onClick={cancelEdit} className="btn-secondary px-4">
                      Annuler
                    </button>
                  )}
                </div>
              </form>

              <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-bg-primary)] p-4 rounded-xl border border-dashed border-[var(--color-border-color)]">
                <div id="live-preview-card" className="w-full max-w-[350px]">
                <CardDisplay 
                  isEditing={true}
                  onUpdateElement={handleUpdateElement}
                  card={{
                    id: "preview",
                    title: cardTitle || players.find(p => p.id === cardPlayerId)?.minecraftName || "Joueur Inconnu",
                    rarity: cardRarity,
                    level: cardLevel,
                    description: cardDesc || "Description de la carte...",
                    customBackground: cardCustomBg,
                    imageUrl: cardImageUrl,
                    customBadges: cardCustomBadges,
                    characterPosition: { x: charPosX, y: charPosY, scale: charScale },
                    attributes: JSON.stringify({ 
                      borderColor: cardBorderColor,
                      cardBgColor,
                      cardGlowColor, 
                      mainColor,
                      rarityBadgeColor,
                      frameUrl: cardFrameUrl,
                      titlePos, descPos, rarityBadgePos, levelTextPos,
                      levelBadgePos,
                      levelBadgeUrl,
                      isFullArt,
          effect: cardEffect,
                      titleColor,
                      descColor,
                      levelColor,
                      showTitle,
                      showDesc,
                      showRarityBadge,
                      showLevelText,
                      showLevelIcon
                    }),
                    player: {
                      minecraftName: players.find(p => p.id === cardPlayerId)?.minecraftName || ""
                    }
                  }} 
                  size="lg" 
                />
              </div>
            </div>
            </div>

            <div className="pt-8 border-t border-[var(--color-border-color)]">
              <h2 className="text-2xl font-bold font-outfit text-white mb-6">Cartes Créées ({cards.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cards.map(card => (
                  <div key={card.id} className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                      <img src={`https://render.crafty.gg/3d/bust/${card.title}`} alt={card.title} className="w-10 h-10 object-contain" />
                      <div>
                        <span className="font-bold text-white block">{card.title}</span>
                        <span className="text-xs text-[var(--color-text-secondary)] block">{card.rarity} • {card.level}</span>
                      </div>
                    </div>
                    {card.description && (
                      <p className="text-sm text-[var(--color-text-muted)] italic">"{card.description}"</p>
                    )}
                    <div className="mt-2 flex justify-between items-center text-xs text-[var(--color-text-secondary)]">
                      <span>{card.proba}% de chance</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => startEditCard(card)}
                          className="text-indigo-400 hover:text-indigo-300 underline"
                        >
                          Éditer
                        </button>
                        <button 
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-red-400 hover:text-red-300 underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {cards.length === 0 && (
                  <p className="text-[var(--color-text-secondary)] col-span-full">Aucune carte n'a été créée pour le moment.</p>
                )}
              </div>
            </div>
            </div>
          </div>
        )}

        {activeTab === "moderation" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-outfit text-white mb-6">Gestion des Utilisateurs</h2>
            <p className="text-[var(--color-text-secondary)] mb-4">Gérez les rôles des utilisateurs connectés (MEMBER, MODERATOR, ADMIN).</p>
            
            {loadingUsers ? (
              <div className="text-white text-center py-8">Chargement des utilisateurs...</div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[var(--color-border-color)]">
                <table className="w-full text-left text-white border-collapse">
                  <thead className="bg-[var(--color-bg-elevated)] border-b border-[var(--color-border-color)]">
                    <tr>
                      <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Utilisateur</th>
                      <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Date d'inscription</th>
                      <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Rôle actuel</th>
                      <th className="p-4 font-semibold text-[var(--color-text-secondary)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appUsers.map((user) => (
                      <tr key={user.id} className="border-b border-[var(--color-border-color)] hover:bg-[var(--color-bg-elevated)]/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img src={user.image} alt={user.name || "User"} className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">?</div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name || "Inconnu"}</span>
                              {user.minecraftName && <span className="text-xs text-[var(--color-text-secondary)]">IG: {user.minecraftName}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[var(--color-text-secondary)] text-sm">
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                            user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                            user.role === 'MODERATOR' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <select 
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded px-3 py-1 text-sm outline-none focus:border-[var(--color-accent-purple)]"
                          >
                            <option value="MEMBER">MEMBER</option>
                            <option value="MODERATOR">MODERATOR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {appUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-[var(--color-text-secondary)]">Aucun utilisateur trouvé.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
