import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const API_SECRET = process.env.MC_API_SECRET;

    if (!API_SECRET || authHeader !== `Bearer ${API_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { minecraftUuid } = body;

    if (!minecraftUuid) {
      return new NextResponse("Missing uuid", { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { minecraftUuid: minecraftUuid, isMcVerified: true },
    });

    return NextResponse.json({ verified: !!user });
  } catch (error) {
    console.error("[MC_CHECK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}