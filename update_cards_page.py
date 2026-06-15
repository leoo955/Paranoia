import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\cards\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

fetch_logic = '''
  let inventory: any[] = [];
  let userBoxes: any[] = [];
  if (userId) {
    inventory = await prisma.userCard.findMany({
      where: { userId },
      include: {
        tradingCard: {
          include: { player: true }
        }
      },
      orderBy: { obtainedAt: 'desc' }
    });
    userBoxes = await prisma.userBox.findMany({
      where: { userId }
    });
  }
'''

content = content.replace(
    '''  let inventory: any[] = [];
  if (userId) {
    inventory = await prisma.userCard.findMany({
      where: { userId },
      include: {
        tradingCard: {
          include: { player: true }
        }
      },
      orderBy: { obtainedAt: 'desc' }
    });
  }''',
    fetch_logic
)

content = content.replace(
    '<PackOpenerClient initialInventory={inventory} isLoggedIn={!!userId} />',
    '<PackOpenerClient initialInventory={inventory} initialBoxes={userBoxes} isLoggedIn={!!userId} />'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Cards page updated to pass userBoxes")
