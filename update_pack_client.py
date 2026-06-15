import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\cards\PackOpenerClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

props_replace = '''export default function PackOpenerClient({ initialInventory, initialBoxes, isLoggedIn }: { initialInventory: UserCard[], initialBoxes?: any[], isLoggedIn: boolean }) {
  const [inventory, setInventory] = useState<UserCard[]>(initialInventory);
  const [boxes, setBoxes] = useState<any[]>(initialBoxes || []);
  const [selectedBoxType, setSelectedBoxType] = useState<string>("standard");'''

import re
content = re.sub(
    r'export default function PackOpenerClient\(\{ initialInventory, isLoggedIn \}: \{ initialInventory: UserCard\[\], isLoggedIn: boolean \}\) \{\n  const \[inventory, setInventory\] = useState<UserCard\[\]>\(initialInventory\);',
    props_replace,
    content
)

fetch_replace = '''
      const res = await fetch("/api/packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boxType: selectedBoxType })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setDrawnCard(data.drawnCard);
      // Consume a box locally to update UI fast
      setBoxes(prev => prev.map(b => b.boxType === selectedBoxType ? { ...b, amount: b.amount - 1 } : b));

      setTimeout(() => {
        setIsOpening(false);
        setShowReveal(true);
        setInventory(prev => [data.userCard, ...prev]);
      }, 2500); // Wait 2.5s for the epic animation
'''

content = re.sub(
    r'const res = await fetch\("/api/packs", \{ method: "POST" \}\);\n      const data = await res\.json\(\);\n      \n      if \(!res\.ok\) \{\n        throw new Error\(data\.error \|\| "Une erreur est survenue\."\);\n      \}\n\n      setDrawnCard\(data\.drawnCard\);\n      setTimeout\(\(\) => \{\n        setIsOpening\(false\);\n        setShowReveal\(true\);\n        setInventory\(prev => \[data\.userCard, \.\.\.prev\]\);\n      \}, 1500\);',
    fetch_replace.strip(),
    content,
    flags=re.DOTALL
)

opener_ui_replace = '''
      {/* Box Selection */}
      <div className="flex gap-4 justify-center mb-8">
        {['standard', 'premium', 'mythic'].map(type => {
          const boxData = boxes.find(b => b.boxType === type);
          const amount = boxData ? boxData.amount : 0;
          return (
            <button
              key={type}
              onClick={() => setSelectedBoxType(type)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedBoxType === type ? 'border-purple-500 bg-purple-500/20' : 'border-[var(--color-border-color)] bg-[var(--color-bg-elevated)] opacity-70 hover:opacity-100'}`}
            >
              <PackageOpen className={`w-8 h-8 ${type === 'mythic' ? 'text-red-500' : type === 'premium' ? 'text-purple-400' : 'text-white'}`} />
              <span className="font-bold capitalize text-white">{type}</span>
              <span className="text-xs text-[var(--color-text-secondary)]">{amount} en stock</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mb-16">
        <div className="relative">
          <button 
            onClick={openPack}
            disabled={isOpening || !boxes.find(b => b.boxType === selectedBoxType)?.amount}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${isOpening ? 'animate-[shake_0.5s_ease-in-out_infinite] scale-110' : 'hover:scale-105'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${selectedBoxType === 'mythic' ? 'from-red-600 to-orange-500' : selectedBoxType === 'premium' ? 'from-purple-600 to-indigo-600' : 'from-indigo-600 to-blue-500'} opacity-80 group-hover:opacity-100 transition-opacity`} />
            
            <div className="relative p-12 flex flex-col items-center gap-4 bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl m-[2px]">
              {isOpening ? (
                <>
                  <div className="absolute inset-0 bg-white/20 animate-ping rounded-2xl"></div>
                  <Loader2 className="w-16 h-16 text-white animate-spin drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                  <span className="text-2xl font-black text-white font-outfit uppercase tracking-widest animate-pulse">Ouverture...</span>
                </>
              ) : (
                <>
                  <PackageOpen className={`w-16 h-16 ${selectedBoxType === 'mythic' ? 'text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'text-white'} group-hover:scale-110 transition-transform`} />
                  <span className="text-xl font-bold text-white font-outfit text-center">
                    {!boxes.find(b => b.boxType === selectedBoxType)?.amount ? "Plus de Box" : "Ouvrir la Box"}
                  </span>
                </>
              )}
            </div>
          </button>
          {isOpening && <div className="absolute inset-0 bg-white opacity-0 animate-[flash_2.5s_ease-in-out] pointer-events-none rounded-2xl" />}
        </div>
      </div>
'''

content = re.sub(
    r'<div className="flex justify-center mb-16">\s*<button\s*onClick=\{openPack\}\s*disabled=\{isOpening\}\s*className="group relative overflow-hidden rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"\s*>\s*<div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity" />\s*<div className="relative p-8 md:p-12 flex flex-col items-center gap-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl m-\[2px\]">\s*\{isOpening \? \(\s*<Loader2 className="w-12 h-12 text-white animate-spin" />\s*\) : \(\s*<PackageOpen className="w-12 h-12 text-white group-hover:-translate-y-2 transition-transform" />\s*\)\}\s*<span className="text-xl font-bold text-white font-outfit">Ouvrir un Booster</span>\s*</div>\s*</button>\s*</div>',
    opener_ui_replace.strip(),
    content,
    flags=re.DOTALL
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("PackOpenerClient updated")
