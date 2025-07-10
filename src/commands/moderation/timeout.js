import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { logModEvent } from '#utils/logModEvent.js';

const timeUnits = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
const parseDuration = (input) => {
  const match = /^(\d+)(s|m|h|d)$/.exec(input);
  if (!match) return null;
  return parseInt(match[1]) * timeUnits[match[2]];
};

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Temporarily timeout a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName('target').setDescription('User to timeout').setRequired(true))
    .addStringOption(opt => opt.setName('duration').setDescription('e.g. 10m, 2h').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const durationMs = parseDuration(durationStr);
    if (!durationMs || durationMs < 5000 || durationMs > 2419200000) {
      return interaction.reply({ content: '❌ Invalid duration. Use 10m, 1h, 2d (max 28 days).', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member || !member.moderatable) {
      return interaction.reply({ content: '❌ Cannot timeout this user.', ephemeral: true });
    }

    await member.timeout(durationMs, reason);
    await interaction.reply({ content: `🔇 <@${target.id}> timed out for ${durationStr}.\n📝 ${reason}` });

    await logModEvent(interaction.guild, 'modAction', {
      action: 'Timeout',
      target,
      moderator: interaction.user,
      reason,
      duration: durationStr
    });
  }
};
