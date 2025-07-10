import { SlashCommandBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a specific text channel for @everyone')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to unlock')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const MOD_ROLE_ID = '139000000000000000'; // 🔧 Replace with your moderator role ID
    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: null
      });

      await interaction.reply(`🔓 Unlocked <#${channel.id}> for @everyone.`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to unlock the channel.', ephemeral: true });
    }
  }
};
