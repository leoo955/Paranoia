import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. State & Fetch for Categories
if 'const [categories, setCategories]' not in content:
    content = content.replace(
        'const [templates, setTemplates] = useState<any[]>([]);',
        'const [templates, setTemplates] = useState<any[]>([]);\n  const [categories, setCategories] = useState<any[]>([]);\n  const [newCatName, setNewCatName] = useState("");\n  const [newCatIconUrl, setNewCatIconUrl] = useState("");'
    )

    fetch_cat_func = '''
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    }
  };
'''
    content = content.replace(
        'const fetchTemplates = async () => {',
        fetch_cat_func + '\n  const fetchTemplates = async () => {'
    )

    content = content.replace(
        'fetchTemplates();',
        'fetchTemplates();\n    fetchCategories();'
    )

# 2. Add handleDeleteTemplate
if 'handleDeleteTemplate' not in content:
    delete_tmpl_func = '''
  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) return;
    try {
      const res = await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchTemplates();
      else alert("Erreur lors de la suppression.");
    } catch (e) {
      console.error(e);
    }
  };
'''
    content = content.replace(
        'const handleSaveTemplate = async () => {',
        delete_tmpl_func + '\n  const handleSaveTemplate = async () => {'
    )

# 3. Add handleDeleteCategory & handleCreateCategory
if 'handleDeleteCategory' not in content:
    cat_funcs = '''
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim(), iconUrl: newCatIconUrl.trim() }),
      });
      if (res.ok) {
        setNewCatName("");
        setNewCatIconUrl("");
        fetchCategories();
      } else {
        alert("Erreur lors de la création de la catégorie.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
      else alert("Erreur lors de la suppression.");
    } catch (e) {
      console.error(e);
    }
  };
'''
    content = content.replace(
        'const handleCreatePlayer = async (e: React.FormEvent) => {',
        cat_funcs + '\n  const handleCreatePlayer = async (e: React.FormEvent) => {'
    )

# 4. Tab for Categories
if 'Base de Catégories' not in content:
    tab_html = '''        <button 
          onClick={() => setActiveTab("cards")}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'cards' ? 'bg-[var(--color-accent-purple)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-white'}`}
        >
          <Sparkles className="w-5 h-5" /> Base de Cartes
        </button>'''
    
    new_tab_html = tab_html + '''
        <button 
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-[var(--color-accent-purple)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-white'}`}
        >
          <Layers className="w-5 h-5" /> Catégories
        </button>'''
    content = content.replace(tab_html, new_tab_html)

# 5. Delete Template button in form
tmpl_ui = '''                  <select onChange={(e) => handleApplyTemplate(e.target.value)} className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]">
                    <option value="">-- Choisir un template --</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>'''
new_tmpl_ui = '''                  <div className="flex gap-2">
                    <select id="templateSelect" onChange={(e) => handleApplyTemplate(e.target.value)} className="flex-1 bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]">
                      <option value="">-- Choisir un template --</option>
                      {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <button type="button" onClick={() => {
                      const sel = document.getElementById("templateSelect") as HTMLSelectElement;
                      if (sel && sel.value) handleDeleteTemplate(sel.value);
                    }} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg border border-red-500/30">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>'''
content = content.replace(tmpl_ui, new_tmpl_ui)

# 6. Change Category Input to Select
cat_input = '''                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Catégorie / Collection</label>
                  <input 
                    type="text" 
                    value={cardCategory} 
                    onChange={e => setCardCategory(e.target.value)} 
                    placeholder="Saison 1, Holographique, Staff..."
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                  />'''
new_cat_input = '''                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Catégorie / Collection</label>
                  <select 
                    value={cardCategory}
                    onChange={(e) => setCardCategory(e.target.value)}
                    className="w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                  >
                    <option value="Standard">Standard</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>'''
content = content.replace(cat_input, new_cat_input)

# 7. Add Category Icon in list
icon_html = '''                        <span className="text-xs text-[var(--color-text-secondary)] block">{card.category} • {card.rarity} • {card.level}</span>'''
new_icon_html = '''                        <span className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 mt-1">
                          {categories.find(c => c.name === card.category)?.iconUrl && (
                            <img src={categories.find(c => c.name === card.category)?.iconUrl} alt="icon" className="w-3 h-3 object-contain" />
                          )}
                          {card.category} • {card.rarity} • {card.level}
                        </span>'''
content = content.replace(icon_html, new_icon_html)

# 8. Add Categories UI section
if 'activeTab === "categories"' not in content:
    cat_section = '''
        {activeTab === "categories" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-xl p-6">
              <h2 className="text-2xl font-bold font-outfit text-white mb-6">Ajouter une Catégorie</h2>
              <form onSubmit={handleCreateCategory}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Nom de la Catégorie *</label>
                    <input 
                      type="text" 
                      value={newCatName} 
                      onChange={(e) => setNewCatName(e.target.value)} 
                      className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                      placeholder="Ex: Saison 1, Staff, Event..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">URL de l'icône (Optionnel)</label>
                    <input 
                      type="text" 
                      value={newCatIconUrl} 
                      onChange={(e) => setNewCatIconUrl(e.target.value)} 
                      className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]"
                      placeholder="https://imgur.com/...png"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary mt-4 w-full">
                  {loading ? "Création..." : "Créer la catégorie"}
                </button>
              </form>
            </div>

            <div className="pt-8 border-t border-[var(--color-border-color)]">
              <h2 className="text-2xl font-bold font-outfit text-white mb-6">Catégories Enregistrées ({categories.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-[var(--color-bg-elevated)] border border-[var(--color-border-color)] rounded-lg p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      {cat.iconUrl ? (
                        <img src={cat.iconUrl} alt={cat.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">🗂️</div>
                      )}
                      <span className="font-bold text-white">{cat.name}</span>
                    </div>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
'''
    content = content.replace('{activeTab === "cards" && (', cat_section + '\n        {activeTab === "cards" && (')

# Need to ensure Layers icon is imported
if 'Layers' not in content:
    content = content.replace('import { Search, Sparkles, User, Users, Shield, Plus, Trash2 } from "lucide-react";', 'import { Search, Sparkles, User, Users, Shield, Plus, Trash2, Layers } from "lucide-react";')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated page.tsx")
