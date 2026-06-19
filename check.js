const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const c = await prisma.tradingCard.findFirst({
    where: { title: 'Brillantesque' },
    include: {
      asVariantLinks: { include: { variantProfile: true } },
      motherLinks: { include: { variantProfile: true } }
    }
  });
  console.log(JSON.stringify(c, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
