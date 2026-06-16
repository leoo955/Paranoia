const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/cards/PackOpenerClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useRouter if missing
if (!content.includes('useRouter')) {
    content = content.replace(
        /import { useState, useEffect, useRef } from "react";/,
        `import { useState, useEffect, useRef } from "react";\nimport { useRouter } from "next/navigation";`
    );
    // Add router hook inside component
    content = content.replace(
        /export default function PackOpenerClient\([^)]+\) \{/,
        `export default function PackOpenerClient({ initialInventory, initialBoxes, initialCoins, isLoggedIn, allCards, serverPlayers, currentUserMCName }: any) {\n  const router = useRouter();`
    );
}

// 2. Shrink grid spacing
content = content.replace(
    /grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 z-10/g,
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 z-10'
);

// 3. Shrink boxes padding
content = content.replace(/p-6 rounded-3xl border-2/g, 'p-3 rounded-2xl border-2');

// 4. Shrink box image container (w-24 h-24 -> w-16 h-16) and image (w-20 h-20 -> w-14 h-14)
content = content.replace(/w-24 h-24 rounded-full/g, 'w-16 h-16 rounded-full');
content = content.replace(/w-20 h-20 object-contain/g, 'w-14 h-14 object-contain');

// 5. Shrink box titles (text-2xl -> text-lg)
content = content.replace(/text-2xl font-black text-(blue|purple|amber|red)-(300|400|500)/g, 'text-lg font-black text-$1-$2');

// 6. Shrink mt-4 to mt-2
content = content.replace(/<div className="mt-4 w-full flex flex-col gap-3 relative z-10">/g, '<div className="mt-2 w-full flex flex-col gap-2 relative z-10">');

// 7. Replace Standard button logic
content = content.replace(
    /\{ownedStandard === 0 && \([\s\S]*?<button[\s\S]*?buyBooster\("standard", 150\); \}\}[\s\S]*?<\/button>[\s\S]*?\)\}/,
    `{ownedStandard === 0 && (
      coins < 150 ? (
        <button onClick={(e) => { e.stopPropagation(); router.push('/shop'); }} className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-xl font-bold text-white transition-all text-sm shadow-[0_0_10px_rgba(156,163,175,0.3)]">
          Boutique
        </button>
      ) : (
        <button onClick={(e) => { e.stopPropagation(); buyBooster("standard", 150); }} disabled={isBuying} className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          <span className="flex items-center gap-1"><img src="/Paracoin.png" alt="PARA" className="w-4 h-4 object-contain" /> 150</span>
        </button>
      )
    )}`
);

// 8. Replace Premium button logic
content = content.replace(
    /\{ownedPremium === 0 && \([\s\S]*?<button[\s\S]*?buyBooster\("premium", 250\); \}\}[\s\S]*?<\/button>[\s\S]*?\)\}/,
    `{ownedPremium === 0 && (
      coins < 250 ? (
        <button onClick={(e) => { e.stopPropagation(); router.push('/shop'); }} className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-xl font-bold text-white transition-all text-sm shadow-[0_0_10px_rgba(156,163,175,0.3)]">
          Boutique
        </button>
      ) : (
        <button onClick={(e) => { e.stopPropagation(); buyBooster("premium", 250); }} disabled={isBuying} className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm shadow-[0_0_10px_rgba(168,85,247,0.3)]">
          <span className="flex items-center gap-1"><img src="/Paracoin.png" alt="PARA" className="w-4 h-4 object-contain" /> 250</span>
        </button>
      )
    )}`
);

// 9. Replace Legendary button logic
content = content.replace(
    /\{ownedLegendary === 0 && \([\s\S]*?<button[\s\S]*?buyBooster\("legendary", 400\); \}\}[\s\S]*?<\/button>[\s\S]*?\)\}/,
    `{ownedLegendary === 0 && (
      coins < 400 ? (
        <button onClick={(e) => { e.stopPropagation(); router.push('/shop'); }} className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-xl font-bold text-white transition-all text-sm shadow-[0_0_10px_rgba(156,163,175,0.3)]">
          Boutique
        </button>
      ) : (
        <button onClick={(e) => { e.stopPropagation(); buyBooster("legendary", 400); }} disabled={isBuying} className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm shadow-[0_0_10px_rgba(245,158,11,0.3)]">
          <span className="flex items-center gap-1"><img src="/Paracoin.png" alt="PARA" className="w-4 h-4 object-contain" /> 400</span>
        </button>
      )
    )}`
);

// 10. Replace Mythic button logic
content = content.replace(
    /\{ownedMythic === 0 && \([\s\S]*?<button[\s\S]*?buyBooster\("mythic", 750\); \}\}[\s\S]*?<\/button>[\s\S]*?\)\}/,
    `{ownedMythic === 0 && (
      coins < 750 ? (
        <button onClick={(e) => { e.stopPropagation(); router.push('/shop'); }} className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-xl font-bold text-white transition-all text-sm shadow-[0_0_10px_rgba(156,163,175,0.3)]">
          Boutique
        </button>
      ) : (
        <button onClick={(e) => { e.stopPropagation(); buyBooster("mythic", 750); }} disabled={isBuying} className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl font-bold text-white transition-all disabled:opacity-50 text-sm shadow-[0_0_10px_rgba(239,68,68,0.3)]">
          <span className="flex items-center gap-1"><img src="/Paracoin.png" alt="PARA" className="w-4 h-4 object-contain" /> 750</span>
        </button>
      )
    )}`
);

// 11. Shrink big opening image
content = content.replace(/className={`w-64 h-auto relative/g, 'className={`w-48 h-auto relative');

// 12. Shrink big button padding
content = content.replace(/group relative px-12 py-4 mt-10/g, 'group relative px-10 py-3 mt-4');

// 13. Remove unnecessary ? buttons
content = content.replace(/<div className="w-5 h-5 rounded-full border border-.*?-400\/50 flex items-center justify-center text-.*?-400 text-xs font-bold cursor-help hover:bg-.*?-400\/20">\?<\/div>/g, '');

fs.writeFileSync(filePath, content);
console.log('Fixed PackOpenerClient.tsx');
