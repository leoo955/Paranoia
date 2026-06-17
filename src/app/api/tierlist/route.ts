import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gameMode = searchParams.get("gameMode") || "GÉNERAL";

    const tierList = await prisma.tierList.findFirst({
      where: { gameMode },
      orderBy: { updatedAt: 'desc' }
    });

    if (!tierList) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: JSON.parse(tierList.data) });
  } catch (error) {
    console.error("[TIERLIST_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const body = await req.json();
    const { gameMode, data } = body;

    if (!gameMode || !data) {
      return new NextResponse("Données invalides", { status: 400 });
    }

    const stringifiedData = JSON.stringify(data);

    const existing = await prisma.tierList.findFirst({
      where: { gameMode }
    });

    if (existing) {
      await prisma.tierList.update({
        where: { id: existing.id },
        data: {
          data: stringifiedData,
          authorId: (session.user as any).id
        }
      });
    } else {
      await prisma.tierList.create({
        data: {
          title: `Tier List ${gameMode}`,
          gameMode: gameMode,
          data: stringifiedData,
          isPublic: true,
          authorId: (session.user as any).id
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TIERLIST_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}