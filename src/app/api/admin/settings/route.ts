import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    
    if (!key) {
      return new NextResponse("Missing key", { status: 400 });
    }

    const setting = await prisma.systemSetting.findUnique({
      where: { key }
    });

    return NextResponse.json(setting ? JSON.parse(setting.value) : null);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const admin = session?.user as any;
    if (!session || !admin || admin.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { key, value } = await req.json();

    if (!key || value === undefined) {
      return new NextResponse("Missing parameters", { status: 400 });
    }

    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    });

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    console.error("[SETTINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
