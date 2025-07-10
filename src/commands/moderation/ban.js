import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { logModEvent } from '#utils/logModEvent.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt =>
      opt.setName('target').setDescription('The member to ban').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the ban').setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ User not found.', ephemeral: true });
    if (!member.bannable) return interaction.reply({ content: '❌ I cannot ban this user.', ephemeral: true });

    await member.ban({ reason });
    await interaction.reply({ content: `🔨 <@${target.id}> has been banned.\n📝 Reason: ${reason}` });

    await logModEvent(interaction.guild, 'modAction', {
      action: 'Ban',
      target,
      moderator: interaction.user,
      reason
    });
  }
};
