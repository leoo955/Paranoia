const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const cards = await prisma.userCard.findMany({
      include: {
        tradingCard: true
      }
    });
    const nullCards = cards.filter(c => !c.tradingCard);
    console.log("Null trading cards:", nullCards.length);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
