// src/commands/moderation/purge.js
import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} from 'discord.js';
import { logModEvent } from '../../utils/logModEvent.js';

export default {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete up to 2000 messages from a text channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('How many messages to delete (max 2000)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(2000)
    )
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Target channel to delete messages from')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const channel = interaction.options.getChannel('channel');

    const MOD_ROLE_ID = '1392824426357067806';

    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({
        content: '🚫 You are not authorized to use this command. This action requires a moderator role.',
        ephemeral: true
      });
    }

    if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: `❌ I don’t have permission to manage messages in ${channel}.`,
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `🧹 Starting deletion of **${amount}** messages in ${channel}...`,
      ephemeral: true
    });

    let totalDeleted = 0;
    let lastMessageId;

    while (totalDeleted < amount) {
      const batchSize = Math.min(100, amount - totalDeleted);
      const fetchOptions = { limit: batchSize };

      if (lastMessageId) fetchOptions.before = lastMessageId;

      const messages = await channel.messages.fetch(fetchOptions);
      const filtered = messages.filter(m => (Date.now() - m.createdTimestamp) < 14 * 24 * 60 * 60 * 1000);

      if (filtered.size === 0) break;

      const deleted = await channel.bulkDelete(filtered, true);
      totalDeleted += deleted.size;

      if (deleted.size > 0) {
        lastMessageId = deleted.last()?.id;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    await interaction.editReply({
      content: `✅ Deleted **${totalDeleted}** messages in ${channel}.`
    });

    // ✅ Log purge action
    await logModEvent(interaction.guild, 'modAction', {
      action: 'Message Purge',
      moderator: interaction.user,
      reason: `Deleted ${totalDeleted} messages in #${channel.name}`
    });
  }
};
