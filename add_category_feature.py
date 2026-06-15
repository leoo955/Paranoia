import os
import re

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state
content = content.replace(
    'const [cardEffect, setCardEffect] = useState("");',
    'const [cardCategory, setCardCategory] = useState("Standard");\n  const [cardEffect, setCardEffect] = useState("");'
)

# 2. Add to startEditCard
content = content.replace(
    'setCardTitle(card.title || "");',
    'setCardTitle(card.title || "");\n    setCardCategory(card.category || "Standard");'
)

# 3. Add to cancelEdit
content = content.replace(
    'setCardProba(100);',
    'setCardProba(100);\n    setCardCategory("Standard");'
)

# 4. Add to payload in handleCreateCard
content = content.replace(
    'level: cardLevel,',
    'level: cardLevel,\n        category: cardCategory,'
)

# 5. Add input to form (after level)
form_html = '''                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Rareté</label>'''
form_replacement = '''                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Catégorie / Collection</label>
                  <input 
                    type="text" 
                    value={cardCategory} 
                    onChange={e => setCardCategory(e.target.value)} 
                    placeholder="Saison 1, Holographique, Staff..."
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Rareté</label>'''
content = content.replace(form_html, form_replacement)

# 6. Add category badge in the card list display
list_html = '''                        <span className="text-xs text-[var(--color-text-secondary)] block">{card.rarity} • {card.level}</span>'''
list_replacement = '''                        <span className="text-xs text-[var(--color-text-secondary)] block">{card.category} • {card.rarity} • {card.level}</span>'''
content = content.replace(list_html, list_replacement)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
