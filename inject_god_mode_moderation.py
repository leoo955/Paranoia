import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

god_mode_ui = '''
            {/* Card Manager / God Mode inside Moderation */}
            <div className="bg-[var(--color-bg-elevated)] border border-red-500/50 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-purple-600"></div>
              <h2 className="text-2xl font-bold font-outfit text-white mb-6 flex items-center gap-2">
                <ShieldAlert className="text-red-500" /> Card Manager
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

            <div className="h-px bg-[var(--color-border-color)] my-8"></div>
'''

# First, check if it's already there to avoid duplicates
if "Card Manager" not in content and "GOD MODE" not in content:
    moderation_target = '{activeTab === "moderation" && (\n          <div className="space-y-6">'
    if moderation_target in content:
        content = content.replace(moderation_target, moderation_target + "\n" + god_mode_ui)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Card Manager injected into Moderation")
    else:
        print("Could not find moderation target")
else:
    print("God Mode or Card Manager is already in the file")
