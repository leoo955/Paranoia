import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Rename tab from 'categories' to 'godmode'
content = content.replace(
    'onClick={() => setActiveTab("categories")}',
    'onClick={() => setActiveTab("godmode")}'
)
content = content.replace(
    'activeTab === \'categories\'',
    'activeTab === \'godmode\''
)
content = content.replace(
    '<Layers className="w-5 h-5" /> Catégories',
    '<Layers className="w-5 h-5" /> God Mode'
)

# 2. Add god mode state & functions
if 'const [godCardId, setGodCardId]' not in content:
    god_state = '''
  const [godCardId, setGodCardId] = useState("");
  const [godPlayerId, setGodPlayerId] = useState("");
  const [godBoxType, setGodBoxType] = useState("standard");
  const [godBoxAmount, setGodBoxAmount] = useState(1);

  const handleGodAction = async (action: string) => {
    if (action.includes("ALL") && !window.confirm(`Êtes-vous sûr de vouloir exécuter l'action ${action} ? C'est irréversible !`)) return;
    try {
      const res = await fetch("/api/admin/cards/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, cardId: godCardId, userId: godPlayerId })
      });
      if (res.ok) alert("Action exécutée avec succès !");
      else alert(await res.text());
    } catch (e) {
      alert("Erreur");
    }
  };

  const handleGiveBox = async () => {
    if (!godPlayerId) return alert("Sélectionnez un joueur");
    try {
      // Find discordId from players
      const player = players.find(p => p.id === godPlayerId);
      // Wait, we need the User id not the player id...
      // Let's assume we can pass userId to a new admin box endpoint, 
      // or we can use the bot endpoint if we have discordId.
      // But we are admin, we can just call an admin box API.
      // For now we'll just mock it or alert.
      alert("L'API Admin pour Box arrive !");
    } catch (e) {
      alert("Erreur");
    }
  };
'''
    content = content.replace(
        'const [newCatIconUrl, setNewCatIconUrl] = useState("");',
        'const [newCatIconUrl, setNewCatIconUrl] = useState("");\n' + god_state
    )

# 3. Replace the categories tab UI with God Mode UI
# I will use a regex to replace everything between `{activeTab === "categories" && (` and `        {activeTab === "moderation" && (`
import re
pattern = r'\{activeTab === "categories" && \([\s\S]*?\{activeTab === "moderation" && \('
godmode_ui = '''{activeTab === "godmode" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[var(--color-bg-elevated)] border border-red-500/50 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-purple-600"></div>
              <h2 className="text-2xl font-bold font-outfit text-white mb-6 flex items-center gap-2">
                <ShieldAlert className="text-red-500" /> GOD MODE - Gestion des Cartes
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Sélectionner une Carte</label>
                  <select value={godCardId} onChange={e => setGodCardId(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-red-500">
                    <option value="">-- Choisir une carte --</option>
                    {cards.map(c => <option key={c.id} value={c.id}>{c.title} ({c.rarity})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Sélectionner un Joueur (pour action ciblée)</label>
                  <select value={godPlayerId} onChange={e => setGodPlayerId(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-red-500">
                    <option value="">-- Choisir un joueur --</option>
                    {players.map(p => <option key={p.id} value={p.id}>{p.minecraftName}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button onClick={() => handleGodAction("GIVE")} disabled={!godCardId || !godPlayerId} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105">
                  <Sparkles className="w-6 h-6" /> Donner la Carte
                </button>
                <button onClick={() => handleGodAction("REMOVE")} disabled={!godCardId || !godPlayerId} className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105">
                  <Trash2 className="w-6 h-6" /> Retirer la Carte
                </button>
                <button onClick={() => handleGodAction("GIVE_ALL")} disabled={!godCardId} className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105">
                  <Users className="w-6 h-6" /> Give All (Serveur)
                </button>
                <button onClick={() => handleGodAction("WIPE_ALL")} disabled={!godCardId} className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  <ShieldAlert className="w-6 h-6" /> WIPE ALL
                </button>
              </div>
            </div>

            {/* Box Management */}
            <div className="bg-[var(--color-bg-elevated)] border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold font-outfit text-white mb-6">Distribution de Box</h2>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Type de Box</label>
                  <select value={godBoxType} onChange={e => setGodBoxType(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500">
                    <option value="standard">Box Standard</option>
                    <option value="premium">Box Premium</option>
                    <option value="mythic">Box Mythique</option>
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Quantité</label>
                  <input type="number" min="1" value={godBoxAmount} onChange={e => setGodBoxAmount(parseInt(e.target.value))} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none" />
                </div>
                <button onClick={handleGiveBox} disabled={!godPlayerId} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg h-[42px]">
                  Give Box
                </button>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mt-4">Note: Pour automatiser ceci via le bot Discord, le bot doit appeler POST /api/bot/give-box avec le secret configuré.</p>
            </div>
          </div>
        )}

        {activeTab === "moderation" && ('''
content = re.sub(pattern, godmode_ui, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("God mode injected")
