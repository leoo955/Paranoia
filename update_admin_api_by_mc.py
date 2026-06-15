import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\api\admin\cards\manage\route.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

give_box_logic = '''
    if (action === "GIVE_BOX_BY_MC") {
      const { minecraftName, boxType, amount } = await req.json();
      if (!minecraftName || !boxType || !amount) return new NextResponse("Missing parameters", { status: 400 });
      
      const user = await prisma.user.findFirst({ where: { minecraftName } });
      if (!user) return new NextResponse("Le joueur n'est pas encore inscrit sur le site web", { status: 404 });

      await prisma.userBox.upsert({
        where: { userId_boxType: { userId: user.id, boxType } },
        update: { amount: { increment: amount } },
        create: { userId: user.id, boxType, amount }
      });
      return NextResponse.json({ success: true, message: `${amount} Box ${boxType} donnée(s) avec succès` });
    }
'''

content = content.replace(
    'if (action === "GIVE_BOX") {',
    give_box_logic + '\n    if (action === "GIVE_BOX") {'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Admin API updated with GIVE_BOX_BY_MC")
