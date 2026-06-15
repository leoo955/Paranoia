import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\admin\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

mock_logic = '''// Wait, we need the User id not the player id...
      // Let's assume we can pass userId to a new admin box endpoint, 
      // or we can use the bot endpoint if we have discordId.
      // But we are admin, we can just call an admin box API.
      // For now we'll just mock it or alert.
      alert("L'API Admin pour Box arrive !");'''

real_logic = '''
      const player = players.find(p => p.id === godPlayerId);
      if (!player) return alert("Joueur introuvable");
      const res = await fetch("/api/admin/cards/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // NOTE: players in the UI correspond to the 'Player' table, but we need the 'User' id.
        // Wait, does the 'Player' table have the 'userId'? No, User has 'minecraftName'.
        // Actually, in the DB, a 'User' has a 'minecraftName' and 'discordId'.
        // Let's pass the minecraftName to the API so the API can find the User.
        body: JSON.stringify({ action: "GIVE_BOX_BY_MC", minecraftName: player.minecraftName, boxType: godBoxType, amount: godBoxAmount })
      });
      if (res.ok) alert("Box donnée avec succès !");
      else alert(await res.text());
'''

content = content.replace(mock_logic, real_logic)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Give box fixed")
