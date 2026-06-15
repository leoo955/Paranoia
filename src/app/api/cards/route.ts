import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!session || !user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, playerName, playerId, rarity, level, proba, description, customBackground, customBadges, characterPosition, imageUrl, attributes } = await req.json();

    if (!playerId || !rarity || !level) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const parsedProba = parseFloat(proba);
    const validProba = isNaN(parsedProba) ? 100 : parsedProba;
    
    const parsedBadges = Array.isArray(customBadges) ? JSON.stringify(customBadges) : "[]";
    const parsedCharPos = typeof characterPosition === 'object' && characterPosition !== null ? JSON.stringify(characterPosition) : '{"x":50,"y":50,"scale":100}';
    const parsedAttributes = typeof attributes === 'object' && attributes !== null ? JSON.stringify(attributes) : "{}";

    const card = await prisma.tradingCard.create({
      data: {
        title: title || playerName || "Inconnu",
        playerId,
        rarity,
        level,
        proba: validProba,
        description: description || "",
        imageUrl: imageUrl || null,
        customBackground: customBackground || null,
        customBadges: parsedBadges,
        characterPosition: parsedCharPos,
        attributes: parsedAttributes,
        authorId: user.id as string,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("[CARDS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const cards = await prisma.tradingCard.findMany({
      include: {
        player: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("[CARDS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!session || !user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id, title, playerName, playerId, rarity, level, proba, description, customBackground, customBadges, characterPosition, imageUrl, attributes } = await req.json();

    if (!id || !playerId || !rarity || !level) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const parsedProba = parseFloat(proba);
    const validProba = isNaN(parsedProba) ? 100 : parsedProba;

    const parsedBadges = Array.isArray(customBadges) ? JSON.stringify(customBadges) : "[]";
    const parsedCharPos = typeof characterPosition === 'object' && characterPosition !== null ? JSON.stringify(characterPosition) : '{"x":50,"y":50,"scale":100}';
    const parsedAttributes = typeof attributes === 'object' && attributes !== null ? JSON.stringify(attributes) : "{}";

    const card = await prisma.tradingCard.update({
      where: { id },
      data: {
        title: title || playerName || "Inconnu",
        playerId,
        rarity,
        level,
        proba: validProba,
        description: description || "",
        imageUrl: imageUrl || null,
        customBackground: customBackground || null,
        customBadges: parsedBadges,
        characterPosition: parsedCharPos,
        attributes: parsedAttributes,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("[CARDS_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (!session || !user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    await prisma.userCard.deleteMany({
      where: { tradingCardId: id }
    });

    await prisma.tradingCard.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CARDS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
