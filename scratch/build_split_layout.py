import re

with open('src/app/cards/PackOpenerClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

boxes_data_definition = """
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
      rates: [ {r: "Commune", p: "40%", c: "text-gray-400"}, {r: "Peu Commune", p: "30%", c: "text-green-400"}, {r: "Rare", p: "20%", c: "text-blue-400"}, {r: "Épique", p: "8%", c: "text-purple-400"}, {r: "Légendaire", p: "2%", c: "text-yellow-400"} ]
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
      rates: [ {r: "Commune", p: "20%", c: "text-gray-400"}, {r: "Peu Commune", p: "25%", c: "text-green-400"}, {r: "Rare", p: "35%", c: "text-blue-400"}, {r: "Épique", p: "15%", c: "text-purple-400"}, {r: "Légendaire", p: "5%", c: "text-yellow-400"} ]
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
      rates: [ {r: "Commune", p: "10%", c: "text-gray-400"}, {r: "Peu Commune", p: "15%", c: "text-green-400"}, {r: "Rare", p: "40%", c: "text-blue-400"}, {r: "Épique", p: "25%", c: "text-purple-400"}, {r: "Légendaire", p: "10%", c: "text-yellow-400"} ]
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
"""

new_layout = """          {!showReveal && (
            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-10 mb-8 z-10 mt-6 relative">
              
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
                  {!isOpening && (
                    activeBox.owned > 0 ? (
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
                    ) : (
                      coins < activeBox.price ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); router.push('/shop'); }}
                          className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-xl font-bold text-white transition-all text-lg shadow-[0_0_15px_rgba(156,163,175,0.2)] border border-gray-600"
                        >
                          Fonds insuffisants - Boutique
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); buyBooster(selectedBoxType, activeBox.price); }} 
                          disabled={isBuying} 
                          className={`relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 text-lg shadow-2xl border ${activeBox.border}`}
                        >
                          <div className={`absolute inset-0 ${activeBox.glow} opacity-30 group-hover:opacity-50 transition-opacity`} />
                          <span className="relative flex items-center gap-2 drop-shadow-md">
                            Acheter pour <img src="/Paracoin.png" alt="PARA" className="w-5 h-5 object-contain" /> {activeBox.price}
                          </span>
                        </button>
                      )
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
          )}"""

pattern = r"\{!showReveal && \([\s\S]*?{/\* Cinematic Opening Overlay \*/}"
content = re.sub(pattern, new_layout + "\n          {/* Cinematic Opening Overlay */}", content)

if "const boxesData" not in content:
    content = content.replace("  return (\n    <div className=\"w-full\">", boxes_data_definition + "\n  return (\n    <div className=\"w-full\">")

with open('src/app/cards/PackOpenerClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Applied split layout.")
