import { prisma } from './src/lib/db';

async function main() {
  const cards = await prisma.tradingCard.findMany({
    where: { title: 'Brillantesque' },
    include: {
      asVariantLinks: { include: { variantProfile: true } },
      motherLinks: { include: { variantProfile: true } }
    }
  });
  console.log(JSON.stringify(cards, null, 2));
}
main().catch(console.error).finally(() => process.exit(0));
