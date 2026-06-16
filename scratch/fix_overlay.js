const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/cards/PackOpenerClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the overlays
content = content.replace(
  /<div className="absolute inset-0 bg-black\/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 rounded-3xl p-4 backdrop-blur-sm pointer-events-none">\s*<h4 className="font-bold text-blue-400 mb-2 uppercase tracking-wider text-sm">Taux de Drop<\/h4>\s*<ul className="text-xs text-left w-full max-w-\[150px\] space-y-1 font-medium">\s*<li className="flex justify-between text-gray-400"><span>Commune<\/span><span>40%<\/span><\/li>\s*<li className="flex justify-between text-green-400"><span>Peu Commune<\/span><span>30%<\/span><\/li>\s*<li className="flex justify-between text-blue-400"><span>Rare<\/span><span>20%<\/span><\/li>\s*<li className="flex justify-between text-purple-400"><span>Épique<\/span><span>8%<\/span><\/li>\s*<li className="flex justify-between text-yellow-400"><span>Légendaire<\/span><span>2%<\/span><\/li>\s*<\/ul>\s*<\/div>/,
  ''
);

content = content.replace(
  /<div className="absolute inset-0 bg-black\/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 rounded-3xl p-4 backdrop-blur-sm pointer-events-none">\s*<h4 className="font-bold text-purple-400 mb-2 uppercase tracking-wider text-sm">Taux de Drop<\/h4>\s*<ul className="text-xs text-left w-full max-w-\[150px\] space-y-1 font-medium">\s*<li className="flex justify-between text-gray-400"><span>Commune<\/span><span>20%<\/span><\/li>\s*<li className="flex justify-between text-green-400"><span>Peu Commune<\/span><span>25%<\/span><\/li>\s*<li className="flex justify-between text-blue-400"><span>Rare<\/span><span>35%<\/span><\/li>\s*<li className="flex justify-between text-purple-400"><span>Épique<\/span><span>15%<\/span><\/li>\s*<li className="flex justify-between text-yellow-400"><span>Légendaire<\/span><span>5%<\/span><\/li>\s*<\/ul>\s*<\/div>/,
  ''
);

content = content.replace(
  /<div className="absolute inset-0 bg-black\/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 rounded-3xl p-4 backdrop-blur-sm pointer-events-none">\s*<h4 className="font-bold text-amber-400 mb-2 uppercase tracking-wider text-sm">Taux de Drop<\/h4>\s*<ul className="text-xs text-left w-full max-w-\[150px\] space-y-1 font-medium">\s*<li className="flex justify-between text-gray-400"><span>Commune<\/span><span>10%<\/span><\/li>\s*<li className="flex justify-between text-green-400"><span>Peu Commune<\/span><span>15%<\/span><\/li>\s*<li className="flex justify-between text-blue-400"><span>Rare<\/span><span>40%<\/span><\/li>\s*<li className="flex justify-between text-purple-400"><span>Épique<\/span><span>25%<\/span><\/li>\s*<li className="flex justify-between text-yellow-400"><span>Légendaire<\/span><span>10%<\/span><\/li>\s*<\/ul>\s*<\/div>/,
  ''
);

content = content.replace(
  /<div className="absolute inset-0 bg-black\/95 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 rounded-3xl p-4 backdrop-blur-sm pointer-events-none">\s*<h4 className="font-bold text-red-500 mb-2 uppercase tracking-wider text-sm">Taux de Drop<\/h4>\s*<ul className="text-xs text-left w-full max-w-\[150px\] space-y-1 font-medium">\s*<li className="flex justify-between text-purple-400"><span>Épique<\/span><span>75%<\/span><\/li>\s*<li className="flex justify-between text-yellow-400"><span>Légendaire<\/span><span>20%<\/span><\/li>\s*<li className="flex justify-between text-red-500"><span>Mythique<\/span><span>5%<\/span><\/li>\s*<\/ul>\s*<\/div>/,
  ''
);

// Add Info tooltip to Standard
content = content.replace(
  /<h3 className="text-2xl font-black text-blue-300 drop-shadow-md tracking-wide font-outfit uppercase">Standard<\/h3>/,
  `<div className="flex items-center justify-center gap-2 group/info relative">
                    <h3 className="text-2xl font-black text-blue-300 drop-shadow-md tracking-wide font-outfit uppercase">Standard</h3>
                    <div className="w-5 h-5 rounded-full border border-blue-400/50 flex items-center justify-center text-blue-400 text-xs font-bold cursor-help hover:bg-blue-400/20">?</div>
                    <div className="absolute bottom-full mb-2 w-48 bg-black/95 border border-white/10 rounded-xl p-3 shadow-2xl opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-50 left-1/2 -translate-x-1/2">
                      <h4 className="font-bold text-blue-400 mb-1 uppercase tracking-wider text-xs border-b border-white/10 pb-1">Taux de Drop</h4>
                      <ul className="text-[10px] text-left w-full space-y-1 font-medium">
                        <li className="flex justify-between text-gray-400"><span>Commune</span><span>40%</span></li>
                        <li className="flex justify-between text-green-400"><span>Peu Commune</span><span>30%</span></li>
                        <li className="flex justify-between text-blue-400"><span>Rare</span><span>20%</span></li>
                        <li className="flex justify-between text-purple-400"><span>Épique</span><span>8%</span></li>
                        <li className="flex justify-between text-yellow-400"><span>Légendaire</span><span>2%</span></li>
                      </ul>
                    </div>
                  </div>`
);

