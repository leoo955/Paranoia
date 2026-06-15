import ShopClient from "./ShopClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Boutique | PARANOIA",
};

export default async function ShopPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;
  
  let balance = 0;
  if (userId) {
    const economy = await prisma.userEconomy.findUnique({
      where: { userId }
    });
    balance = economy?.paraCoins || 0;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-outfit font-black text-white mb-4">Boutique <span className="text-[var(--color-accent-purple)]">PARANOIA</span></h1>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
          Obtenez des PARA Coins pour ouvrir des boosters et agrandir votre collection de cartes !
        </p>
      </div>

      <ShopClient initialBalance={balance} isLoggedIn={!!userId} />
    </div>
  );
}
