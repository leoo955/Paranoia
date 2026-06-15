import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\cards\PackOpenerClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Standard icon
content = content.replace(
    '<PackageOpen className="w-10 h-10 text-blue-400" />',
    '<img src="/StandardB.png" alt="Standard" className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />'
)

# Replace Premium icon
content = content.replace(
    '<Sparkles className="w-10 h-10 text-purple-400" />\n                </div>\n                <div>\n                  <h3 className="text-xl font-bold text-purple-300">Box Premium</h3>',
    '<img src="/PreniumB.png" alt="Premium" className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" />\n                </div>\n                <div>\n                  <h3 className="text-xl font-bold text-purple-300">Box Premium</h3>'
)

# Replace Mythic icon
content = content.replace(
    '<Sparkles className="w-10 h-10 text-red-400" />\n                </div>\n                <div>\n                  <h3 className="text-xl font-bold text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">Box Mythique</h3>',
    '<img src="/MythiqueB.png" alt="Mythique" className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />\n                </div>\n                <div>\n                  <h3 className="text-xl font-bold text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">Box Mythique</h3>'
)

# Replace big central pack image
old_big_image = '<img src="/Nouveau_projet_2.png" alt="Booster Pack" className="w-64 h-auto relative z-10 drop-shadow-2xl" />'
new_big_image = '<img src={selectedBoxType === "standard" ? "/StandardB.png" : selectedBoxType === "premium" ? "/PreniumB.png" : "/MythiqueB.png"} alt="Booster Pack" className="w-64 h-auto relative z-10 drop-shadow-2xl transition-all duration-300 transform hover:scale-110" />'
content = content.replace(old_big_image, new_big_image)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Images replaced!")
