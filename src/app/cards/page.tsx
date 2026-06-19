import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import PackOpenerClient from "./PackOpenerClient";

export const revalidate = 0;

export const metadata = {
  title: "Trading Cards | PARANOIA",
  description: "Collectionnez les cartes des joueurs du serveur PARANOIA. Achetez des boosters, découvrez des cartes animées 3D rares et complétez votre collection.",
};

export default async function CardsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let inventory: any[] = [];
  let userBoxes: any[] = [];
  let paraCoins = 0;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { paraCoins: true }
    });
    paraCoins = user?.paraCoins || 0;

    inventory = await prisma.userCard.findMany({
      where: { userId },
      include: {
        tradingCard: {
          include: {
            player: true,
            motherLinks: {
              include: { variantProfile: true }
            },
            asVariantLinks: { include: { variantProfile: true } }
          }
        }
      },
      orderBy: { obtainedAt: 'desc' }
    });
    userBoxes = await prisma.userBox.findMany({
      where: { userId }
    });
  }

  const allCards = await prisma.tradingCard.findMany({
    include: {
      player: true,
      motherLinks: {
        include: { variantProfile: true }
      },
      asVariantLinks: { include: { variantProfile: true } }
    },
    orderBy: { rarity: 'desc' }
  });

  const allUsers = await prisma.user.findMany({
    select: { minecraftName: true, id: true }
  });
  const serverPlayers = allUsers
    .map(u => u.minecraftName)
    .filter(Boolean) as string[];

  const currentUserMCName = allUsers.find(u => u.id === userId)?.minecraftName || "";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none mix-blend-screen animate-pulse-slow" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[150%] max-w-7xl h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/50 via-purple-900/20 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-0" />
      {}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-indigo-400/20 blur-sm animate-float"
            style={{
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 10 + 10) + 's',
              animationDelay: (Math.random() * 5) + 's',
            }}
          />
        ))}

        {}
        {[...Array(6)].map((_, i) => (
          <div
            key={`bg-card-${i}`}
            className="absolute opacity-5 blur-[1px] animate-float pointer-events-none hidden lg:block"
            style={{
              left: `${(i * 20) % 100}%`,
              top: `${(i * 25) % 100}%`,
              animationDuration: `${15 + i * 2}s`,
              animationDelay: `${i * -3}s`,
              transform: `rotate(${i * 15}deg) scale(0.8)`,
            }}
          >
            <div className="w-48 h-64 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-white/10" />
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
        {}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full opacity-50"></div>
            <h1 className="relative text-4xl md:text-5xl font-outfit font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-400 inline-block mb-1 drop-shadow-lg">
              Trading Cards
            </h1>
            <p className="text-lg text-indigo-200/60 font-medium tracking-wide">
              Collectionnez les cartes des membres du serveur.
            </p>
          </div>
        </div>

        <PackOpenerClient
          initialInventory={inventory}
          initialBoxes={userBoxes}
          initialCoins={paraCoins}
          isLoggedIn={!!userId}
          allCards={allCards}
          serverPlayers={serverPlayers}
          currentUserMCName={currentUserMCName}
        />
      </div>
    </div>
  );
}