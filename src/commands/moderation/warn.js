import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Warning from '../../models/warnSchema.js';
import { logModEvent } from '#utils/logModEvent.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a user (3 warnings = timeout + Sedated role)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('target').setDescription('The user to warn').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason').setDescription('Reason for the warning').setRequired(false)
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

    await logModEvent(interaction.guild, 'modAction', {
      action: 'Warn',
      target: user,
      moderator: interaction.user,
      reason,
      note: `Total warnings: ${warnCount}`
    });

    if (warnCount >= 3) {
      const sedatedRoleId = '1392824426357067806'; // Replace with your actual Sedated role ID
      const sedatedRole = interaction.guild.roles.cache.get(sedatedRoleId);

      try {
        await member.timeout(sevenDays, 'Auto-timeout after 3 warnings');
        const rolesToRemove = member.roles.cache.filter(r => r.name !== '@everyone');
        await member.roles.remove(rolesToRemove);

        if (sedatedRole) {
          await member.roles.add(sedatedRole);
        }

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
          content: `⚠️ <@${user.id}> received their **third warning (3/3)**.\n🔇 Timed out for 7 days.\n🧬 Roles removed and assigned \`Sedated\`.\n📝 Reason: ${reason}`
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
