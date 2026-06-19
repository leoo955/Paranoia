import { NextResponse } from 'next/server';
import { prisma } from "@/lib/db";

export async function GET() {
  const cards = await prisma.tradingCard.findMany({
    where: { title: 'Brillantesque' },
    include: {
      asVariantLinks: { include: { variantProfile: true } },
      motherLinks: { include: { variantProfile: true } }
    }
  });
  return NextResponse.json(cards);
}
