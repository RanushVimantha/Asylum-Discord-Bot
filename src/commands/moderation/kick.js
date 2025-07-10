import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { logModEvent } from '#utils/logModEvent.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(opt =>
      opt.setName('target').setDescription('The member to kick').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the kick').setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    if (!member.kickable) return interaction.reply({ content: '❌ I cannot kick this user.', ephemeral: true });

    await member.kick(reason);
    await interaction.reply({ content: `👢 <@${target.id}> has been kicked.\n📝 Reason: ${reason}` });

    await logModEvent(interaction.guild, 'modAction', {
      action: 'Kick',
      target,
      moderator: interaction.user,
      reason
    });
  }
};
