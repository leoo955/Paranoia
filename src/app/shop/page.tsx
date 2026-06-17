import ShopClient from "./ShopClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Boutique | PARANOIA",
};

export default async function ShopPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  let balance = 0;
  if (userId) {
    const userDB = await prisma.user.findUnique({
      where: { id: userId },
      select: { paraCoins: true }
    });
    balance = userDB?.paraCoins || 0;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up relative">
      {}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[var(--color-accent-purple)] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="text-center mb-20 relative z-10">
        <h1 className="text-5xl md:text-7xl font-outfit font-black text-white mb-6 drop-shadow-2xl">
          Boutique <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600 animate-pulse-glow">PARANOIA</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-xl max-w-2xl mx-auto font-medium">
          Obtenez des PARA Coins pour ouvrir des boosters exclusifs et dominer la collection de cartes.
        </p>
      </div>

      <ShopClient initialBalance={balance} isLoggedIn={!!userId} />
    </div>
  );
}