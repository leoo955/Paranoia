import os
import re

files_to_update = [
    "src/app/admin/page.tsx",
    "src/app/api/og/card/route.tsx",
    "src/app/cards/PackOpenerClient.tsx",
    "src/app/tier-list/page.tsx",
    "src/components/cards/CardDisplay.tsx",
]

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The general pattern: `https://render.crafty.gg/3d/bust/${VAR}` or 'Steve'}?v=${timestamp}
    # It might end with a closing bracket `}` or `}?v=${timestamp}`
    
    # We can do specific replacements:
    content = content.replace(
        "https://render.crafty.gg/3d/bust/${player.minecraftName}",
        "https://vzge.me/bust/256/${player.minecraftName}.png"
    )
    content = content.replace(
        "https://render.crafty.gg/3d/bust/${card.title}",
        "https://vzge.me/bust/256/${card.title}.png"
    )
    content = content.replace(
        "https://render.crafty.gg/3d/bust/${card.player?.minecraftName || 'Steve'}?v=${timestamp}",
        "https://vzge.me/bust/256/${card.player?.minecraftName || 'Steve'}.png?v=${timestamp}"
    )
    content = content.replace(
        "https://render.crafty.gg/3d/bust/${selectedCard.player.minecraftName}",
        "https://vzge.me/bust/256/${selectedCard.player.minecraftName}.png"
    )
    content = content.replace(
        "https://render.crafty.gg/3d/bust/${item}",
        "https://vzge.me/bust/256/${item}.png"
    )
    content = content.replace(
        "https://render.crafty.gg/3d/bust/${card.player?.minecraftName || card.title}",
        "https://vzge.me/bust/256/${card.player?.minecraftName || card.title}.png"
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Avatars replaced!")
