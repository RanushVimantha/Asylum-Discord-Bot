import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { logModEvent } from '#utils/logModEvent.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a text or voice channel for @everyone')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to unlock')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unlocking')
        .setRequired(false)
    ),

  async execute(interaction) {
    const MOD_ROLE_ID = '1392824426357067806'; // Replace with your actual mod role ID

    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({
        content: '❌ You do not have permission to use this command.',
        ephemeral: true
      });
    }

    const channel = interaction.options.getChannel('channel');
    const reason = interaction.options.getString('reason') || 'Manual unlock';

    const perms = channel.type === ChannelType.GuildVoice
      ? { Connect: null }
      : { SendMessages: null };

    try {
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, perms);

      await interaction.reply(
        `🔓 Unlocked <#${channel.id}> (${channel.type === ChannelType.GuildVoice ? 'voice' : 'text'} channel).\n📝 Reason: ${reason}`
      );

      // ✅ Log to modAction channel
      await logModEvent(interaction.guild, 'modAction', {
        action: 'Unlock Channel',
        moderator: interaction.user,
        reason: `Unlocked ${channel.name}: ${reason}`
      });

    } catch (err) {
      console.error('Unlock error:', err);
      await interaction.reply({ content: '❌ Failed to unlock the channel.', ephemeral: true });
    }
  }
};
