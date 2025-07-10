import { SlashCommandBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a text or voice channel for @everyone')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to unlock')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice)
        .setRequired(true)
    ),

  async execute(interaction) {
    const MOD_ROLE_ID = '1392824426357067806'; // 🔧 Replace with your mod role ID
    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');

    const perms = channel.type === ChannelType.GuildVoice
      ? { Connect: null }
      : { SendMessages: null };

    try {
      await channel.permissionOverwrites.edit(channel.guild.roles.everyone, perms);
      await interaction.reply(`🔓 Unlocked <#${channel.id}> (${channel.type === ChannelType.GuildVoice ? 'voice' : 'text'} channel).`);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to unlock the channel.', ephemeral: true });
    }
  }
};
