import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { logModEvent } from '../../utils/logModEvent.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Could not find that user in this server.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: '❌ I cannot kick this member. Check role hierarchy.', ephemeral: true });
    }

    await member.kick(reason);

    await interaction.reply({
      content: `👢 <@${target.id}> has been kicked.\n📝 Reason: ${reason}`
    });

    await logModEvent(interaction.guild, 'modAction', {
      action: 'Kick',
      target,
      moderator: interaction.user,
      reason
    });
  }
};
