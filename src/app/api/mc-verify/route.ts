import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Basic security: require a secret token in headers to prevent fake verification
    const authHeader = req.headers.get("authorization");
    const API_SECRET = process.env.MC_API_SECRET;

    if (!API_SECRET || authHeader !== `Bearer ${API_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { code, minecraftName, minecraftUuid } = body;

    if (!code || !minecraftName || !minecraftUuid) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Find user with this code
    // @ts-ignore
    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { mcVerificationCode: code },
    });

    if (!user) {
      return new NextResponse("Invalid code", { status: 404 });
    }

    // Verify user and remove code
    // @ts-ignore
    await prisma.user.update({
      // @ts-ignore
      where: { id: user.id },
      data: {
        isMcVerified: true,
        minecraftName: minecraftName,
        minecraftUuid: minecraftUuid,
        mcVerificationCode: null, // Consume the code
      },
    });

    return NextResponse.json({ success: true, message: "User verified successfully." });
  } catch (error) {
    console.error("[MC_VERIFY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
