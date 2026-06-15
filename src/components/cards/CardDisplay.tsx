"use client";

import { useState, useRef } from "react";

export const getRarityGlow = (rarity: string) => {
  switch(rarity) {
    case "LEGENDARY": return "animate-pulse-glow-legendary";
    case "MYTHIC": return "animate-pulse-glow-mythic";
    case "EPIC": return "animate-pulse-glow-epic";
    case "RARE": return "shadow-[0_0_20px_rgba(59,130,246,0.6)] border-blue-500/50";
    case "UNCOMMON": return "shadow-[0_0_15px_rgba(255,255,255,0.2)] border-white/20";
    default: return "shadow-md border-gray-700/50";
  }
};

export const getLevelStyle = (level: string): React.CSSProperties => {
  switch(level) {
    case "Iron":
      return { backgroundImage: "linear-gradient(135deg, #6b7280 0%, #374151 40%, #9ca3af 50%, #1f2937 60%, #111827 100%)" };
    case "Gold":
      return { backgroundImage: "linear-gradient(135deg, #facc15 0%, #a16207 40%, #fef08a 50%, #854d0e 60%, #422006 100%)" };
    case "Diamond":
      return { backgroundImage: "conic-gradient(from 120deg at 50% 50%, #0891b2, #06b6d4, #67e8f9, #0891b2, #164e63, #0891b2)" };
    case "Netherite":
      return { 
        backgroundColor: "#0a0510",
        backgroundImage: "radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.5) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(88, 28, 135, 0.8) 0%, transparent 60%), url('https://www.transparenttextures.com/patterns/dark-matter.png')",
        backgroundBlendMode: "screen, screen, overlay"
      };
    default:
      return { backgroundColor: "var(--color-bg-card)" };
  }
};

export const getLevelBorder = (level: string) => {
  return "";
};

export const getLevelIcon = (level: string) => {
  switch(level) {
    case "Iron": return "/Iron.png"
    case "Netherite": return "/netherite.png";
    case "Diamond": return "/Diamond.png";
    case "Gold": return "/OR.png";
    default: return null;
  }
};

export const getRarityBadge = (rarity: string) => {
  switch(rarity) {
    case 'COMMON': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    case 'UNCOMMON': return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'RARE': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'EPIC': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'LEGENDARY': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'MYTHIC': return 'bg-red-500/20 text-red-500 border-red-500/50 font-black shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
}

export const InteractiveCard = ({ card, children, className = "", style: customStyle = {} }: { card: any, children: React.ReactNode, className?: string, style?: React.CSSProperties }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (card?.isEditing) return; // Disable 3D rotation in editing mode
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setRotation({ x: rotateX, y: rotateY });
    setGlarePosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  const style: React.CSSProperties = {
    transform: isHovered 
      ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)` 
      : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
    transformStyle: "preserve-3d",
  };

  const isRare = card.rarity === "RARE" || card.rarity === "EPIC" || card.rarity === "LEGENDARY" || card.rarity === "MYTHIC";
  const isEpicOrLegendary = card.rarity === "EPIC" || card.rarity === "LEGENDARY" || card.rarity === "MYTHIC";
  const isLegendary = card.rarity === "LEGENDARY" || card.rarity === "MYTHIC";

  const hasVideoBg = card?.customBackground && (card.customBackground.endsWith('.mp4') || card.customBackground.endsWith('.webm'));
  const attrs = typeof card?.attributes === 'string' ? JSON.parse(card.attributes) : (card?.attributes || {});

  const combinedStyle = { 
    ...style, 
    ...customStyle,
    ...((attrs.cardGlowColor || attrs.mainColor) ? { '--custom-glow-color': attrs.cardGlowColor || attrs.mainColor } as React.CSSProperties : {}),
    ...((attrs.cardBgColor || attrs.mainColor) 
      ? { backgroundColor: attrs.cardBgColor || attrs.mainColor, backgroundImage: 'none' } 
      : (!hasVideoBg && card?.customBackground 
          ? { backgroundImage: `url('${card.customBackground}')`, backgroundSize: 'cover', backgroundPosition: 'center' } 
          : (!hasVideoBg && card ? getLevelStyle(card.level) : { backgroundColor: "transparent" })))
  };

  return (
    <div 
      ref={cardRef}
      className={`relative rounded-xl cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={combinedStyle}
    >
      {hasVideoBg && (
        <video 
          src={card.customBackground} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover rounded-xl pointer-events-none z-0"
        />
      )}
      {/* Base Level Texture Overlay (gives depth to the gradient) */}
      <div className="absolute inset-0 z-0 mix-blend-multiply opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none rounded-xl" />

      <div className="relative z-10 w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
      
      {/* Glare Effect */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay rounded-xl overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
          }}
        />
      )}
      
      {/* Elegant Light Sweep / Glare */}
      {isHovered && !card.isEditing && (
        <div 
          className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-xl mix-blend-overlay"
          style={{
            opacity: 0.6,
            backgroundImage: `radial-gradient(farthest-corner at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 40%, transparent 100%)`
          }}
        />
      )}
    </div>
  );
};

