import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\cards\PackOpenerClient.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Standard
content = content.replace(
    '<p className="text-sm text-[var(--color-text-secondary)] mt-1">Gouttes communes</p>',
    '<p className="text-sm text-[var(--color-text-secondary)] mt-1 underline decoration-blue-500/50 underline-offset-2">Toutes les raretés disponibles</p>'
)

# Premium
content = content.replace(
    '<p className="text-sm text-[var(--color-text-secondary)] mt-1">Chances élevées (Epic/Leg)</p>',
    '<p className="text-sm text-[var(--color-text-secondary)] mt-1 underline decoration-purple-500/50 underline-offset-2">Commune et Peu Commune exclues</p>'
)

# Mythique
content = content.replace(
    '<p className="text-sm text-[var(--color-text-secondary)] mt-1">Légendaire Garanti</p>',
    '<p className="text-sm text-[var(--color-text-secondary)] mt-1 underline decoration-red-500/50 underline-offset-2">Rare et inférieur exclues</p>'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Text updated and underlined")
