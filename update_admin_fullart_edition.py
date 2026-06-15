import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add editionBadgeUrl state
content = content.replace(
    'const [levelBadgeUrl, setLevelBadgeUrl] = useState("");',
    'const [levelBadgeUrl, setLevelBadgeUrl] = useState("");\n  const [editionBadgeUrl, setEditionBadgeUrl] = useState("");'
)

# 2. Add editionBadgeUrl to card payload when saving
content = content.replace(
    'levelBadgeUrl,',
    'levelBadgeUrl,\n          editionBadgeUrl: editionBadgeUrl || editions.find(e => e.name === cardEdition)?.iconUrl || "",'
)

# 3. Add to cancelEdit / reset
content = content.replace(
    'setLevelBadgeUrl("");',
    'setLevelBadgeUrl("");\n      setEditionBadgeUrl("");'
)

# 4. Add to handleEditCard
content = content.replace(
    'setLevelBadgeUrl(attrs.levelBadgeUrl || "");',
    'setLevelBadgeUrl(attrs.levelBadgeUrl || "");\n      setEditionBadgeUrl(attrs.editionBadgeUrl || "");'
)

# 5. Add UI for uploading editionBadgeUrl
ui_chunk_old = """                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Probabilité d'obtention (%)</label>"""
ui_chunk_new = """                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Badge d'Édition (Image)</label>
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text"
                      value={editionBadgeUrl}
                      onChange={(e) => setEditionBadgeUrl(e.target.value)}
                      className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                      placeholder="URL (ou laisse vide pour défaut de l'édition)"
                      disabled={creatingCard}
                    />
                    <label className="bg-[var(--color-bg-elevated)] hover:bg-[var(--color-border-color)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 cursor-pointer flex items-center justify-center transition-colors">
                      Upload
                      <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        try {
                          const res = await fetch("/api/upload", { method: "POST", body: formData });
                          if (res.ok) {
                            const data = await res.json();
                            setEditionBadgeUrl(data.url);
                          }
                        } catch (err) {}
                      }} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Probabilité d'obtention (%)</label>"""
content = content.replace(ui_chunk_old, ui_chunk_new)

# 6. Pass editionBadgeUrl to the preview CardDisplay
preview_chunk_old = 'levelBadgeUrl,'
preview_chunk_new = 'levelBadgeUrl,\n                      editionBadgeUrl: editionBadgeUrl || editions.find(e => e.name === cardEdition)?.iconUrl || "",'
# Careful, we replaced it globally in step 2. Let's make sure it handles both.
# Step 2 did global replace, so preview CardDisplay is already updated!

# 7. Restrict Full Art checkbox
fullart_checkbox_old = """<input type="checkbox" checked={isFullArt} onChange={(e) => {"""
fullart_checkbox_new = """<input type="checkbox" disabled={cardRarity !== 'LEGENDARY' && cardRarity !== 'MYTHIC'} checked={isFullArt} onChange={(e) => {"""
content = content.replace(fullart_checkbox_old, fullart_checkbox_new)

# 8. Force Full Art to false when rarity changes
rarity_change_old = """value={cardRarity}
                    onChange={(e) => setCardRarity(e.target.value)}"""
rarity_change_new = """value={cardRarity}
                    onChange={(e) => {
                      const newRarity = e.target.value;
                      setCardRarity(newRarity);
                      if (newRarity !== 'LEGENDARY' && newRarity !== 'MYTHIC') {
                        setIsFullArt(false);
                      }
                    }}"""
content = content.replace(rarity_change_old, rarity_change_new)

# 9. Add disabled style to full art label text to make it obvious
label_fullart_old = """Activer le Mode "Full Art" (Layout Personnalisé)"""
label_fullart_new = """Activer le Mode "Full Art" (Mythique/Légendaire uniquement)"""
content = content.replace(label_fullart_old, label_fullart_new)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated admin page for full art restriction and edition badge!")
