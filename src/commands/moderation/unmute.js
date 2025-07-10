import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { logModEvent } from '../utils/logModEvent.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout (mute) from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('target').setDescription('User to unmute').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for unmuting').setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Could not find that user.', ephemeral: true });
    if (!member.moderatable) return interaction.reply({ content: '❌ I cannot unmute this user.', ephemeral: true });

    const timeoutActive = member.communicationDisabledUntilTimestamp > Date.now();
    if (!timeoutActive) return interaction.reply({ content: '❌ That user is not currently muted.', ephemeral: true });

    await member.timeout(null, reason);
    await interaction.reply({ content: `🔊 <@${member.id}> has been unmuted.\n📝 Reason: ${reason}` });

    await logModEvent(interaction.guild, 'modAction', {
      action: 'Unmute',
      target: targetUser,
      moderator: interaction.user,
      reason
    });
  }
};
