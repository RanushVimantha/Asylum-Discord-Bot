import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say a message!')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message you want the bot to say')
        .setRequired(true)
    ),

  async execute(interaction) {
    const msg = interaction.options.getString('message');

    try {
      await interaction.reply({ content: '✅ Message sent!', ephemeral: true });
      await interaction.channel.send(msg);
    } catch (error) {
      console.error('❌ Say command error:', error);
      await interaction.reply({ content: 'There was an error executing the say command.', ephemeral: true });
    }
  }
};
