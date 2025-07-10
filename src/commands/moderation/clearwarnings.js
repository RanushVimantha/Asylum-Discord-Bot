import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Warning from '../../models/warnSchema.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear all warnings for a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to clear warnings from')
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('target');

    const deleted = await Warning.findOneAndDelete({
      guildId: interaction.guild.id,
      userId: target.id
    });

    if (!deleted) {
      return interaction.reply({ content: `✅ <@${target.id}> has no warnings to clear.`, ephemeral: true });
    }

    await interaction.reply({
      content: `🧹 Cleared all warnings for <@${target.id}>.`
    });
  }
};
