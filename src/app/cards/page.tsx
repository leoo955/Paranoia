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
  let paraCoins = 0;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { paraCoins: true }
    });
    paraCoins = user?.paraCoins || 0;

    inventory = await prisma.userCard.findMany({
      where: { userId },
      select: {
        id: true,
        obtainedAt: true,
        tradingCard: {
          select: {
            id: true,
            title: true,
            rarity: true,
            renderedImageUrl: true,
            imageUrl: true,
            proba: true,
            player: {
              select: { minecraftName: true }
            }
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
    select: {
      id: true,
      title: true,
      rarity: true,
      renderedImageUrl: true,
      imageUrl: true,
      proba: true,
      player: {
        select: { minecraftName: true }
      }
    },
    orderBy: { rarity: 'desc' }
  });

  const allUsers = await prisma.user.findMany({
    select: { minecraftName: true, id: true }
  });
  
  const serverPlayers = allUsers
    .map(u => u.minecraftName)
    .filter(Boolean) as string[];

  // Find current user's minecraftName
  const currentUserMCName = allUsers.find(u => u.id === userId)?.minecraftName || "";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] max-w-6xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0a0a0f]/0 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10 animate-slide-up">
        
        {/* Page Header */}
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
