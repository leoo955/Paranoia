import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# State variables
content = content.replace('const [cardCategory, setCardCategory] = useState("Standard");', 'const [cardEdition, setCardEdition] = useState("Standard");')
content = content.replace('const [categories, setCategories] = useState<any[]>([]);', 'const [editions, setEditions] = useState<any[]>([]);')
content = content.replace('const [newCatName, setNewCatName] = useState("");', 'const [newEditionName, setNewEditionName] = useState("");')
content = content.replace('const [newCatIconUrl, setNewCatIconUrl] = useState("");', 'const [newEditionIconUrl, setNewEditionIconUrl] = useState("");')

# fetch logic
content = content.replace('const fetchCategories = async () => {', 'const fetchEditions = async () => {')
content = content.replace('const res = await fetch("/api/categories");', 'const res = await fetch("/api/editions");')
content = content.replace('if (res.ok) setCategories(await res.json());', 'if (res.ok) setEditions(await res.json());')
content = content.replace('fetchCategories();', 'fetchEditions();')

# Card submit logic
content = content.replace('category: cardCategory,', 'edition: cardEdition,')
content = content.replace('setCardCategory("Standard");', 'setCardEdition("Standard");')
content = content.replace('setCardCategory(card.category || "Standard");', 'setCardEdition(card.edition || "Standard");')

# Category create logic
content = content.replace('const handleCreateCategory = async (e: React.FormEvent) => {', 'const handleCreateEdition = async (e: React.FormEvent) => {')
content = content.replace('if (!newCatName) return;', 'if (!newEditionName) return;')
content = content.replace('const res = await fetch("/api/categories", {', 'const res = await fetch("/api/editions", {')
content = content.replace('body: JSON.stringify({ name: newCatName.trim(), iconUrl: newCatIconUrl.trim() }),', 'body: JSON.stringify({ name: newEditionName.trim(), iconUrl: newEditionIconUrl.trim() }),')
content = content.replace('setNewCatName("");', 'setNewEditionName("");')
content = content.replace('setNewCatIconUrl("");', 'setNewEditionIconUrl("");')
content = content.replace('alert("Erreur lors de la création de la catégorie.");', 'alert("Erreur lors de la création de l\'édition.");')

# Category delete logic
content = content.replace('const handleDeleteCategory = async (id: string) => {', 'const handleDeleteEdition = async (id: string) => {')
content = content.replace('if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;', 'if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette édition ?")) return;')
content = content.replace('const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });', 'const res = await fetch(`/api/editions?id=${id}`, { method: "DELETE" });')

# Form fields
content = content.replace('<label className="block text-sm text-[var(--color-text-secondary)] mb-1">Catégorie / Collection</label>', '<label className="block text-sm text-[var(--color-text-secondary)] mb-1">Édition</label>')
content = content.replace('value={cardCategory}', 'value={cardEdition}')
content = content.replace('onChange={(e) => setCardCategory(e.target.value)}', 'onChange={(e) => setCardEdition(e.target.value)}')
content = content.replace('{categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}', '{editions.map(ed => <option key={ed.id} value={ed.name}>{ed.name}</option>)}')

# Rendering icons
content = content.replace('{categories.find(c => c.name === card.category)?.iconUrl', '{editions.find(e => e.name === card.edition)?.iconUrl')
content = content.replace('<img src={categories.find(c => c.name === card.category)?.iconUrl}', '<img src={editions.find(e => e.name === card.edition)?.iconUrl}')
content = content.replace('{card.category} • {card.rarity} • {card.level}', '{card.edition} • {card.rarity} • {card.level}')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated admin page UI")
