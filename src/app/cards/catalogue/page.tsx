import Link from "next/link";
import { ArrowLeft, Lock, Layers } from "lucide-react";
import { prisma } from "@/lib/db";
import CardDisplay from "@/components/cards/CardDisplay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const revalidate = 0;

export const metadata = {
  title: "Catalogue complet | PARANOIA",
};

export default async function CataloguePage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;

  const allCards = await prisma.tradingCard.findMany({
    where: { isPublished: true },
    include: { player: true },
    orderBy: { rarity: 'desc' }
  });

  let ownedCardIds = new Set<string>();
  if (userId) {
    const userCards = await prisma.userCard.findMany({
      where: { userId },
      select: { tradingCardId: true }
    });
    userCards.forEach(c => ownedCardIds.add(c.tradingCardId));
  }

  const editions = Array.from(new Set(allCards.map(c => c.edition || 'Standard'))).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white inline-block mb-2">Catalogue Complet</h1>
          <p className="text-[var(--color-text-secondary)]">Toutes les cartes disponibles sur le serveur, triées par Édition.</p>
        </div>
        <Link 
          href="/cards" 
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux Trading Cards
        </Link>
      </div>

      <div className="flex flex-col gap-16">
        {editions.map(edition => {
          const cardsOfEdition = allCards.filter(c => (c.edition || 'Standard') === edition);
          if (cardsOfEdition.length === 0) return null;

          return (
            <div key={edition}>
              <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <Layers className="text-indigo-500 w-8 h-8" />
                Édition: {edition}
                <span className="text-sm font-normal text-[var(--color-text-secondary)] bg-white/5 px-3 py-1 rounded-full ml-4 border border-white/10">
                  {cardsOfEdition.filter(c => ownedCardIds.has(c.id)).length} / {cardsOfEdition.length} possédées
                </span>
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {cardsOfEdition.map(card => {
                  const isOwned = ownedCardIds.has(card.id);
                  return (
                    <div key={card.id} className={`relative group perspective-1000 ${!isOwned ? 'opacity-50 grayscale hover:grayscale-0 transition-all duration-500' : ''}`}>
                      <div className="transition-all duration-500 transform-style-3d group-hover:scale-105 group-hover:-translate-y-4 group-hover:shadow-[0_20px_30px_rgba(0,0,0,0.5)] rounded-xl">
                        <CardDisplay card={card as any} size="md" />
                        {!isOwned && (
                          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                            <Lock className="w-10 h-10 text-white/50" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {allCards.length === 0 && (
          <div className="text-center py-20 text-[var(--color-text-secondary)]">
            Aucune carte n'a encore été publiée.
          </div>
        )}
      </div>
    </div>
  );
}
