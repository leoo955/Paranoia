const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const cards = await prisma.userCard.findMany({
      take: 1,
      include: {
        tradingCard: {
          include: { player: true }
        }
      }
    });
    console.log("Success:", cards.length);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
