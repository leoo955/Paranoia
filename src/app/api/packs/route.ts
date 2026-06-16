import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // Verify user actually exists in DB (in case of DB reset but stale session cookie)
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: "Compte introuvable. Veuillez vous déconnecter et vous reconnecter." }, { status: 401 });
    }

    
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

    const cards = await prisma.tradingCard.findMany({
      // We can drop the isPublished constraint for now if testing locally without an admin page to publish,
      // but let's keep it as isPublished: true since we have an authoring page maybe.
      // Wait, let's just get all cards to be safe for the user test, or allow all cards to be drawn.
      include: { player: true },
    });

    if (cards.length === 0) {
      return NextResponse.json({ error: "No cards available in the database yet!" }, { status: 404 });
    }

    const DROP_RATES: Record<string, Record<string, number>> = {
      standard: { COMMON: 40, UNCOMMON: 30, RARE: 20, EPIC: 7.8, LEGENDARY: 2, MYTHIC: 0.2 },
      premium: { COMMON: 20, UNCOMMON: 25, RARE: 35, EPIC: 14.5, LEGENDARY: 5, MYTHIC: 0.5 },
      legendary: { COMMON: 10, UNCOMMON: 15, RARE: 40, EPIC: 23, LEGENDARY: 10, MYTHIC: 2 },
      mythic: { COMMON: 0, UNCOMMON: 0, RARE: 0, EPIC: 75, LEGENDARY: 20, MYTHIC: 5 }
    };

    const CARDS_PER_PACK: Record<string, number> = {
      standard: 3,
      premium: 4,
      legendary: 4,
      mythic: 5
    };

    const currentType = boxType || "standard";
    const rates = DROP_RATES[currentType] || DROP_RATES["standard"];
    const numCards = CARDS_PER_PACK[currentType] || 3;

    // Group cards by rarity
    const cardsByRarity: Record<string, typeof cards> = {
      COMMON: cards.filter(c => c.rarity === "COMMON"),
      UNCOMMON: cards.filter(c => c.rarity === "UNCOMMON"),
      RARE: cards.filter(c => c.rarity === "RARE"),
      EPIC: cards.filter(c => c.rarity === "EPIC"),
      LEGENDARY: cards.filter(c => c.rarity === "LEGENDARY"),
      MYTHIC: cards.filter(c => c.rarity === "MYTHIC")
    };

    // Helper to get random card based on rarity weight
    const drawCard = () => {
      let rand = Math.random() * 100;
      let selectedRarity = "COMMON";
      
      for (const [rarity, prob] of Object.entries(rates)) {
        if (rand < prob) {
          selectedRarity = rarity;
          break;
        }
        rand -= prob;
      }

      // If no cards exist for that rarity, fallback to a lower one
      const fallbackOrder = ['MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'];
      let startIndex = fallbackOrder.indexOf(selectedRarity);
      if (startIndex === -1) startIndex = fallbackOrder.length - 1;

      let pool = cardsByRarity[selectedRarity];
      if (!pool || pool.length === 0) {
        // Try stepping down to lower rarities
        for (let i = startIndex + 1; i < fallbackOrder.length; i++) {
          if (cardsByRarity[fallbackOrder[i]] && cardsByRarity[fallbackOrder[i]].length > 0) {
            pool = cardsByRarity[fallbackOrder[i]];
            break;
          }
        }
        // If still nothing, fallback to all cards
        if (!pool || pool.length === 0) pool = cards;
      }

      return pool[Math.floor(Math.random() * pool.length)];
    };

    const drawnCards = [];
    for (let i = 0; i < numCards; i++) {
      drawnCards.push(drawCard());
    }

    const rarityWeight: Record<string, number> = {
      'COMMON': 1,
      'UNCOMMON': 2,
      'RARE': 3,
      'EPIC': 4,
      'LEGENDARY': 5,
      'MYTHIC': 6
    };

    // Sort so the best card is last
    drawnCards.sort((a, b) => (rarityWeight[a.rarity] || 0) - (rarityWeight[b.rarity] || 0));

    const SPECIAL_EFFECTS = ["Holographique", "Doré", "Ombré"];
    const EFFECT_DROP_CHANCE = 0.02; // 2% chance

    const userCards = [];
    for (const card of drawnCards) {
      // Roll for special effect
      let specialEffect = null;
      if (Math.random() < EFFECT_DROP_CHANCE) {
        specialEffect = SPECIAL_EFFECTS[Math.floor(Math.random() * SPECIAL_EFFECTS.length)];
      }

      const userCard = await prisma.userCard.create({
        data: {
          userId: userId,
          tradingCardId: card.id,
          specialEffect: specialEffect,
        },
        include: {
          tradingCard: {
            include: { player: true }
          }
        }
      });
      userCards.push(userCard);
    }

    return NextResponse.json({ 
      drawnCards: userCards.map(uc => uc.tradingCard), 
      userCards 
    });
  } catch (error) {
    console.error("Pack Opening Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
