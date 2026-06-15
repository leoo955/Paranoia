import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const body = await req.json();
    const { minecraftName } = body;

    if (!minecraftName || minecraftName.length < 3) {
      return new NextResponse("Pseudo invalide", { status: 400 });
    }

    // Update user in DB
    // @ts-ignore
    await prisma.user.update({
      // @ts-ignore
      where: { id: session.user.id },
      data: { minecraftName },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SETUP_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
