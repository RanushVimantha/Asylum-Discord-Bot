import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Warning from '../../models/warnSchema.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a user (3 warnings = 7-day timeout)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for warning')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Member not found.', ephemeral: true });

    if (!member.moderatable) {
      return interaction.reply({ content: '❌ I cannot warn this user. Check role hierarchy.', ephemeral: true });
    }

    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    // Get or create warning data
    let data = await Warning.findOne({ guildId: interaction.guild.id, userId: user.id });
    if (!data) {
      data = new Warning({
        guildId: interaction.guild.id,
        userId: user.id,
        warnings: []
      });
    }

    data.warnings.push({
      reason,
      date: new Date(),
      moderatorId: interaction.user.id
    });

    await data.save();

    const count = data.warnings.length;

    // Respond based on warning count
    if (count >= 3) {
      try {
        await member.timeout(sevenDays, 'Auto-timeout: reached 3 warnings');
        await interaction.reply({
          content: `⚠️ <@${user.id}> has been warned **(3/3)** and was automatically timed out for **7 days**.\nReason: ${reason}`
        });
      } catch (err) {
        console.error('Timeout failed:', err);
        await interaction.reply({
          content: `⚠️ <@${user.id}> reached **3 warnings**, but I failed to timeout them.\nReason: ${reason}`,
          ephemeral: true
        });
      }
    } else {
      await interaction.reply({
        content: `⚠️ <@${user.id}> has been warned **(${count}/3)**.\nReason: ${reason}`
      });
    }
  }
};
