import { prisma } from "@/lib/db";
import HomePageClient from "@/components/home/HomePageClient";

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default async function Home() {
  const [usersCount, topicsCount, cardsCount] = await Promise.all([
    prisma.user.count({ where: { isMcVerified: true } }).catch(() => 0),
    prisma.topic.count().catch(() => 0),
    prisma.userCard.count().catch(() => 0)
  ]);

  const stats = {
    users: usersCount > 0 ? usersCount : "???",
    topics: topicsCount > 0 ? topicsCount : "∞",
    cards: cardsCount > 0 ? cardsCount : "0"
  };

  return <HomePageClient stats={stats} />;
}