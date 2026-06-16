import os

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

    # Replace 256 with 512 for higher quality
    content = content.replace("https://vzge.me/bust/256/", "https://vzge.me/bust/512/")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Avatars upgraded to 512px!")
