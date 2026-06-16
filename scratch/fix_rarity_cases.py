import re

with open("src/components/cards/CardDisplay.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace getRarityGlow
new_get_rarity_glow = """export const getRarityGlow = (rarity: string) => {
  const r = rarity.toUpperCase();
  if (r === "MYTHIC" || r === "MYTHIQUE") return "animate-pulse-glow-mythic";
  if (r === "LEGENDARY" || r === "LÉGENDAIRE" || r === "LEGENDAIRE") return "animate-pulse-glow-legendary";
  if (r === "EPIC" || r === "ÉPIQUE" || r === "EPIQUE") return "animate-pulse-glow-epic";
  if (r === "RARE") return "animate-pulse-glow-rare";
  if (r === "UNCOMMON" || r === "PEU COMMUNE") return "animate-pulse-glow-uncommon";
  return "animate-pulse-glow-common";
};"""
content = re.sub(r'export const getRarityGlow = \(rarity: string\) => \{.*?^\};', new_get_rarity_glow, content, flags=re.MULTILINE|re.DOTALL)


# Replace getRarityBadge
new_get_rarity_badge = """export const getRarityBadge = (rarity: string) => {
  const r = rarity.toUpperCase();
  if (r === "MYTHIC" || r === "MYTHIQUE") return 'bg-red-500/20 text-red-500 border-red-500/50 font-black shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  if (r === "LEGENDARY" || r === "LÉGENDAIRE" || r === "LEGENDAIRE") return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
  if (r === "EPIC" || r === "ÉPIQUE" || r === "EPIQUE") return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
  if (r === "RARE") return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  if (r === "UNCOMMON" || r === "PEU COMMUNE") return 'bg-green-500/20 text-green-400 border-green-500/50';
  return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
}"""
content = re.sub(r'export const getRarityBadge = \(rarity: string\) => \{.*?^\}', new_get_rarity_badge, content, flags=re.MULTILINE|re.DOTALL)


# Replace isRare, isEpicOrLegendary, isLegendary
content = re.sub(r'const isRare = .*?;', 'const isRare = ["RARE", "EPIC", "ÉPIQUE", "EPIQUE", "LEGENDARY", "LÉGENDAIRE", "LEGENDAIRE", "MYTHIC", "MYTHIQUE"].includes(card.rarity.toUpperCase());', content)
content = re.sub(r'const isEpicOrLegendary = .*?;', 'const isEpicOrLegendary = ["EPIC", "ÉPIQUE", "EPIQUE", "LEGENDARY", "LÉGENDAIRE", "LEGENDAIRE", "MYTHIC", "MYTHIQUE"].includes(card.rarity.toUpperCase());', content)
content = re.sub(r'const isLegendary = .*?;', 'const isLegendary = ["LEGENDARY", "LÉGENDAIRE", "LEGENDAIRE", "MYTHIC", "MYTHIQUE"].includes(card.rarity.toUpperCase());', content)

# Replace isPremiumLayout
content = re.sub(r'const isPremiumLayout = attrs\.isFullArt \|\| card\.rarity === "LEGENDARY" \|\| card\.rarity === "MYTHIC";', 'const isPremiumLayout = attrs.isFullArt || ["LEGENDARY", "LÉGENDAIRE", "LEGENDAIRE", "MYTHIC", "MYTHIQUE"].includes(card.rarity.toUpperCase());', content)

# Replace rarityBgColor / rarityTextColor inside component
new_rarity_colors = """  // Rarity styling
  let rarityBgColor = 'bg-gray-500';
  let rarityTextColor = 'text-white';
  const rUp = card.rarity.toUpperCase();
  if (rUp === 'MYTHIC' || rUp === 'MYTHIQUE') { rarityBgColor = 'bg-red-600'; rarityTextColor = 'text-yellow-300'; }
  else if (rUp === 'LEGENDARY' || rUp === 'LÉGENDAIRE' || rUp === 'LEGENDAIRE') { rarityBgColor = 'bg-yellow-500'; rarityTextColor = 'text-white'; }
  else if (rUp === 'EPIC' || rUp === 'ÉPIQUE' || rUp === 'EPIQUE') { rarityBgColor = 'bg-purple-600'; rarityTextColor = 'text-white'; }
  else if (rUp === 'RARE') { rarityBgColor = 'bg-blue-600'; rarityTextColor = 'text-white'; }
  else if (rUp === 'UNCOMMON' || rUp === 'PEU COMMUNE') { rarityBgColor = 'bg-green-600'; rarityTextColor = 'text-white'; }"""
content = re.sub(r'\s*// Rarity styling.*?(?=\s*<div\s+ref=\{cardRef\})', '\n' + new_rarity_colors + '\n\n', content, flags=re.MULTILINE|re.DOTALL)


with open("src/components/cards/CardDisplay.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated CardDisplay.tsx rarity handling!")
