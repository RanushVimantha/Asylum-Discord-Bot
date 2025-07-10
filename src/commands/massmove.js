import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('massmove')
    .setDescription('Move all users from one voice channel to another')
    .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers)
    .addChannelOption(option =>
      option.setName('from')
        .setDescription('The voice channel to move users from')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    )
    .addChannelOption(option =>
      option.setName('to')
        .setDescription('The voice channel to move users to')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice)
    ),

  async execute(interaction) {
    const fromChannel = interaction.options.getChannel('from');
    const toChannel = interaction.options.getChannel('to');

    if (fromChannel.id === toChannel.id) {
      return interaction.reply({ content: '❌ You cannot move users to the same channel.', ephemeral: true });
    }

    const membersToMove = fromChannel.members;

    if (membersToMove.size === 0) {
      return interaction.reply({ content: `⚠️ No users are in ${fromChannel.name}.`, ephemeral: true });
    }

    for (const [memberId, member] of membersToMove) {
      try {
        await member.voice.setChannel(toChannel);
      } catch (err) {
        console.error(`Failed to move ${member.user.tag}:`, err);
      }
    }

    await interaction.reply({
      content: `✅ Moved **${membersToMove.size}** users from **${fromChannel.name}** to **${toChannel.name}**.`,
      ephemeral: true
    });
  }
};
