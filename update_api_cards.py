import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\api\cards\route.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("category", "edition")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated cards API")
