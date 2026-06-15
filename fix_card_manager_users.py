import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix handleGodAction
content = content.replace(
    'const player = players.find(p => p.id === godPlayerId);',
    'const user = appUsers.find(u => u.id === godPlayerId);'
)
content = content.replace(
    'const minecraftName = player ? player.minecraftName : null;',
    'const minecraftName = user ? user.minecraftName : null;'
)

# Fix the select dropdown (we need to replace only the one inside the Card Manager, not the one in Card Creation!)
# But wait, there is the select inside Card Manager:
god_select_target = '{players.map(p => <option key={p.id} value={p.id}>{p.minecraftName}</option>)}'
god_select_replacement = '{appUsers.filter(u => u.minecraftName).map(u => <option key={u.id} value={u.id}>{u.minecraftName}</option>)}'

# We should only replace the occurrence that comes AFTER Card Manager
# Let's do a replace, but verify it doesn't break others. Actually there are 2: one for Card Manager "Sélectionner un Joueur"
# Let's replace specifically in the God Mode UI block:
god_select_block = '''                  <select value={godPlayerId} onChange={e => setGodPlayerId(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-red-500">
                    <option value="">-- Choisir un joueur --</option>
                    {players.map(p => <option key={p.id} value={p.id}>{p.minecraftName}</option>)}
                  </select>'''
god_select_block_new = '''                  <select value={godPlayerId} onChange={e => setGodPlayerId(e.target.value)} className="w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-color)] rounded-lg px-4 py-2 text-white outline-none focus:border-red-500">
                    <option value="">-- Choisir un utilisateur --</option>
                    {appUsers.filter(u => u.minecraftName).map(u => <option key={u.id} value={u.id}>{u.name} ({u.minecraftName})</option>)}
                  </select>'''

content = content.replace(god_select_block, god_select_block_new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed Card Manager to only use registered appUsers")
