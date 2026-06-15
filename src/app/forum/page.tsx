import { prisma } from "@/lib/db";
import TopicCard from "@/components/forum/TopicCard";
import ForumFilters from "@/components/forum/ForumFilters";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Forum | PARANOIA",
  description: "Discutez avec la communauté du serveur PARANOIA SMP.",
};

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const q = params.q;
  
  const where = {
    ...(category && category !== "all" ? { category: { equals: category } } : {}),
    ...(q ? { title: { contains: q } } : {}),
  };

  const topics = await prisma.topic.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      _count: { select: { comments: true } }
    },
    take: 20,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white inline-block mb-2 text-gradient">Forum de la Communauté</h1>
          <p className="text-[var(--color-text-secondary)]">Discussions, annonces, alliances et règlements.</p>
        </div>
        <Link href="/forum/new" className="btn-primary flex items-center gap-2">
          <MessageSquarePlus className="w-5 h-5" />
          <span>Amet Consectetur</span>
        </Link>
      </div>

      <Suspense fallback={<div className="mb-8 text-[var(--color-text-muted)]">Chargement des filtres...</div>}>
        <ForumFilters />
      </Suspense>

      <div className="space-y-4">
        {topics.length > 0 ? (
          topics.map(topic => <TopicCard key={topic.id} topic={topic} />)
        ) : (
          <div className="panel-matte p-12 rounded-2xl text-center border-dashed">
            <div className="w-16 h-16 mx-auto bg-[var(--color-bg-elevated)] rounded-full flex items-center justify-center mb-4">
              <MessageSquarePlus className="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 font-outfit">Aucun sujet trouvé</h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {q ? "Aucun résultat pour cette recherche." : "Il n'y a pas encore de sujet dans cette catégorie. Soyez le premier !"}
            </p>
            <Link href="/forum/new" className="btn-secondary inline-block">
              Créer un sujet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
