import { SlashCommandBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a specific text channel for @everyone')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to lock')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for locking the channel')
        .setRequired(false)
    ),

  async execute(interaction) {
    const MOD_ROLE_ID = '139000000000000000'; // 🔧 Replace with your moderator role ID
    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false
      });

      await interaction.reply(`🔒 Locked <#${channel.id}> for @everyone.\n📝 Reason: ${reason}`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to lock the channel.', ephemeral: true });
    }
  }
};
