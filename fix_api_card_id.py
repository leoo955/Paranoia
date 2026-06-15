import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\api\admin\cards\manage\route.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'if (action === "GIVE") {',
    'if (action === "GIVE") {\n      if (!cardId) return new NextResponse("Missing cardId", { status: 400 });'
)

content = content.replace(
    'if (action === "REMOVE") {',
    'if (action === "REMOVE") {\n      if (!cardId) return new NextResponse("Missing cardId", { status: 400 });'
)

content = content.replace(
    'if (action === "GIVE_ALL") {',
    'if (action === "GIVE_ALL") {\n      if (!cardId) return new NextResponse("Missing cardId", { status: 400 });'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed cardId validation in API")
