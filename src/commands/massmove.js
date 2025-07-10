// src/commands/moderation/massmove.js
import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { logModEvent } from '../../utils/logModEvent.js';

export default {
  data: new SlashCommandBuilder()
    .setName('massmove')
    .setDescription('Move all users from one voice channel to another')
    .addChannelOption(option =>
      option.setName('from')
        .setDescription('The voice channel to move users from')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    )
    .addChannelOption(option =>
      option.setName('to')
        .setDescription('The voice channel to move users to')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    ),

  async execute(interaction) {
    const MOD_ROLE_ID = '1392824426357067806';

    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({
        content: '🚫 You are not authorized to use this command. This action requires a moderator role.',
        ephemeral: true
      });
    }

    const fromChannel = interaction.options.getChannel('from');
    const toChannel = interaction.options.getChannel('to');

    if (fromChannel.id === toChannel.id) {
      return interaction.reply({ content: '❌ You cannot move users to the same channel.', ephemeral: true });
    }

    const membersToMove = fromChannel.members;

    if (membersToMove.size === 0) {
      return interaction.reply({ content: `⚠️ No users are in ${fromChannel.name}.`, ephemeral: true });
    }

    for (const [, member] of membersToMove) {
      try {
        await member.voice.setChannel(toChannel);
      } catch (err) {
        console.error(`Failed to move ${member.user.tag}:`, err);
      }
    }

    await interaction.reply({
      content: `✅ Moved **${membersToMove.size}** users from **${fromChannel.name}** to **${toChannel.name}**.`,
      ephemeral: true
    });

    // ✅ Log the mass move
    await logModEvent(interaction.guild, 'modAction', {
      action: 'Mass Move',
      moderator: interaction.user,
      reason: `Moved ${membersToMove.size} users from ${fromChannel.name} to ${toChannel.name}`
    });
  }
};