export default function CardDisplay({ 
  card, 
  size = "md",
  isEditing = false,
  onUpdateElement
}: { 
  card: any, 
  size?: "sm" | "md" | "lg",
  isEditing?: boolean,
  onUpdateElement?: (type: string, id: string, data: any) => void
}) {
  // Define sizing classes based on 'size' prop
  const wrapperClass = size === "lg" ? "w-64" : size === "md" ? "w-full max-w-[16rem]" : "w-48";
  
  // Icon sizes - Shrinking non-netherite to be more reasonable
  const iconClass = size === "lg" 
    ? "absolute -top-8 -left-8 w-28 h-28 drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]" 
    : size === "md" 
    ? "absolute -top-5 -left-5 w-16 h-16 drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]" 
    : "absolute -top-4 -left-4 w-12 h-12 drop-shadow-[0_0_10px_rgba(0,0,0,0.6)]";
    
  // Netherite image has intrinsic padding, so it needs to be scaled up heavily to match visual size of others
  const badgeScale = card.level === 'Netherite' ? 'scale-150 -translate-y-2 -translate-x-2' : 'scale-100';
  
  const translateZ = size === "lg" ? "30px" : "20px";

  const levelColorClass = card.level === 'Netherite' ? 'text-[#a278b5]' : 
                          card.level === 'Diamond' ? 'text-[#2de2e6]' : 
                          card.level === 'Gold' ? 'text-[#facc15]' : 
                          card.level === 'Iron' ? 'text-gray-300' : 'text-gray-500';

  // Parse Custom Badges
  let customBadges: any[] = [];
  try {
    customBadges = typeof card.customBadges === 'string' ? JSON.parse(card.customBadges) : (card.customBadges || []);
  } catch (e) {
    customBadges = [];
  }

  // Parse Character Position
  let charPos = { x: 50, y: 50, scale: 100 };
  try {
    charPos = typeof card.characterPosition === 'string' ? JSON.parse(card.characterPosition) : (card.characterPosition || charPos);
  } catch (e) {}

  let attrs: any = {};
  try {
    attrs = typeof card.attributes === 'string' ? JSON.parse(card.attributes) : (card.attributes || {});
  } catch (e) {}

  const isPremiumLayout = attrs.isFullArt || card.level === "Netherite" || card.level === "Diamond" || card.rarity === "LEGENDARY" || card.rarity === "MYTHIC";

  // Full Art no longer overrides default positions rigidly, positions are managed by Admin state
  const titlePos = attrs.titlePos || { x: 50, y: 75, scale: 100 };
  const descPos = attrs.descPos || { x: 50, y: 92, scale: 100 };
  const rarityBadgePos = attrs.rarityBadgePos || { x: 15, y: 65, scale: 100 };
  const levelTextPos = attrs.levelTextPos || { x: 50, y: 82, scale: 100 };
  const textPos = attrs.textPos; // Fallback for old cards
  const levelBadgePos = attrs.levelBadgePos || { x: 10, y: 8, scale: 100 };

  const handleMouseDown = (e: React.MouseEvent, type: string, id: string = "") => {
    if (!isEditing || !onUpdateElement) return;
    e.stopPropagation();
    e.preventDefault();
    onUpdateElement(type, id, { action: "drag_start", clientX: e.clientX, clientY: e.clientY });
  };

  const handleWheel = (e: React.WheelEvent, type: string, id: string = "") => {
    if (!isEditing || !onUpdateElement) return;
    e.stopPropagation();
    e.preventDefault();
    onUpdateElement(type, id, { action: "wheel", deltaY: e.deltaY });
  };

  const combinedStyle = {
    ...((attrs.cardGlowColor || attrs.mainColor) ? { '--custom-glow-color': attrs.cardGlowColor || attrs.mainColor } as React.CSSProperties : {}),
    ...(attrs.borderColor ? { borderColor: attrs.borderColor } : {}),
    borderWidth: attrs.isFullArt ? '6px' : '2px', // Fun border logic
  };

  return (
    <div className={`relative ${wrapperClass} aspect-[2.5/3.5] mx-auto ${isEditing ? '' : 'perspective-1000'}`}>
      <InteractiveCard 
        card={{...card, isEditing}} 
        className={`${wrapperClass} aspect-[2.5/3.5] border-2 ${getLevelBorder(card.level)} ${(attrs.cardGlowColor || attrs.mainColor) ? 'animate-pulse-glow-custom' : getRarityGlow(card.rarity)}`}
        style={combinedStyle}
      >
        
        {/* Custom Badges (Rendered inside the 3D space to float) */}
        {customBadges.map((badge: any, idx: number) => badge.url && (
          <img 
            key={badge.id || idx}
            src={badge.url}
            alt="Custom Badge"
            className={`absolute drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] z-40 ${isEditing ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
            onMouseDown={(e) => handleMouseDown(e, 'customBadge', badge.id || String(idx))}
            onWheel={(e) => handleWheel(e, 'customBadge', badge.id || String(idx))}
            style={{
              left: `${badge.x}%`,
              top: `${badge.y}%`,
              width: `${badge.size}px`,
              transform: `translate(-50%, -50%) translateZ(${parseInt(translateZ) * 1.5}px)`
            }}
          />
        ))}

        {/* Level Badge Top Left (Inside the 3D effect) */}
        {attrs.showLevelIcon !== false && (attrs.levelBadgeUrl || getLevelIcon(card.level)) && (
          <img 
            src={attrs.levelBadgeUrl || getLevelIcon(card.level)!} 
            alt={card.level} 
            className={`absolute ${size === "lg" ? "w-28 h-28" : size === "md" ? "w-16 h-16" : "w-12 h-12"} object-contain z-40 ${isEditing ? 'cursor-grab active:cursor-grabbing animate-none hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'pointer-events-none animate-bounce-slow drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]'}`} 
            onMouseDown={(e) => handleMouseDown(e, 'levelBadge')}
            onWheel={(e) => handleWheel(e, 'levelBadge')}
            style={{ 
              left: `${levelBadgePos.x}%`,
              top: `${levelBadgePos.y}%`,
              transform: `translate(-50%, -50%) scale(${levelBadgePos.scale / 100}) translateZ(${translateZ})` 
            }}
          />
        )}

      {isPremiumLayout ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl" style={{ transform: 'translateZ(20px)' }}>
          <div className="w-full h-full relative">
            {card.imageUrl || card.player?.minecraftName || card.title ? (
              <img 
                src={card.imageUrl || `https://render.crafty.gg/3d/bust/${card.player?.minecraftName || card.title}`} 
                alt={card.title} 
                className={`absolute drop-shadow-2xl ${isEditing ? 'pointer-events-auto cursor-grab active:cursor-grabbing hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''}`} 
                onMouseDown={(e) => handleMouseDown(e, 'character')}
                onWheel={(e) => handleWheel(e, 'character')}
                style={{
                   left: `${charPos.x}%`,
                   top: `${charPos.y}%`,
                   transform: `translate(-50%, -50%) scale(${charPos.scale / 100})`,
                   transformOrigin: 'center center'
                }}
              />
            ) : (
              <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-20 h-20 bg-gray-700/50 rounded-full border border-white/10"></div>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute top-4 left-4 right-4 bottom-[42%] rounded-t-lg border border-white/20 overflow-hidden pointer-events-none bg-black/10 backdrop-blur-[2px]" style={{ transform: 'translateZ(20px)' }}>
          <div className="w-full h-full flex items-end justify-center pt-4">
            {card.imageUrl || card.player?.minecraftName || card.title ? (
              <img 
                src={card.imageUrl || `https://render.crafty.gg/3d/bust/${card.player?.minecraftName || card.title}`} 
                alt={card.title} 
                className={`h-full object-contain drop-shadow-2xl ${isEditing ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : ''}`}
                onMouseDown={(e) => handleMouseDown(e, 'character')}
                onWheel={(e) => handleWheel(e, 'character')}
              />
            ) : (
              <div className="w-20 h-20 bg-gray-700/50 rounded-full mb-4 border border-white/10"></div>
            )}
          </div>
        </div>
      )}

      {/* Background Gradient Fallback (only if not manually positioned) */}
      {!attrs.titlePos && !attrs.textPos && !attrs.isFullArt && (
        <div className="absolute inset-x-0 bottom-0 min-h-[45%] bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 rounded-b-xl pointer-events-none" />
      )}

      {/* Rarity Badge */}
      {attrs.showRarityBadge !== false && (
        <div 
          className={`absolute z-30 inline-block px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${getRarityBadge(card.rarity)} ${isEditing ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
          onMouseDown={(e) => handleMouseDown(e, 'rarityBadge')}
          onWheel={(e) => handleWheel(e, 'rarityBadge')}
          style={{
            transform: `translate(-50%, -50%) scale(${(attrs.textPos ? textPos.scale : rarityBadgePos.scale) / 100}) translateZ(30px)`,
            left: `${attrs.textPos ? textPos.x - 35 : rarityBadgePos.x}%`,
            top: `${attrs.textPos ? textPos.y - 25 : rarityBadgePos.y}%`,
            whiteSpace: 'nowrap',
            ...((attrs.rarityBadgeColor || attrs.mainColor) ? { backgroundColor: `${attrs.rarityBadgeColor || attrs.mainColor}33`, borderColor: attrs.rarityBadgeColor || attrs.mainColor, color: attrs.rarityBadgeColor || attrs.mainColor } : {})
          }}
        >
          {card.rarity}
        </div>
      )}

      {/* Title */}
      {attrs.showTitle !== false && (
        <h3 
          className={`absolute z-30 font-outfit font-black text-lg text-white leading-tight uppercase text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${isEditing ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
          onMouseDown={(e) => handleMouseDown(e, 'title')}
          onWheel={(e) => handleWheel(e, 'title')}
          style={{
            transform: `translate(-50%, -50%) scale(${(attrs.textPos ? textPos.scale : titlePos.scale) / 100}) translateZ(30px)`,
            left: `${attrs.textPos ? textPos.x : titlePos.x}%`,
            top: `${attrs.textPos ? textPos.y - 12 : titlePos.y}%`,
            width: '90%',
            color: attrs.titleColor || undefined
          }}
        >
          {card.title}
        </h3>
      )}

      {/* Level Text */}
      {attrs.showLevelText !== false && (
        <span 
          className={`absolute z-30 text-xs font-bold text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${levelColorClass} ${isEditing ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
          onMouseDown={(e) => handleMouseDown(e, 'levelText')}
          onWheel={(e) => handleWheel(e, 'levelText')}
          style={{
            transform: `translate(-50%, -50%) scale(${(attrs.textPos ? textPos.scale : levelTextPos.scale) / 100}) translateZ(30px)`,
            left: `${attrs.textPos ? textPos.x : levelTextPos.x}%`,
            top: `${attrs.textPos ? textPos.y - 5 : levelTextPos.y}%`,
            width: '90%',
            color: attrs.levelColor || attrs.mainColor || undefined
          }}
        >
          {card.level}
        </span>
      )}

      {/* Description */}
      {attrs.showDesc !== false && (
        <div 
          className={`absolute z-30 flex justify-center items-center pt-2 ${!attrs.titlePos && !attrs.textPos ? 'border-t border-white/10' : ''} ${isEditing ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
          onMouseDown={(e) => handleMouseDown(e, 'desc')}
          onWheel={(e) => handleWheel(e, 'desc')}
          style={{
            transform: `translate(-50%, -50%) scale(${(attrs.textPos ? textPos.scale : descPos.scale) / 100}) translateZ(30px)`,
            left: `${attrs.textPos ? textPos.x : descPos.x}%`,
            top: `${attrs.textPos ? textPos.y + 10 : descPos.y}%`,
            width: '90%'
          }}
        >
          <span className="text-xs font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center" style={{ color: attrs.descColor || 'white' }}>
            {card.description || "Collection"}
          </span>
        </div>
      )}
      {/* Custom Frame Overlay (behind characters and text) */}
      {attrs.frameUrl && (
        <img src={attrs.frameUrl} alt="Card Frame" className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-xl" style={{ transform: 'translateZ(10px)' }} />
      )}

      {/* Special Effects Overlay */}
      {attrs.effect && attrs.effect !== "none" && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-xl z-50 overflow-hidden"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className={`absolute inset-0 w-full h-full ${attrs.effect === 'holo' ? 'effect-holo' : attrs.effect === 'shiny' ? 'effect-shiny' : attrs.effect === 'glitch' ? 'effect-glitch' : attrs.effect === 'paillettes' ? 'effect-paillettes' : ''}`} />
        </div>
      )}

    </InteractiveCard>
    </div>
  );
}
