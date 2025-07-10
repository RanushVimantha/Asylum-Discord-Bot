// src/commands/moderation/lock.js
import {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits
} from 'discord.js';
import { logModEvent } from '../../utils/logModEvent.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a text or voice channel for @everyone')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to lock')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for locking')
        .setRequired(false)
    ),

  async execute(interaction) {
    const MOD_ROLE_ID = '1392824426357067806'; // 🔧 Replace with your mod role ID

    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const perms = channel.type === ChannelType.GuildVoice
      ? { Connect: false }
      : { SendMessages: false };

    try {
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, perms);

      await interaction.reply(`🔒 Locked <#${channel.id}> (${channel.type === ChannelType.GuildVoice ? 'voice' : 'text'} channel).\n📝 Reason: ${reason}`);

      // ✅ Log moderation action
      await logModEvent(interaction.guild, 'modAction', {
        action: 'Lock Channel',
        channel: channel,
        moderator: interaction.user,
        reason
      });

    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to lock the channel.', ephemeral: true });
    }
  }
};
