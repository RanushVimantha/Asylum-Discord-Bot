import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout (mute) from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to unmute')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unmuting')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Could not find that user in the server.', ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: '❌ I cannot unmute this user. Check role hierarchy.', ephemeral: true });
    }

    if (!member.communicationDisabledUntilTimestamp || member.communicationDisabledUntilTimestamp < Date.now()) {
      return interaction.reply({ content: '❌ That user is not currently muted.', ephemeral: true });
    }

    try {
      await member.timeout(null, reason); // Remove timeout
      await interaction.reply({
        content: `🔊 <@${member.id}> has been unmuted.\n📝 Reason: ${reason}`
      });
    } catch (err) {
      console.error('Unmute error:', err);
      await interaction.reply({ content: '❌ Failed to unmute the member.', ephemeral: true });
    }
  }
};
