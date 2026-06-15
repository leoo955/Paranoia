import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import PackOpenerClient from "./PackOpenerClient";

export const revalidate = 0;

export const metadata = {
  title: "Trading Cards | PARANOIA",
};

export default async function CardsPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;


  let inventory: any[] = [];
  let userBoxes: any[] = [];
  if (userId) {
    inventory = await prisma.userCard.findMany({
      where: { userId },
      include: {
        tradingCard: {
          include: { player: true }
        }
      },
      orderBy: { obtainedAt: 'desc' }
    });
    userBoxes = await prisma.userBox.findMany({
      where: { userId }
    });
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white inline-block mb-2">Cartes de Joueurs</h1>
          <p className="text-[var(--color-text-secondary)]">Collectionnez les cartes des membres du serveur.</p>
        </div>
      </div>

      <PackOpenerClient initialInventory={inventory} initialBoxes={userBoxes} isLoggedIn={!!userId} />
    </div>
  );
}
