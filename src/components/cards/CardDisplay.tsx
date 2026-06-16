"use client";

import { useState, useRef } from "react";

export const getRarityGlow = (rarity: string) => {
  const r = rarity.toUpperCase();
  if (r === "MYTHIC" || r === "MYTHIQUE") return "animate-pulse-glow-mythic";
  if (r === "LEGENDARY" || r === "LÉGENDAIRE" || r === "LEGENDAIRE") return "animate-pulse-glow-legendary";
  if (r === "EPIC" || r === "ÉPIQUE" || r === "EPIQUE") return "animate-pulse-glow-epic";
  if (r === "RARE") return "animate-pulse-glow-rare";
  if (r === "UNCOMMON" || r === "PEU COMMUNE") return "animate-pulse-glow-uncommon";
  return "animate-pulse-glow-common";
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
  const r = rarity.toUpperCase();
  if (r === "MYTHIC" || r === "MYTHIQUE") return 'bg-red-500/20 text-red-500 border-red-500/50 font-black shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  if (r === "LEGENDARY" || r === "LÉGENDAIRE" || r === "LEGENDAIRE") return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
  if (r === "EPIC" || r === "ÉPIQUE" || r === "EPIQUE") return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
  if (r === "RARE") return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  if (r === "UNCOMMON" || r === "PEU COMMUNE") return 'bg-green-500/20 text-green-400 border-green-500/50';
  return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
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

  const isRare = ["RARE", "EPIC", "ÉPIQUE", "EPIQUE", "LEGENDARY", "LÉGENDAIRE", "LEGENDAIRE", "MYTHIC", "MYTHIQUE"].includes(card.rarity.toUpperCase());
  const isEpicOrLegendary = ["EPIC", "ÉPIQUE", "EPIQUE", "LEGENDARY", "LÉGENDAIRE", "LEGENDAIRE", "MYTHIC", "MYTHIQUE"].includes(card.rarity.toUpperCase());
  const isLegendary = ["LEGENDARY", "LÉGENDAIRE", "LEGENDAIRE", "MYTHIC", "MYTHIQUE"].includes(card.rarity.toUpperCase());

  const hasVideoBg = card?.customBackground && (card.customBackground.includes('.mp4') || card.customBackground.includes('.webm'));
  const attrs = typeof card?.attributes === 'string' ? JSON.parse(card.attributes) : (card?.attributes || {});

  const combinedStyle = { 
    ...style, 
    ...customStyle,
    ...((attrs.cardGlowColor || attrs.mainColor) ? { '--custom-glow-color': attrs.cardGlowColor || attrs.mainColor } as React.CSSProperties : {}),
    ...((attrs.cardBgColor || attrs.mainColor) 
      ? { backgroundColor: attrs.cardBgColor || attrs.mainColor, backgroundImage: 'none' } 
      : (!hasVideoBg && card?.customBackground 
          ? { 
              backgroundImage: `url('${card.customBackground}')`, 
              backgroundSize: attrs.bgScale ? `${attrs.bgScale}%` : 'cover', 
              backgroundPosition: `${attrs.bgPosX ?? 50}% ${attrs.bgPosY ?? 50}%` 
            } 
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
        <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
          <video 
            src={card.customBackground} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover pointer-events-none"
            style={{
              objectPosition: `${attrs.bgPosX ?? 50}% ${attrs.bgPosY ?? 50}%`,
              transform: `scale(${(attrs.bgScale ?? 100) / 100})`,
              transformOrigin: `${attrs.bgPosX ?? 50}% ${attrs.bgPosY ?? 50}%`
            }}
          />
        </div>
      )}
      {/* Base Level Texture Overlay (gives depth to the gradient) */}
      <div className="absolute inset-0 z-0 mix-blend-multiply opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none rounded-xl" />

      <div className="relative z-10 w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
      
      {/* Holographic Foil Effect (Shattered Glass / Rainbow) */}
      {attrs.isHolo && (
        <div 
          className="absolute inset-0 pointer-events-none z-[15] rounded-xl overflow-hidden mix-blend-color-dodge opacity-60"
          style={{
            backgroundImage: `linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.7) 30%, rgba(255, 0, 200, 0.5) 40%, rgba(0, 200, 255, 0.5) 50%, rgba(255, 255, 255, 0.7) 60%, transparent 80%), url('https://grainy-gradients.vercel.app/noise.svg')`,
            backgroundSize: '200% 200%, 150px 150px',
            backgroundPosition: `${glarePosition.x * 2}% ${glarePosition.y * 2}%`,
            opacity: isHovered ? 0.9 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
      
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
  const wrapperClass = size === "lg" ? "w-80" : size === "md" ? "w-full max-w-[18rem]" : "w-56";
  
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

  const isPremiumLayout = attrs.isFullArt || ["LEGENDARY", "LÉGENDAIRE", "LEGENDAIRE", "MYTHIC", "MYTHIQUE"].includes(card.rarity.toUpperCase());

  // Full Art no longer overrides default positions rigidly, positions are managed by Admin state
  const titlePos = attrs.titlePos || { x: 50, y: 75, scale: 100 };
  const descPos = attrs.descPos || { x: 50, y: 92, scale: 100 };
  const rarityBadgePos = attrs.rarityBadgePos || { x: 15, y: 65, scale: 100 };
  const levelTextPos = attrs.levelTextPos || { x: 50, y: 82, scale: 100 };
  const textPos = attrs.textPos; // Fallback for old cards
  const levelBadgePos = attrs.levelBadgePos || { x: 10, y: 8, scale: 100 };
  const editionBadgePos = attrs.editionBadgePos || { x: 85, y: 73, scale: 100 };

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
  // --- Aesthetic TCG Layout Data (No Gameplay) ---
  const levelIconUrl = getLevelIcon(card.level);
  
  // Faction / Level Color for the nameplate
  let factionColor = 'bg-gray-800';
  if (card.level === 'Diamond') factionColor = 'bg-cyan-600';
  if (card.level === 'Gold') factionColor = 'bg-yellow-600';
  if (card.level === 'Iron') factionColor = 'bg-gray-400';
  if (card.level === 'Netherite') factionColor = 'bg-purple-900';
  if (attrs.factionColor) factionColor = attrs.factionColor; // Custom override
  
  // Rarity styling
  let rarityBgColor = 'bg-gray-500';
  let rarityTextColor = 'text-white';
  if (card.rarity === 'MYTHIC') { rarityBgColor = 'bg-red-600'; rarityTextColor = 'text-yellow-300'; }
  if (card.rarity === 'LEGENDARY') { rarityBgColor = 'bg-yellow-500'; rarityTextColor = 'text-white'; }
  if (card.rarity === 'EPIC') { rarityBgColor = 'bg-purple-600'; rarityTextColor = 'text-white'; }
  if (card.rarity === 'RARE') { rarityBgColor = 'bg-blue-600'; rarityTextColor = 'text-white'; }
  if (card.rarity === 'UNCOMMON') { rarityBgColor = 'bg-green-600'; rarityTextColor = 'text-white'; }

  const role = card.edition || attrs.role || 'SURVIVANT';
  const faction = attrs.faction || 'PARANOIA SMP';


  return (
    <div className={`relative ${wrapperClass} aspect-[2.5/3.5] mx-auto rounded-xl ${isEditing ? '' : 'perspective-1000'} @container`}>
      <InteractiveCard 
        card={{...card, isEditing}} 
        className={`${wrapperClass} aspect-[2.5/3.5] border-2 rounded-xl overflow-hidden ${getLevelBorder(card.level)} ${(attrs.cardGlowColor || attrs.mainColor) ? 'animate-pulse-glow-custom' : getRarityGlow(card.rarity)}`}
        style={combinedStyle}
      >
        
        {/* Full Art Character Image */}
        <div className="absolute inset-0 z-10 w-full h-full flex items-end justify-center overflow-hidden rounded-xl">
          {!attrs.hideCharacter && (
            (card.imageUrl || card.player?.minecraftName || card.title) ? (
              <img 
                src={card.imageUrl || `https://vzge.me/bust/512/${card.player?.minecraftName || card.title}.png`} 
                alt={card.title} 
                className={`w-[120%] h-[85%] object-cover object-top drop-shadow-2xl ${isEditing ? 'pointer-events-auto cursor-grab active:cursor-grabbing hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'pointer-events-none'}`} 
                onMouseDown={(e) => handleMouseDown(e, 'character')}
                onWheel={(e) => handleWheel(e, 'character')}
              />
            ) : (
              <div className="w-20 h-20 bg-gray-700/50 rounded-full mb-10 border border-white/10"></div>
            )
          )}
        </div>

        {/* Top-Right: Rarity Box */}
        {!attrs.hideRarityBox && <div 
          className={`absolute z-30 flex items-center ${rarityBgColor} border-white rounded-bl-xl rounded-tr-md shadow-lg overflow-hidden`}
          style={{ 
            top: '2%', right: '2%',
            borderWidth: '0.4cqi',
            transform: `translateZ(${translateZ})`
          }}
        >
          <span className={`${rarityTextColor} font-black italic px-[2.5cqi] py-[1cqi] leading-none uppercase tracking-wider`} style={{ fontSize: '4.5cqi' }}>
            {card.rarity}
          </span>
        </div>}

        {/* Edition Badge */}
        {attrs.editionBadgeUrl && (
          <img 
            src={attrs.editionBadgeUrl} 
            alt="Edition Badge"
            className={`absolute z-[70] object-contain drop-shadow-md ${isEditing ? 'cursor-grab active:cursor-grabbing hover:drop-shadow-[0_0_10px_white]' : 'pointer-events-none'}`}
            style={{
              left: `${editionBadgePos.x}%`,
              top: `${editionBadgePos.y}%`,
              width: `${editionBadgePos.scale * 0.15}cqi`,
              transform: `translate(-50%, -50%) translateZ(70px)`
            }}
            onMouseDown={(e) => handleMouseDown(e, 'editionBadge')}
            onWheel={(e) => handleWheel(e, 'editionBadge')}
            draggable={false}
          />
        )}

        {/* Side Text (Card ID or SMP branding) */}
        {!attrs.hideSideText && <div 
          className="absolute z-30 origin-bottom-left -rotate-90 flex items-center gap-[1cqi]"
          style={{ 
            top: '40%', left: '0',
            transform: `translateZ(${parseInt(translateZ) * 0.8}px) translateY(100%)`
          }}
        >
          <div className="bg-black/95  text-white/50 font-black flex items-center gap-[1cqi] rounded-t-md border-white/20 shadow-lg" style={{ padding: '0.5cqi 3cqi', borderWidth: '0.2cqi 0.2cqi 0 0.2cqi', fontSize: '3cqi' }}>
            <span className="tracking-[0.3em]">PARANOIA SMP</span>
          </div>
        </div>}

        {/* Bottom Layout: Description + Nameplate */}
        <div className="absolute bottom-0 inset-x-0 z-30 flex flex-col" style={{ transform: `translateZ(${parseInt(translateZ) * 1.2}px)` }}>
          
          {/* Description / Effect Box */}
          {(!attrs.hideDescription && card.description) && (
            <div className={`w-full bg-black/90 border-white/20 shadow-inner relative ${attrs.hideNameplate ? 'rounded-b-xl' : ''}`} style={{ margin: attrs.hideNameplate ? '0' : '0 0 1cqi 0', padding: '2cqi 2cqi 2cqi 2cqi', borderTopWidth: '0.2cqi', borderBottomWidth: '0.2cqi' }}>
              <p className="text-white/90 font-medium leading-tight text-center italic" style={{ fontSize: '3.2cqi' }}>
                &quot;{card.description}&quot;
              </p>
            </div>
          )}

          {/* Nameplate */}
          {!attrs.hideNameplate && <div className={`w-full ${factionColor?.startsWith('#') || factionColor?.startsWith('rgb') ? '' : factionColor} border-white/50 relative shadow-[0_-5px_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center rounded-b-xl`} style={{ backgroundColor: factionColor?.startsWith('#') || factionColor?.startsWith('rgb') ? factionColor : undefined, borderTopWidth: '0.6cqi', padding: '2cqi 2cqi 1.5cqi 2cqi' }}>
            {/* Rarity/Role tag */}
            {!attrs.hideRole && <div className="absolute bg-white text-black font-black uppercase rounded-sm shadow-md" style={{ top: '-3cqi', right: '2cqi', padding: '0.5cqi 1.5cqi', fontSize: '3cqi' }}>
              {role}
            </div>}
            
            {!attrs.hideTitle && <h3 className="text-white font-black uppercase tracking-widest text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontSize: '7.5cqi', WebkitTextStroke: '0.1cqi black', lineHeight: 1 }}>
              {card.title}
            </h3>}
            
            {!attrs.hideBottomText && <div className="flex justify-center mt-[0.5cqi]">
              <span className="text-white/70 font-bold tracking-[0.2em] uppercase" style={{ fontSize: '3cqi' }}>
                {card.level} TIER • {faction}
              </span>
            </div>}
          </div>}
        </div>

        {/* Custom Badges */}
        {customBadges && customBadges.map((badge: any, i: number) => (
          <img 
            key={badge.id || i}
            src={badge.url}
            alt="Badge"
            className={`absolute z-[60] object-contain drop-shadow-lg ${isEditing ? 'cursor-grab active:cursor-grabbing hover:drop-shadow-[0_0_10px_white]' : 'pointer-events-none'}`}
            style={{ 
              left: `${badge.x}%`, 
              top: `${badge.y}%`, 
              width: `${badge.size}px`, 
              height: `${badge.size}px`, 
              transform: `translate(-50%, -50%) translateZ(60px)` 
            }}
            onMouseDown={(e) => handleMouseDown(e, 'customBadge', badge.id || String(i))}
            onWheel={(e) => handleWheel(e, 'customBadge', badge.id || String(i))}
            draggable={false}
          />
        ))}

        {/* Smart Guides (Photoshop style) */}
        {isEditing && attrs.showVGuide && (
          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-[var(--color-accent-purple)] shadow-[0_0_8px_var(--color-accent-purple)] z-[100] pointer-events-none" style={{ transform: 'translateX(-50%) translateZ(100px)' }} />
        )}
        {isEditing && attrs.showHGuide && (
          <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-[var(--color-accent-purple)] shadow-[0_0_8px_var(--color-accent-purple)] z-[100] pointer-events-none" style={{ transform: 'translateY(-50%) translateZ(100px)' }} />
        )}

        {/* Custom Frame Overlay (behind characters and text) */}
        {attrs.frameUrl && (
          <img src={attrs.frameUrl} alt="Card Frame" className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-xl" style={{ transform: 'translateZ(10px)' }} />
        )}

        {/* Special Effects Overlay */}
        {attrs.effect && attrs.effect !== "none" && (
          <div className="absolute inset-0 pointer-events-none rounded-xl z-50 overflow-hidden" style={{ transform: 'translateZ(40px)' }}>
            <div className={`absolute inset-0 w-full h-full ${attrs.effect === 'holo' ? 'effect-holo' : attrs.effect === 'shiny' ? 'effect-shiny' : attrs.effect === 'glitch' ? 'effect-glitch' : attrs.effect === 'paillettes' ? 'effect-paillettes' : ''}`} />
          </div>
        )}
</InteractiveCard>
    </div>
  );
}
