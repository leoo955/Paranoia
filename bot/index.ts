import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Interaction, ChannelType, PermissionsBitField, TextChannel, AttachmentBuilder } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import http from 'http';

// Load env from the Next.js project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function getUserByDiscordId(discordId: string) {
  let user = await prisma.user.findUnique({ where: { discordId } });
  if (user) return user;
  const account = await prisma.account.findFirst({
    where: { provider: 'discord', providerAccountId: discordId },
    include: { user: true }
  });
  return account?.user || null;
}
async function buildCardListMessage(discordId: string, page: number, targetDiscordId?: string) {
  const queryId = targetDiscordId || discordId;
  const user = await getUserByDiscordId(queryId);
  if (!user) return null;

  const inventory = await prisma.userCard.findMany({
    where: { userId: user.id },
    include: { tradingCard: { include: { player: true } } }
  });

  if (inventory.length === 0) {
    return { content: targetDiscordId ? 'Son inventaire est vide !' : 'Votre inventaire est vide ! Ouvrez des boosters sur le site.' };
  }

  const rarityOrder = ['MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'];
  inventory.sort((a, b) => {
    const rDiff = rarityOrder.indexOf(a.tradingCard.rarity) - rarityOrder.indexOf(b.tradingCard.rarity);
    if (rDiff !== 0) return rDiff;
    return a.tradingCard.title.localeCompare(b.tradingCard.title);
  });

  const totalPages = inventory.length;
  if (page < 0) page = 0;
  if (page >= totalPages) page = totalPages - 1;

  const currentItem = inventory[page];
  const shortUuid = currentItem.id.slice(-6);

  const colors: Record<string, number> = {
    'MYTHIC': 0xdc2626,
    'LEGENDARY': 0xfacc15,
    'EPIC': 0xa855f7,
    'RARE': 0x3b82f6,
    'UNCOMMON': 0x22c55e,
    'COMMON': 0x94a3b8
  };

  const embed = new EmbedBuilder()
    .setTitle(targetDiscordId ? `Catalogue de ${user.minecraftName || 'Joueur'}` : 'Votre Inventaire')
    .setColor(colors[currentItem.tradingCard.rarity] || 0x94a3b8)
    .setDescription(`**${currentItem.tradingCard.title}**\nRareté: ${currentItem.tradingCard.rarity}\nUUID: \`#${shortUuid}\``)
    .setFooter({ text: `Page ${page + 1}/${totalPages}` });

  let files: any[] = [];
  
  if (currentItem.tradingCard.renderedImageUrl) {
    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const imageUrl = currentItem.tradingCard.renderedImageUrl.startsWith('http') 
      ? currentItem.tradingCard.renderedImageUrl 
      : `${appUrl}${currentItem.tradingCard.renderedImageUrl}`;
    const timestamp = Date.now();
    embed.setImage(`${imageUrl}?v=${timestamp}`);
  } else {
    const timestamp = Date.now();
    const bgImage = currentItem.tradingCard.imageUrl || `https://render.crafty.gg/3d/bust/${currentItem.tradingCard.player?.minecraftName || 'Steve'}?v=${timestamp}`;
    embed.setImage(bgImage);
  }

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`card_prev_${discordId}_${page}_${targetDiscordId || ''}`)
      .setLabel('◀ Précédent')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 0),
    new ButtonBuilder()
      .setCustomId(`card_next_${discordId}_${page}_${targetDiscordId || ''}`)
      .setLabel('Suivant ▶')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === totalPages - 1)
  );

  return { embeds: [embed], components: [row], files };
}

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
    .setName('inv')
    .setDescription('Afficher votre collection de cartes'),
  new SlashCommandBuilder()
    .setName('flex')
    .setDescription('Afficher la meilleure carte de votre collection'),
  new SlashCommandBuilder()
    .setName('pc')
    .setDescription('Afficher votre nombre de Paracoins'),
  new SlashCommandBuilder()
    .setName('catalogue')
    .setDescription('Afficher le catalogue de cartes d\'un joueur')
    .addUserOption(option => 
      option.setName('joueur')
        .setDescription('Le joueur dont vous voulez voir le catalogue')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Configurer le panel de tickets (Admin uniquement)')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
];

