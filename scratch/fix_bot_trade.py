import re

with open("bot/index.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace button generation
old_buttons = """          .addComponents(
            new ButtonBuilder()
              .setCustomId(`trade_accept_${proposer.id}_${receiver.id}_${proposerCard.id}_${receiverCard.id}`)
              .setLabel('Accepter')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`trade_decline_${proposer.id}_${receiver.id}`)
              .setLabel('Refuser')
              .setStyle(ButtonStyle.Danger)
          );"""

new_buttons = """          .addComponents(
            new ButtonBuilder()
              .setCustomId(`trade_accept_${proposerCard.id}_${receiverCard.id}`)
              .setLabel('Accepter')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`trade_decline_${proposerCard.id}_${receiverCard.id}`)
              .setLabel('Refuser')
              .setStyle(ButtonStyle.Danger)
          );"""

content = content.replace(old_buttons, new_buttons)

# Replace interaction handler
old_handler = """      if (interaction.customId.startsWith('trade_')) {
        const parts = interaction.customId.split('_');
        const action = parts[1]; // accept or decline
        const proposerId = parts[2];
        const receiverId = parts[3];
        const proposerCardId = parts[4]; // userCard id (uuid)
        const receiverCardId = parts[5]; // userCard id (uuid)

        // Check if the person clicking is the intended receiver
        const currentUser = await getUserByDiscordId(interaction.user.id);
        if (!currentUser || currentUser.id !== receiverId) {
          return await interaction.reply({ content: 'Ce bouton ne vous est pas destiné !', ephemeral: true });
        }"""

new_handler = """      if (interaction.customId.startsWith('trade_')) {
        const parts = interaction.customId.split('_');
        const action = parts[1]; // accept or decline
        const proposerCardId = parts[2];
        const receiverCardId = parts[3];

        // Fetch cards to find owners
        const rCard = await prisma.userCard.findUnique({ where: { id: receiverCardId }, include: { tradingCard: true } });
        const pCard = await prisma.userCard.findUnique({ where: { id: proposerCardId }, include: { tradingCard: true } });

        if (!rCard || !pCard) {
            return await interaction.reply({ content: "Une des cartes n'est plus disponible (déjà échangée ?).", ephemeral: true });
        }

        const receiverId = rCard.userId;
        const proposerId = pCard.userId;

        // Check if the person clicking is the intended receiver
        const currentUser = await getUserByDiscordId(interaction.user.id);
        if (!currentUser || currentUser.id !== receiverId) {
          return await interaction.reply({ content: 'Ce bouton ne vous est pas destiné !', ephemeral: true });
        }"""

content = content.replace(old_handler, new_handler)

# Then we need to fix the lines in the `accept` branch:
old_accept_branch = """        if (action === 'accept') {
          // Verify both cards still exist and belong to their respective owners
          const pCard = await prisma.userCard.findFirst({ where: { id: proposerCardId, userId: proposerId }, include: { tradingCard: true } });
          const rCard = await prisma.userCard.findFirst({ where: { id: receiverCardId, userId: receiverId }, include: { tradingCard: true } });

          if (!pCard || !rCard) {
            return await interaction.reply({ content: 'Une des cartes n\\'est plus disponible (déjà échangée ?).', ephemeral: true });
          }"""

new_accept_branch = """        if (action === 'accept') {
          // Cards already verified above"""

content = content.replace(old_accept_branch, new_accept_branch)

# Also fix the decline branch so it doesn't use `proposerId` without fetching it? Wait, my new_handler sets `proposerId`!
# Let's check old_handler replacements.

with open("bot/index.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Bot code updated!")
