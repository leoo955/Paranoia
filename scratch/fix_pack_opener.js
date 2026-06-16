const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/cards/PackOpenerClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Reduce padding/margins on Opener
content = content.replace(
  /<h2 className="text-4xl lg:text-5xl font-outfit font-black text-white mt-10 mb-4 z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-lg">Ouvrir des Boosters<\/h2>[\s\S]*?<div className="flex flex-col items-center gap-4 mb-12 z-10">[\s\S]*?<p className="text-\[var\(--color-text-secondary\)\] max-w-xl text-lg">[\s\S]*?Sélectionnez un booster et ouvrez-le pour obtenir de nouvelles cartes ![\s\S]*?<\/p>[\s\S]*?<button[\s\S]*?onClick=\{\(\) => setShowRatesModal\(true\)\}[\s\S]*?Voir les Drop Rates[\s\S]*?<\/button>[\s\S]*?<\/div>/,
  `<h2 className="text-3xl lg:text-4xl font-outfit font-black text-white mt-4 mb-2 z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-lg">Ouvrir des Boosters</h2>
          
          <div className="flex flex-col items-center gap-2 mb-6 z-10">
            <p className="text-[var(--color-text-secondary)] max-w-xl text-base">
              Sélectionnez un booster et ouvrez-le pour obtenir de nouvelles cartes !
            </p>
          </div>`
);

// 2. Reduce margin on grid
content = content.replace(
  /gap-6 mb-12 z-10/g,
  'gap-4 mb-6 z-10'
);

// 3. Add Hover drop rates for Standard
content = content.replace(
  /<div className="absolute inset-0 bg-gradient-to-b from-blue-500\/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"><\/div>/,
  `<div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 rounded-3xl p-4 backdrop-blur-sm pointer-events-none">
                  <h4 className="font-bold text-blue-400 mb-2 uppercase tracking-wider text-sm">Taux de Drop</h4>
                  <ul className="text-xs text-left w-full max-w-[150px] space-y-1 font-medium">
                    <li className="flex justify-between text-gray-400"><span>Commune</span><span>40%</span></li>
                    <li className="flex justify-between text-green-400"><span>Peu Commune</span><span>30%</span></li>
                    <li className="flex justify-between text-blue-400"><span>Rare</span><span>20%</span></li>
                    <li className="flex justify-between text-purple-400"><span>Épique</span><span>8%</span></li>
                    <li className="flex justify-between text-yellow-400"><span>Légendaire</span><span>2%</span></li>
                  </ul>
                </div>`
);

// 4. Add Hover drop rates for Premium
content = content.replace(
  /<div className="absolute inset-0 bg-gradient-to-b from-purple-500\/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"><\/div>/,
  `<div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 rounded-3xl p-4 backdrop-blur-sm pointer-events-none">
                  <h4 className="font-bold text-purple-400 mb-2 uppercase tracking-wider text-sm">Taux de Drop</h4>
                  <ul className="text-xs text-left w-full max-w-[150px] space-y-1 font-medium">
                    <li className="flex justify-between text-gray-400"><span>Commune</span><span>20%</span></li>
                    <li className="flex justify-between text-green-400"><span>Peu Commune</span><span>25%</span></li>
                    <li className="flex justify-between text-blue-400"><span>Rare</span><span>35%</span></li>
                    <li className="flex justify-between text-purple-400"><span>Épique</span><span>15%</span></li>
                    <li className="flex justify-between text-yellow-400"><span>Légendaire</span><span>5%</span></li>
                  </ul>
                </div>`
);

// 5. Add Hover drop rates for Legendary
content = content.replace(
  /<div className="absolute inset-0 bg-gradient-to-b from-amber-500\/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"><\/div>/,
  `<div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 rounded-3xl p-4 backdrop-blur-sm pointer-events-none">
                  <h4 className="font-bold text-amber-400 mb-2 uppercase tracking-wider text-sm">Taux de Drop</h4>
                  <ul className="text-xs text-left w-full max-w-[150px] space-y-1 font-medium">
                    <li className="flex justify-between text-gray-400"><span>Commune</span><span>10%</span></li>
                    <li className="flex justify-between text-green-400"><span>Peu Commune</span><span>15%</span></li>
                    <li className="flex justify-between text-blue-400"><span>Rare</span><span>40%</span></li>
                    <li className="flex justify-between text-purple-400"><span>Épique</span><span>25%</span></li>
                    <li className="flex justify-between text-yellow-400"><span>Légendaire</span><span>10%</span></li>
                  </ul>
                </div>`
);

// 6. Add Hover drop rates for Mythic
content = content.replace(
  /<div className="absolute inset-0 bg-gradient-to-b from-red-500\/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"><\/div>/,
  `<div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 rounded-3xl p-4 backdrop-blur-sm pointer-events-none">
                  <h4 className="font-bold text-red-500 mb-2 uppercase tracking-wider text-sm">Taux de Drop</h4>
                  <ul className="text-xs text-left w-full max-w-[150px] space-y-1 font-medium">
                    <li className="flex justify-between text-purple-400"><span>Épique</span><span>75%</span></li>
                    <li className="flex justify-between text-yellow-400"><span>Légendaire</span><span>20%</span></li>
                    <li className="flex justify-between text-red-500"><span>Mythique</span><span>5%</span></li>
                  </ul>
                </div>`
);

// 7. Remove the showRatesModal state and component
content = content.replace(/const \[showRatesModal, setShowRatesModal\] = useState\(false\);\n/, '');
content = content.replace(/\{\/\* FOMO Rates Modal \*\/\}[\s\S]*?\}\)/, '');

// 8. Reduce padding on the container
content = content.replace(
  /className="bg-\[#0f0f16\] border border-indigo-500\/20 rounded-3xl p-8 lg:p-16 flex flex-col items-center text-center relative overflow-hidden shadow-2xl"/,
  'className="bg-[#0f0f16] border border-indigo-500/20 rounded-3xl p-6 lg:p-10 flex flex-col items-center text-center relative overflow-hidden shadow-2xl"'
);

// 9. Fix z-index for the overlay. The booster images had relative z-10, so overlay needs z-20.
// (I used z-30 above)

fs.writeFileSync(filePath, content);
console.log('Fixed PackOpenerClient.tsx');
