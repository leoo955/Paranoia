import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\api\admin\cards\manage\route.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Instead of expecting userId directly, we expect minecraftName for GIVE and REMOVE
content = content.replace(
    'const { action, cardId, userId } = await req.json();',
    'const { action, cardId, userId, minecraftName } = await req.json();'
)

give_replace = '''
    if (action === "GIVE") {
      if (!minecraftName) return new NextResponse("Missing minecraftName", { status: 400 });
      const user = await prisma.user.findFirst({ where: { minecraftName } });
      if (!user) return new NextResponse("Ce joueur n'est pas inscrit sur le site web", { status: 404 });
      
      await prisma.userCard.create({
        data: {
          userId: user.id,
          tradingCardId: cardId
        }
      });
      return NextResponse.json({ success: true, message: "Carte donnée avec succès" });
    }
'''
import re
content = re.sub(r'if \(action === "GIVE"\) \{.*?return NextResponse\.json\(\{ success: true, message: "Carte donnée avec succès" \}\);\n    \}', give_replace.strip(), content, flags=re.DOTALL)

remove_replace = '''
    if (action === "REMOVE") {
      if (!minecraftName) return new NextResponse("Missing minecraftName", { status: 400 });
      const user = await prisma.user.findFirst({ where: { minecraftName } });
      if (!user) return new NextResponse("Ce joueur n'est pas inscrit sur le site web", { status: 404 });

      // Remove one instance of this card from the user
      const userCard = await prisma.userCard.findFirst({
        where: { userId: user.id, tradingCardId: cardId }
      });
      if (!userCard) return new NextResponse("L'utilisateur ne possède pas cette carte", { status: 404 });
      
      await prisma.userCard.delete({
        where: { id: userCard.id }
      });
      return NextResponse.json({ success: true, message: "Carte retirée avec succès" });
    }
'''
content = re.sub(r'if \(action === "REMOVE"\) \{.*?return NextResponse\.json\(\{ success: true, message: "Carte retirée avec succès" \}\);\n    \}', remove_replace.strip(), content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Admin API fixed for minecraftName")
