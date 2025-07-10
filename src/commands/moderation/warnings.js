import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Warning from '../../models/warnSchema.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The member to check')
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');

    const data = await Warning.findOne({
      guildId: interaction.guild.id,
      userId: target.id
    });

    if (!data || data.warnings.length === 0) {
      return interaction.reply({ content: `✅ <@${target.id}> has no warnings.`, ephemeral: true });
    }

    const warningList = data.warnings.map((warn, index) => {
      const date = new Date(warn.date).toLocaleString();
      return `**${index + 1}.** ${warn.reason} — <@${warn.moderatorId}> \`${date}\``;
    }).join('\n');

    await interaction.reply({
      content: `⚠️ Warnings for <@${target.id}>:\n\n${warningList}`,
      ephemeral: true
    });
  }
};
