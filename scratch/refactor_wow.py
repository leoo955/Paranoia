import re

with open("src/app/cards/PackOpenerClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. New FlippableCard implementation
new_flippable_card = """
const FlippableCard = ({ card, index, boxType }: { card: TradingCard, index: number, boxType: string }) => {
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
          <h2 className={`font-black uppercase tracking-widest animate-huge-reveal ${
            card.rarity === 'MYTHIC' ? 'text-red-500 drop-shadow-[0_0_80px_rgba(239,68,68,1)] text-stroke-mythic' : 
            'text-yellow-400 drop-shadow-[0_0_80px_rgba(250,204,21,1)] text-stroke-legendary'
          }`} style={{ WebkitTextStroke: '3px white', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.8))' }}>
            {card.rarity === 'MYTHIC' ? 'MYTHIQUE !' : 'LÉGENDAIRE !'}
          </h2>
        </div>
      )}
      <div 
        className="relative z-10 animate-epic-card-reveal cursor-pointer group shrink-0" 
        style={{ animationDelay: `${index * 0.4}s`, animationFillMode: 'both', perspective: '1000px', width: '16rem', height: '22.4rem', minWidth: '16rem' }}
        onClick={handleFlip}
      >
        {/* Wrapper pour le tremblement (seulement si pas retournée) et le survol */}
        <div className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${!isFlipped ? 'animate-[card-tremble_0.3s_infinite]' : ''}`}>
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
"""

# Replace old FlippableCard (from `const FlippableCard =` to `};` before `export default function`)
content = re.sub(r'const FlippableCard =.*?^};', new_flippable_card.strip(), content, flags=re.MULTILINE|re.DOTALL)


# 2. Remove the global useEffect for Confetti
content = re.sub(r'\s*// Trigger Confetti on Reveal\s*useEffect\(\(\) => \{.*?\n  \}, \[showReveal, openingGlow\]\);\s*', '\n\n', content, flags=re.MULTILINE|re.DOTALL)

# 3. Remove the HUGE TEXT OVERLAY block
content = re.sub(r'\s*\{\/\* HUGE TEXT OVERLAY FOR BIG WINS \*\/\}.*?</div>\s*\}\s*', '\n', content, flags=re.MULTILINE|re.DOTALL)


with open("src/app/cards/PackOpenerClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Refactored WOW effects in PackOpenerClient.tsx")
