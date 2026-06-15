import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state
content = content.replace(
    'const [isFullArt, setIsFullArt] = useState(false);',
    'const [isFullArt, setIsFullArt] = useState(false);\n  const [cardEffect, setCardEffect] = useState("");'
)

# 2. Add to payload attributes
content = content.replace(
    'isFullArt,',
    'isFullArt,\n          effect: cardEffect,'
)

# 3. reset on handleCreateCard
content = content.replace(
    'setIsFullArt(false);',
    'setIsFullArt(false); setCardEffect("");'
)

# 4. startEditCard
content = content.replace(
    'setIsFullArt(attrs.isFullArt || false);',
    'setIsFullArt(attrs.isFullArt || false);\n      setCardEffect(attrs.effect || "");'
)

# 5. handleApplyTemplate
content = content.replace(
    'setIsFullArt(attrs.isFullArt || false);',
    'setIsFullArt(attrs.isFullArt || false);\n      setCardEffect(attrs.effect || "");'
)

# 6. UI select
select_html = """
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Effet Spécial (Holo/Shiny)</label>
                    <select
                      value={cardEffect}
                      onChange={(e) => setCardEffect(e.target.value)}
                      className="w-full bg-[#111118] border border-[var(--color-border-color)] rounded-md px-4 py-2 text-white focus:outline-none focus:border-[var(--color-accent-purple)]"
                    >
                      <option value="">Aucun effet</option>
                      <option value="holo">Holographique</option>
                      <option value="shiny">Shiny (Foil)</option>
                      <option value="glitch">Glitch</option>
                    </select>
                  </div>
"""

content = content.replace(
    '<div className="grid grid-cols-2 gap-4 mb-4">',
    select_html + '\n                  <div className="grid grid-cols-2 gap-4 mb-4">'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated admin page")
