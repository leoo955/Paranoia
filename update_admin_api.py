import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\api\admin\cards\manage\route.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

give_box_logic = '''
    if (action === "GIVE_BOX") {
      const { boxType, amount } = await req.json();
      if (!userId || !boxType || !amount) return new NextResponse("Missing parameters", { status: 400 });
      
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return new NextResponse("User not found", { status: 404 });

      await prisma.userBox.upsert({
        where: { userId_boxType: { userId: user.id, boxType } },
        update: { amount: { increment: amount } },
        create: { userId: user.id, boxType, amount }
      });
      return NextResponse.json({ success: true, message: `${amount} Box ${boxType} donnée avec succès` });
    }
'''

content = content.replace(
    'if (action === "GIVE") {',
    give_box_logic + '\n    if (action === "GIVE") {'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Admin API updated")
