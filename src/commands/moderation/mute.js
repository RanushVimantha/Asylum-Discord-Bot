import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  time
} from 'discord.js';

const timeUnits = {
  s: 1000,
  m: 1000 * 60,
  h: 1000 * 60 * 60,
  d: 1000 * 60 * 60 * 24
};

function parseDuration(input) {
  const match = /^(\d+)(s|m|h|d)$/.exec(input);
  if (!match) return null;

  const [ , num, unit ] = match;
  return parseInt(num) * timeUnits[unit];
}

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Temporarily mute (timeout) a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to mute')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Duration (e.g., 10m, 1h, 2d)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for mute')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const durationMs = parseDuration(durationStr);

    if (!durationMs || durationMs < 5000 || durationMs > 28 * 24 * 60 * 60 * 1000) {
      return interaction.reply({
        content: '❌ Invalid duration. Use formats like `10m`, `2h`, `1d` (max 28 days).',
        ephemeral: true
      });
    }

    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!member) {
      return interaction.reply({ content: '❌ Member not found.', ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: '❌ I cannot mute this user. Check role hierarchy or permissions.', ephemeral: true });
    }

    try {
      await member.timeout(durationMs, reason);
      await interaction.reply({
        content: `🔇 <@${member.id}> has been muted for **${durationStr}**.\n📝 Reason: ${reason}`
      });
    } catch (err) {
      console.error('Mute error:', err);
      await interaction.reply({ content: '❌ Failed to mute the member.', ephemeral: true });
    }
  }
};
