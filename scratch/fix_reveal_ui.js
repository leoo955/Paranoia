const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/cards/PackOpenerClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Shrink reveal screen margins
content = content.replace(
    /className="z-10 flex flex-col items-center animate-slide-up relative mt-8 w-full max-w-7xl mx-auto"/,
    'className="z-10 flex flex-col items-center animate-slide-up relative mt-2 w-full max-w-7xl mx-auto"'
);

content = content.replace(
    /className="flex flex-wrap justify-center gap-6 lg:gap-12 mt-8 mb-12"/,
    'className="flex flex-wrap justify-center gap-4 lg:gap-8 mt-2 mb-4"'
);

// We can scale down the cards a bit so 5 cards fit on one line or two lines without huge vertical space
content = content.replace(
    /className={`relative group transform transition-all duration-700 ease-out flex flex-col items-center/g,
    'className={`relative group transform transition-all duration-700 ease-out flex flex-col items-center scale-90 sm:scale-100'
);

fs.writeFileSync(filePath, content);
console.log('Fixed Reveal UI spacing.');
