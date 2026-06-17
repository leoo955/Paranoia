const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const account = await prisma.account.findFirst({
    where: { providerAccountId: "1417148856646242387" }
  });

  if (account) {
    await prisma.user.update({
      where: { id: account.userId },
      data: { role: "ADMIN" }
    });
    console.log("SUCCES: Utilisateur mis à jour en ADMIN.");
  } else {
    console.log("ERREUR: Aucun compte Discord avec cet ID n'a été trouvé dans la base de données. L'utilisateur s'est-il bien connecté au moins une fois ?");
  }
}

main().finally(() => prisma.$disconnect());