// Add Info tooltip to Premium
content = content.replace(
  /<h3 className="text-2xl font-black text-purple-300 drop-shadow-md tracking-wide font-outfit uppercase">Premium<\/h3>/,
  `<div className="flex items-center justify-center gap-2 group/info relative">
                    <h3 className="text-2xl font-black text-purple-300 drop-shadow-md tracking-wide font-outfit uppercase">Premium</h3>
                    <div className="w-5 h-5 rounded-full border border-purple-400/50 flex items-center justify-center text-purple-400 text-xs font-bold cursor-help hover:bg-purple-400/20">?</div>
                    <div className="absolute bottom-full mb-2 w-48 bg-black/95 border border-white/10 rounded-xl p-3 shadow-2xl opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-50 left-1/2 -translate-x-1/2">
                      <h4 className="font-bold text-purple-400 mb-1 uppercase tracking-wider text-xs border-b border-white/10 pb-1">Taux de Drop</h4>
                      <ul className="text-[10px] text-left w-full space-y-1 font-medium">
                        <li className="flex justify-between text-gray-400"><span>Commune</span><span>20%</span></li>
                        <li className="flex justify-between text-green-400"><span>Peu Commune</span><span>25%</span></li>
                        <li className="flex justify-between text-blue-400"><span>Rare</span><span>35%</span></li>
                        <li className="flex justify-between text-purple-400"><span>Épique</span><span>15%</span></li>
                        <li className="flex justify-between text-yellow-400"><span>Légendaire</span><span>5%</span></li>
                      </ul>
                    </div>
                  </div>`
);

// Add Info tooltip to Legendary
content = content.replace(
  /<h3 className="text-2xl font-black text-amber-400 drop-shadow-md tracking-wide font-outfit uppercase">Légendaire<\/h3>/,
  `<div className="flex items-center justify-center gap-2 group/info relative">
                    <h3 className="text-2xl font-black text-amber-400 drop-shadow-md tracking-wide font-outfit uppercase">Légendaire</h3>
                    <div className="w-5 h-5 rounded-full border border-amber-400/50 flex items-center justify-center text-amber-400 text-xs font-bold cursor-help hover:bg-amber-400/20">?</div>
                    <div className="absolute bottom-full mb-2 w-48 bg-black/95 border border-white/10 rounded-xl p-3 shadow-2xl opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-50 left-1/2 -translate-x-1/2">
                      <h4 className="font-bold text-amber-400 mb-1 uppercase tracking-wider text-xs border-b border-white/10 pb-1">Taux de Drop</h4>
                      <ul className="text-[10px] text-left w-full space-y-1 font-medium">
                        <li className="flex justify-between text-gray-400"><span>Commune</span><span>10%</span></li>
                        <li className="flex justify-between text-green-400"><span>Peu Commune</span><span>15%</span></li>
                        <li className="flex justify-between text-blue-400"><span>Rare</span><span>40%</span></li>
                        <li className="flex justify-between text-purple-400"><span>Épique</span><span>25%</span></li>
                        <li className="flex justify-between text-yellow-400"><span>Légendaire</span><span>10%</span></li>
                      </ul>
                    </div>
                  </div>`
);

// Add Info tooltip to Mythic
content = content.replace(
  /<h3 className="text-2xl font-black text-red-500 drop-shadow-\[0_0_8px_rgba\(239,68,68,1\)\] tracking-wide font-outfit uppercase">Mythique<\/h3>/,
  `<div className="flex items-center justify-center gap-2 group/info relative">
                    <h3 className="text-2xl font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,1)] tracking-wide font-outfit uppercase">Mythique</h3>
                    <div className="w-5 h-5 rounded-full border border-red-500/50 flex items-center justify-center text-red-500 text-xs font-bold cursor-help hover:bg-red-500/20">?</div>
                    <div className="absolute bottom-full mb-2 w-48 bg-black/95 border border-white/10 rounded-xl p-3 shadow-2xl opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none z-50 left-1/2 -translate-x-1/2">
                      <h4 className="font-bold text-red-500 mb-1 uppercase tracking-wider text-xs border-b border-white/10 pb-1">Taux de Drop</h4>
                      <ul className="text-[10px] text-left w-full space-y-1 font-medium">
                        <li className="flex justify-between text-purple-400"><span>Épique</span><span>75%</span></li>
                        <li className="flex justify-between text-yellow-400"><span>Légendaire</span><span>20%</span></li>
                        <li className="flex justify-between text-red-500"><span>Mythique</span><span>5%</span></li>
                      </ul>
                    </div>
                  </div>`
);

fs.writeFileSync(filePath, content);
console.log('Fixed overlays');
