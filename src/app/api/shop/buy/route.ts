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
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    // Since this is a mockup shop without real payment processing, we just give the coins
    let economy = await prisma.userEconomy.findUnique({
      where: { userId }
    });

    if (!economy) {
      economy = await prisma.userEconomy.create({
        data: {
          userId,
          paraCoins: amount
        }
      });
    } else {
      economy = await prisma.userEconomy.update({
        where: { userId },
        data: {
          paraCoins: economy.paraCoins + amount
        }
      });
    }

    return NextResponse.json({ success: true, newBalance: economy.paraCoins });
  } catch (error) {
    console.error("[SHOP_BUY_ERROR]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
