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

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { mcVerificationCode: code },
    });

    return NextResponse.json({ success: true, code });
  } catch (error) {
    console.error("[GENERATE_MC_CODE]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}