import os

file_path = r"c:\Users\leoo9\Documents\Projet\Paranoia\src\app\api\packs\route.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_logic = '''
    const { boxType } = await req.json().catch(() => ({ boxType: "standard" }));

    // Check if user has this box
    const userBox = await prisma.userBox.findUnique({
      where: { userId_boxType: { userId, boxType: boxType || "standard" } }
    });

    if (!userBox || userBox.amount <= 0) {
      return NextResponse.json({ error: `Vous n'avez pas de Box ${boxType || "standard"}.` }, { status: 400 });
    }

    // Decrement the box amount
    await prisma.userBox.update({
      where: { id: userBox.id },
      data: { amount: { decrement: 1 } }
    });

    // Fetch all available TradingCards
'''

content = content.replace(
    '// Fetch all available TradingCards',
    new_logic
)

# Apply probability modifier based on boxType
prob_logic = '''
    let totalWeight = 0;
    const weightedCards = cards.map(c => {
      let weight = c.proba ?? 100;
      
      // Modifier selon la box
      if (boxType === "premium") {
        if (c.rarity === "EPIC" || c.rarity === "LEGENDARY") weight *= 2;
        if (c.rarity === "COMMON") weight *= 0.5;
      } else if (boxType === "mythic") {
        if (c.rarity === "MYTHIC") weight *= 3;
        if (c.rarity === "LEGENDARY" || c.rarity === "EPIC") weight *= 2;
        if (c.rarity === "COMMON" || c.rarity === "UNCOMMON") weight *= 0.2;
      }

      totalWeight += weight;
      return { card: c, weight };
    });
'''

import re
content = re.sub(r'let totalWeight = 0;\s*const weightedCards = cards\.map\(c => \{\s*const weight = c\.proba \?\? 100;\s*totalWeight \+= weight;\s*return \{ card: c, weight \};\s*\}\);', prob_logic.strip(), content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Packs API updated")
