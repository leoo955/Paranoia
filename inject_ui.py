import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will inject the Edition management UI right after the "Cartes Créées" list
injection_target = """            <div className="pt-8 border-t border-[var(--color-border-color)]">
              <h2 className="text-2xl font-bold font-outfit text-white mb-6">Cartes Créées ({cards.length})</h2>"""

injection_code = """            <div className="pt-8 border-t border-[var(--color-border-color)] mb-8">
              <h2 className="text-2xl font-bold font-outfit text-white mb-6">Gérer les Éditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--color-bg-elevated)] p-6 rounded-xl border border-[var(--color-border-color)]">
                  <h3 className="text-lg font-bold text-white mb-4">Créer une Édition</h3>
                  <form onSubmit={handleCreateEdition} className="flex gap-2">
                    <input type="text" value={newEditionName} onChange={e => setNewEditionName(e.target.value)} placeholder="Nom de l'édition..." className="flex-1 bg-[var(--color-bg-primary)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-[var(--color-accent-purple)]" />
                    <button type="submit" disabled={loading} className="btn-primary px-4 py-2">Créer</button>
                  </form>
                </div>
                <div className="bg-[var(--color-bg-elevated)] p-6 rounded-xl border border-[var(--color-border-color)]">
                  <h3 className="text-lg font-bold text-white mb-4">Éditions Existantes ({editions.length})</h3>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {editions.map(ed => (
                      <div key={ed.id} className="flex justify-between items-center bg-[var(--color-bg-primary)] p-2 rounded-lg border border-[var(--color-border-color)]">
                        <span className="text-white">{ed.name}</span>
                        <button onClick={() => handleDeleteEdition(ed.id)} className="text-red-400 hover:text-red-300 text-sm">Supprimer</button>
                      </div>
                    ))}
                    {editions.length === 0 && <p className="text-[var(--color-text-secondary)] text-sm">Aucune édition.</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--color-border-color)]">
              <h2 className="text-2xl font-bold font-outfit text-white mb-6">Cartes Créées ({cards.length})</h2>"""

content = content.replace(injection_target, injection_code)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Injected UI")
