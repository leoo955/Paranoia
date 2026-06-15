import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction, ChannelType, PermissionsBitField, TextChannel } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from the Next.js project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  console.error("Missing DISCORD_TOKEN or DISCORD_CLIENT_ID in .env");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('trade')
    .setDescription('Échanger une carte avec un autre joueur')
    .addUserOption(option => 
      option.setName('utilisateur')
        .setDescription('Le joueur avec qui vous voulez échanger')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('carte_offerte')
        .setDescription('La carte que vous offrez (tapez pour chercher)')
        .setAutocomplete(true)
        .setRequired(true))
    .addStringOption(option => 
      option.setName('carte_demandée')
        .setDescription('La carte que vous demandez (tapez pour chercher)')
        .setAutocomplete(true)
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('card')
    .setDescription('Commandes relatives aux cartes')
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('Afficher votre inventaire de cartes (pour flex)')
    ),
  new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Configurer le panel de tickets (Admin uniquement)')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
];

client.once('ready', async () => {
  console.log(`Bot logged in as ${client.user?.tag}`);
  
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isAutocomplete()) {
    try {
      const focusedOption = interaction.options.getFocused(true);
      
      let discordIdToSearch = '';
      if (focusedOption.name === 'carte_offerte') {
        discordIdToSearch = interaction.user.id;
      } else if (focusedOption.name === 'carte_demandée') {
        const targetUser = interaction.options.get('utilisateur')?.value as string;
        if (!targetUser) return await interaction.respond([]);
        discordIdToSearch = targetUser;
      }

      if (!discordIdToSearch) return await interaction.respond([]);

      // Fetch user from DB
      const user = await prisma.user.findUnique({
        where: { discordId: discordIdToSearch }
      });

      if (!user) {
        return await interaction.respond([]);
      }

      // Fetch inventory
      const inventory = await prisma.userCard.findMany({
        where: { userId: user.id },
        include: { tradingCard: { include: { player: true } } }
      });

      // Filter based on input
      const search = focusedOption.value.toLowerCase();
      
      // Group by card to avoid duplicates if they have multiple of the same
      const uniqueCards = new Map();
      for (const item of inventory) {
        const c = item.tradingCard;
        const name = `${c.title} (${c.rarity})`;
        if (!uniqueCards.has(c.id)) {
          uniqueCards.set(c.id, { id: c.id, name, count: 1 });
        } else {
          uniqueCards.get(c.id).count++;
        }
      }

      const choices = Array.from(uniqueCards.values())
        .filter(c => c.name.toLowerCase().includes(search))
        .slice(0, 25)
        .map(c => ({
          name: `${c.name} (x${c.count})`,
          value: c.id // The tradingCardId
        }));

      await interaction.respond(choices);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  }

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'trade') {
      try {
        const targetUser = interaction.options.getUser('utilisateur');
        const offeredCardId = interaction.options.getString('carte_offerte');
        const requestedCardId = interaction.options.getString('carte_demandée');

        if (!targetUser || !offeredCardId || !requestedCardId) {
          return await interaction.reply({ content: 'Paramètres manquants.', ephemeral: true });
        }

        if (targetUser.id === interaction.user.id) {
          return await interaction.reply({ content: 'Vous ne pouvez pas échanger avec vous-même !', ephemeral: true });
        }

        const proposer = await prisma.user.findUnique({ where: { discordId: interaction.user.id } });
        const receiver = await prisma.user.findUnique({ where: { discordId: targetUser.id } });

        if (!proposer) return await interaction.reply({ content: 'Vous n\'êtes pas enregistré sur Paranoia.', ephemeral: true });
        if (!receiver) return await interaction.reply({ content: 'Ce joueur n\'est pas enregistré sur Paranoia.', ephemeral: true });

        // Check if proposer actually has the offered card
        const proposerCard = await prisma.userCard.findFirst({
          where: { userId: proposer.id, tradingCardId: offeredCardId },
          include: { tradingCard: true }
        });

        if (!proposerCard) {
          return await interaction.reply({ content: 'Vous ne possédez pas ou plus la carte que vous proposez !', ephemeral: true });
        }

        // Check if receiver actually has the requested card
        const receiverCard = await prisma.userCard.findFirst({
          where: { userId: receiver.id, tradingCardId: requestedCardId },
          include: { tradingCard: true }
        });

        if (!receiverCard) {
          return await interaction.reply({ content: 'Le joueur ciblé ne possède pas ou plus la carte que vous demandez !', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setTitle('Proposition d\'échange')
          .setColor('#a855f7')
          .setDescription(`<@${interaction.user.id}> propose un échange à <@${targetUser.id}> !`)
          .addFields(
            { name: 'Il/Elle offre :', value: `${proposerCard.tradingCard.title} (${proposerCard.tradingCard.rarity})`, inline: true },
            { name: 'Il/Elle demande :', value: `${receiverCard.tradingCard.title} (${receiverCard.tradingCard.rarity})`, inline: true }
          );

        const row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`trade_accept_${proposer.id}_${receiver.id}_${proposerCard.id}_${receiverCard.id}`)
              .setLabel('Accepter')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`trade_decline_${proposer.id}_${receiver.id}`)
              .setLabel('Refuser')
              .setStyle(ButtonStyle.Danger)
          );

        await interaction.reply({
          content: `<@${targetUser.id}>, vous avez une proposition de trade !`,
          embeds: [embed],
          components: [row]
        });

      } catch (error) {
        console.error("Trade command error:", error);
        await interaction.reply({ content: "Une erreur est survenue.", ephemeral: true });
      }
    }

    if (interaction.commandName === 'card') {
      try {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'list') {
          const user = await prisma.user.findUnique({ where: { discordId: interaction.user.id } });
          if (!user) return await interaction.reply({ content: "Vous n'êtes pas enregistré sur Paranoia.", ephemeral: true });

          const inventory = await prisma.userCard.findMany({
            where: { userId: user.id },
            include: { tradingCard: true }
          });

          if (inventory.length === 0) {
            return await interaction.reply({ content: 'Votre inventaire est vide ! Ouvrez des boosters sur le site.', ephemeral: true });
          }

          const rarityGroups: Record<string, any[]> = {
            'MYTHIC': [],
            'LEGENDARY': [],
            'EPIC': [],
            'RARE': [],
            'UNCOMMON': [],
            'COMMON': []
          };

          const cardCounts = new Map();
          for (const item of inventory) {
            const c = item.tradingCard;
            if (!cardCounts.has(c.id)) {
              cardCounts.set(c.id, { card: c, count: 1 });
            } else {
              cardCounts.get(c.id).count++;
            }
          }

          for (const { card, count } of cardCounts.values()) {
            if (rarityGroups[card.rarity]) {
              rarityGroups[card.rarity].push(`**${card.title}** (x${count})`);
            } else {
              if (!rarityGroups['AUTRE']) rarityGroups['AUTRE'] = [];
              rarityGroups['AUTRE'].push(`**${card.title}** (x${count})`);
            }
          }

          const embed = new EmbedBuilder()
            .setTitle(`Collection de ${interaction.user.username} 🏆`)
            .setColor('#facc15')
            .setDescription(`Total : **${inventory.length}** cartes`);

          for (const [rarity, cards] of Object.entries(rarityGroups)) {
            if (cards.length > 0) {
              let text = cards.join(', ');
              if (text.length > 1020) text = text.slice(0, 1000) + '...';
              embed.addFields({ name: `${rarity} (${cards.length} modèles)`, value: text });
            }
          }

          await interaction.reply({ embeds: [embed] });
        }
      } catch (error) {
        console.error("Card command error:", error);
        await interaction.reply({ content: "Une erreur est survenue.", ephemeral: true });
      }
    }

    if (interaction.commandName === 'ticket-setup') {
      try {
        const embed = new EmbedBuilder()
          .setTitle('🛒 Boutique & Checkout')
          .setColor('#6366f1')
          .setDescription('Pour acheter des **ParaCoins**, ouvrez un ticket ci-dessous.\n\nUn membre du staff vous prendra en charge pour procéder au paiement (PayPal, etc.) et vous créditer vos ParaCoins directement en jeu et sur le site.')
          .addFields(
            { name: 'Prix des Boosters', value: '- Standard: 500 PC\n- Premium: 1200 PC\n- Mythique: 2500 PC' }
          );

        const row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('open_checkout_ticket')
              .setLabel('Ouvrir un ticket Checkout')
              .setEmoji('🛒')
              .setStyle(ButtonStyle.Primary)
          );

        await interaction.reply({ content: 'Panel créé avec succès !', ephemeral: true });
        if (interaction.channel?.isTextBased()) {
          await interaction.channel.send({ embeds: [embed], components: [row] });
        }
      } catch (error) {
        console.error("Ticket setup error:", error);
        await interaction.reply({ content: "Erreur lors de la création du panel.", ephemeral: true });
      }
    }
  }

  if (interaction.isButton()) {
    try {
      if (interaction.customId.startsWith('trade_')) {
        const parts = interaction.customId.split('_');
        const action = parts[1]; // accept or decline
        const proposerId = parts[2];
        const receiverId = parts[3];
        const proposerCardId = parts[4]; // userCard id (uuid)
        const receiverCardId = parts[5]; // userCard id (uuid)

        // Find the discord ID of the receiver to make sure only they can click
        const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
        if (!receiver || receiver.discordId !== interaction.user.id) {
          return await interaction.reply({ content: 'Ce bouton ne vous est pas destiné !', ephemeral: true });
        }

        if (action === 'decline') {
          const embed = new EmbedBuilder()
            .setTitle('Échange annulé')
            .setColor('#dc2626')
            .setDescription(`<@${interaction.user.id}> a refusé l'échange.`);
            
          return await interaction.update({ embeds: [embed], components: [], content: '' });
        }

        if (action === 'accept') {
          // Verify both cards still exist and belong to their respective owners
          const pCard = await prisma.userCard.findFirst({ where: { id: proposerCardId, userId: proposerId }, include: { tradingCard: true } });
          const rCard = await prisma.userCard.findFirst({ where: { id: receiverCardId, userId: receiverId }, include: { tradingCard: true } });

          if (!pCard || !rCard) {
            return await interaction.reply({ content: 'Une des cartes n\'est plus disponible (déjà échangée ?).', ephemeral: true });
          }

          // Swap
          await prisma.$transaction([
            prisma.userCard.update({
              where: { id: pCard.id },
              data: { userId: receiverId }
            }),
            prisma.userCard.update({
              where: { id: rCard.id },
              data: { userId: proposerId }
            })
          ]);

          const embed = new EmbedBuilder()
            .setTitle('Échange réussi ! 🎉')
            .setColor('#22c55e')
            .setDescription('Les cartes ont été transférées avec succès dans vos inventaires respectifs.')
            .addFields(
              { name: 'Nouveau propriétaire :', value: `La carte ${pCard.tradingCard.title} appartient maintenant à <@${interaction.user.id}>.` },
              { name: 'Nouveau propriétaire :', value: `La carte ${rCard.tradingCard.title} appartient maintenant au proposeur.` }
            );

          await interaction.update({ embeds: [embed], components: [], content: '' });
        }
      } else if (interaction.customId === 'open_checkout_ticket') {
        const guild = interaction.guild;
        if (!guild) return await interaction.reply({ content: 'Ce bouton ne peut être utilisé que sur un serveur.', ephemeral: true });

        const ticketName = `checkout-${interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        
        // Vérifier si le joueur a déjà un ticket de ce nom
        const existingChannel = guild.channels.cache.find(c => c.name === ticketName);
        if (existingChannel) {
          return await interaction.reply({ content: `Vous avez déjà un ticket ouvert : <#${existingChannel.id}>`, ephemeral: true });
        }

        const channel = await guild.channels.create({
          name: ticketName,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: guild.id, // @everyone
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
            },
            {
              id: client.user!.id,
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageChannels],
            }
          ],
        });

        const embed = new EmbedBuilder()
          .setTitle('Ticket Checkout')
          .setColor('#6366f1')
          .setDescription(`Bienvenue <@${interaction.user.id}> !\n\nMerci de préciser le nombre de **ParaCoins** que vous souhaitez acheter.\nUn administrateur vous transmettra les informations de paiement (PayPal, etc.).`);

        const row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('close_ticket')
              .setLabel('Fermer le ticket')
              .setEmoji('🔒')
              .setStyle(ButtonStyle.Danger)
          );

        await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });
        await interaction.reply({ content: `Votre ticket a été créé : <#${channel.id}>`, ephemeral: true });

      } else if (interaction.customId === 'close_ticket') {
        const channel = interaction.channel as TextChannel;
        if (channel) {
          await interaction.reply({ content: 'Fermeture du ticket dans 5 secondes...' });
          setTimeout(async () => {
            try {
              await channel.delete();
            } catch (e) {
              console.error("Erreur lors de la suppression du salon:", e);
            }
          }, 5000);
        }
      }
    } catch (error) {
      console.error("Button error:", error);
      await interaction.reply({ content: "Une erreur est survenue lors de l'échange.", ephemeral: true });
    }
  }
});

client.login(token);