client.once('ready', async () => {
  console.log(`Bot logged in as ${client.user?.tag}`);
  
  if (!client.user) return;

  const rest = new REST({ version: '10' }).setToken(token);
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(client.user.id),
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
      const user = await getUserByDiscordId(discordIdToSearch);

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
      
      const choices = inventory
        .filter(item => {
          const name = `${item.tradingCard.title} (${item.tradingCard.rarity})`;
          return name.toLowerCase().includes(search) || item.id.includes(search);
        })
        .slice(0, 25)
        .map(item => {
          const shortUuid = item.id.slice(-6);
          return {
            name: `[#${shortUuid}] ${item.tradingCard.title} (${item.tradingCard.rarity})`,
            value: item.id // The UserCard ID
          };
        });

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

        const proposer = await getUserByDiscordId(interaction.user.id);
        const receiver = await getUserByDiscordId(targetUser.id);

        if (!proposer) return await interaction.reply({ content: 'Vous n\'êtes pas enregistré sur Paranoia.', ephemeral: true });
        if (!receiver) return await interaction.reply({ content: 'Ce joueur n\'est pas enregistré sur Paranoia.', ephemeral: true });

        // Check if proposer actually has the offered card instance
        const proposerCard = await prisma.userCard.findFirst({
          where: { id: offeredCardId, userId: proposer.id },
          include: { tradingCard: true }
        });

        if (!proposerCard) {
          return await interaction.reply({ content: 'Vous ne possédez pas ou plus la carte que vous proposez !', ephemeral: true });
        }

        // Check if receiver actually has the requested card instance
        const receiverCard = await prisma.userCard.findFirst({
          where: { id: requestedCardId, userId: receiver.id },
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

    if (interaction.commandName === 'inv') {
      try {
        const messageOptions = await buildCardListMessage(interaction.user.id, 0);
        if (!messageOptions) {
          return await interaction.reply({ content: "Vous n'êtes pas enregistré sur Paranoia.", ephemeral: true });
        }
        await interaction.reply(messageOptions);
      } catch (error) {
        console.error("inv command error:", error);
        await interaction.reply({ content: "Une erreur est survenue.", ephemeral: true });
      }
    }

    if (interaction.commandName === 'catalogue') {
      try {
        const targetUser = interaction.options.getUser('joueur');
        if (!targetUser) return await interaction.reply({ content: 'Paramètre manquant.', ephemeral: true });

        const messageOptions = await buildCardListMessage(interaction.user.id, 0, targetUser.id);
        if (!messageOptions) {
          return await interaction.reply({ content: "Ce joueur n'est pas enregistré sur Paranoia.", ephemeral: true });
        }
        await interaction.reply(messageOptions);
      } catch (error) {
        console.error("catalogue command error:", error);
        await interaction.reply({ content: "Une erreur est survenue.", ephemeral: true });
      }
    }

    if (interaction.commandName === 'pc') {
      try {
        const user = await getUserByDiscordId(interaction.user.id);
        if (!user) return await interaction.reply({ content: "Vous n'êtes pas enregistré sur Paranoia.", ephemeral: true });

        const embed = new EmbedBuilder()
          .setTitle('💰 Solde ParaCoins')
          .setColor('#fbbf24')
          .setDescription(`Vous avez actuellement **${user.paraCoins} ParaCoins** (PC).`);
        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error("pc command error:", error);
        await interaction.reply({ content: "Une erreur est survenue.", ephemeral: true });
      }
    }

    if (interaction.commandName === 'flex') {
      try {
        const user = await getUserByDiscordId(interaction.user.id);
        if (!user) return await interaction.reply({ content: "Vous n'êtes pas enregistré sur Paranoia.", ephemeral: true });

        const inventory = await prisma.userCard.findMany({
          where: { userId: user.id },
          include: { tradingCard: { include: { player: true } } }
        });

        if (inventory.length === 0) {
          return await interaction.reply({ content: 'Votre inventaire est vide !' });
        }

        const rarityOrder = ['MYTHIC', 'LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'];
        inventory.sort((a, b) => {
          const rDiff = rarityOrder.indexOf(a.tradingCard.rarity) - rarityOrder.indexOf(b.tradingCard.rarity);
          if (rDiff !== 0) return rDiff;
          return a.tradingCard.proba - b.tradingCard.proba; // Lowest proba is best
        });

        const bestItem = inventory[0];
        const shortUuid = bestItem.id.slice(-6);

        const colors: Record<string, number> = {
          'MYTHIC': 0xdc2626,
          'LEGENDARY': 0xfacc15,
          'EPIC': 0xa855f7,
          'RARE': 0x3b82f6,
          'UNCOMMON': 0x22c55e,
          'COMMON': 0x94a3b8
        };

        const embed = new EmbedBuilder()
          .setTitle(`👑 Flex Time !`)
          .setColor(colors[bestItem.tradingCard.rarity] || 0x94a3b8)
          .setDescription(`<@${interaction.user.id}> flex avec sa meilleure carte :\n**${bestItem.tradingCard.title}** (${bestItem.tradingCard.rarity})\nUUID: \`#${shortUuid}\``);

        if (bestItem.tradingCard.renderedImageUrl) {
          const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          const imageUrl = bestItem.tradingCard.renderedImageUrl.startsWith('http') 
            ? bestItem.tradingCard.renderedImageUrl 
            : `${appUrl}${bestItem.tradingCard.renderedImageUrl}`;
          embed.setImage(`${imageUrl}?v=${Date.now()}`);
        } else {
          const bgImage = bestItem.tradingCard.imageUrl || `https://render.crafty.gg/3d/bust/${bestItem.tradingCard.player?.minecraftName || 'Steve'}?v=${Date.now()}`;
          embed.setImage(bgImage);
        }

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error("flex command error:", error);
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
        const channel = interaction.channel;
        if (channel && 'send' in channel) {
          await (channel as any).send({ embeds: [embed], components: [row] });
        }
      } catch (error) {
        console.error("Ticket setup error:", error);
        await interaction.reply({ content: "Erreur lors de la création du panel.", ephemeral: true });
      }
    }
  }

  if (interaction.isButton()) {
    try {
      if (interaction.customId.startsWith('card_prev_') || interaction.customId.startsWith('card_next_')) {
        const parts = interaction.customId.split('_');
        const direction = parts[1]; // prev or next
        const discordId = parts[2];
        const currentPage = parseInt(parts[3], 10);

        if (interaction.user.id !== discordId) {
          return await interaction.reply({ content: 'Vous ne pouvez pas naviguer dans l\'inventaire d\'un autre joueur !', ephemeral: true });
        }

        const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
        const messageOptions = await buildCardListMessage(discordId, newPage);
        
        if (messageOptions) {
          await interaction.update(messageOptions);
        }
        return;
      }

      if (interaction.customId.startsWith('trade_')) {
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

// Simple HTTP server for keepalive (UptimeRobot, Render Web Service, etc.)
const port = process.env.PORT || 3001;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is alive!\n');
});

server.listen(port, () => {
  console.log(`Keepalive server is running on port ${port}`);
});
