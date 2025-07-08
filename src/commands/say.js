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

    // 🛑 Optional: delete the command reply (if ephemeral is off)
    try {
      await interaction.reply({ content: '✅ Message sent!', ephemeral: true });
      await interaction.channel.send(msg);
    } catch (err) {
      console.error('❌ Failed to send message:', err);
      await interaction.reply({ content: 'Something went wrong.', ephemeral: true });
    }
  }
};
