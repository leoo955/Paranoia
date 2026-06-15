import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

const PRICES: Record<string, number> = {
  standard: 100,
  premium: 250,
  mythic: 500
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { boxType } = body;

    if (!boxType || !PRICES[boxType]) {
      return NextResponse.json({ error: "Type de booster invalide." }, { status: 400 });
    }

    const price = PRICES[boxType];

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    if (user.paraCoins < price) {
      return NextResponse.json({ error: "Fonds insuffisants" }, { status: 400 });
    }

    // Use a transaction to deduct coins and add a box
    await prisma.$transaction(async (tx) => {
      // Deduct coins
      await tx.user.update({
        where: { id: userId },
        data: { paraCoins: { decrement: price } }
      });

      // Add box/booster
      const existingBox = await tx.userBox.findFirst({
        where: { userId, boxType }
      });

      if (existingBox) {
        await tx.userBox.update({
          where: { id: existingBox.id },
          data: { amount: { increment: 1 } }
        });
      } else {
        await tx.userBox.create({
          data: {
            userId,
            boxType,
            amount: 1
          }
        });
      }
    });

    return NextResponse.json({ success: true, remainingCoins: user.paraCoins - price });
  } catch (error: any) {
    console.error("Erreur achat booster:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
