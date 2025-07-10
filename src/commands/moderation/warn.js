import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Warning from '../../models/warnSchema.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a user (3 warnings = timeout + Sedated role)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the warning')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Could not find the user.', ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: '❌ I cannot warn this user. Check role hierarchy.', ephemeral: true });
    }

    // Load or create warning record
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

    const warnCount = data.warnings.length;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (warnCount >= 3) {
      const sedatedRoleId = '1392824426357067806'; // 🔧 Replace with your real Sedated role ID
      const sedatedRole = interaction.guild.roles.cache.get(sedatedRoleId);

      try {
        // Timeout the member
        await member.timeout(sevenDays, 'Auto-timeout after 3 warnings');

        // Remove all roles except @everyone
        const rolesToRemove = member.roles.cache.filter(r => r.name !== '@everyone');
        await member.roles.remove(rolesToRemove);

        // Assign Sedated role
        if (sedatedRole) {
          await member.roles.add(sedatedRole);
        }

        // Schedule automatic removal of the Sedated role after 7 days
        setTimeout(async () => {
          try {
            const refreshedMember = await interaction.guild.members.fetch(user.id);
            if (refreshedMember.roles.cache.has(sedatedRoleId)) {
              await refreshedMember.roles.remove(sedatedRoleId);
              console.log(`🧠 Sedated role removed from ${refreshedMember.user.tag} after timeout.`);
            }
          } catch (err) {
            console.error('Failed to remove Sedated role after timeout:', err);
          }
        }, sevenDays);

        await interaction.reply({
          content: `⚠️ <@${user.id}> has received their **third warning (3/3)**.\n🔇 Timed out for 7 days.\n🧬 All roles removed and assigned \`Sedated\` role.\n📝 Reason: ${reason}`
        });
      } catch (err) {
        console.error('Punishment error:', err);
        await interaction.reply({
          content: `❌ Failed to apply punishment to <@${user.id}>.`,
          ephemeral: true
        });
      }
    } else {
      await interaction.reply({
        content: `⚠️ <@${user.id}> has been warned **(${warnCount}/3)**.\n📝 Reason: ${reason}`
      });
    }
  }
};
