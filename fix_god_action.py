import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_action = '''  const handleGodAction = async (action: string) => {
    if (action.includes("ALL") && !window.confirm(`Êtes-vous sûr de vouloir exécuter l'action ${action} ? C'est irréversible !`)) return;
    try {
      const res = await fetch("/api/admin/cards/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, cardId: godCardId, userId: godPlayerId })
      });'''

new_action = '''  const handleGodAction = async (action: string) => {
    if (action.includes("ALL") && !window.confirm(`Êtes-vous sûr de vouloir exécuter l'action ${action} ? C'est irréversible !`)) return;
    try {
      const player = players.find(p => p.id === godPlayerId);
      const minecraftName = player ? player.minecraftName : null;
      const res = await fetch("/api/admin/cards/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, cardId: godCardId, minecraftName })
      });'''

content = content.replace(old_action, new_action)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Frontend God Action fixed")
