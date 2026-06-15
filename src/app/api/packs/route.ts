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

    let totalWeight = 0;
    const weightedCards = cards.map(c => {
      let weight = c.proba ?? 100;
      
      // Modifier selon la box
      if (boxType === "premium") {
        if (c.rarity === "COMMON" || c.rarity === "UNCOMMON") weight = 0;
      } else if (boxType === "mythic") {
        if (c.rarity === "COMMON" || c.rarity === "UNCOMMON" || c.rarity === "RARE") weight = 0;
      }

      totalWeight += weight;
      return { card: c, weight };
    });

    if (totalWeight <= 0) {
      return NextResponse.json({ error: `La box ${boxType} ne contient aucune carte disponible dans la base de données.` }, { status: 400 });
    }

    let random = Math.random() * totalWeight;
    let drawnCard = weightedCards[0].card;
    for (const item of weightedCards) {
      if (item.weight === 0) continue;
      if (random < item.weight) {
        drawnCard = item.card;
        break;
      }
      random -= item.weight;
    }

    // Create a UserCard for the user
    const userCard = await prisma.userCard.create({
      data: {
        userId: userId,
        tradingCardId: drawnCard.id,
      },
      include: {
        tradingCard: {
          include: { player: true }
        }
      }
    });

    return NextResponse.json({ drawnCard: userCard.tradingCard, userCard });
  } catch (error) {
    console.error("Pack Opening Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
