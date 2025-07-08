import { SlashCommandBuilder } from 'discord.js';
import Reminder from '../models/Reminder.js';

export default {
  data: new SlashCommandBuilder()
    .setName('cancelreminder')
    .setDescription('Cancel a reminder by ID')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('Reminder ID (last 5 digits shown in /reminders)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const shortId = interaction.options.getString('id');
    const all = await Reminder.find({
      userId: interaction.user.id,
      delivered: false
    });

    const match = all.find(r => r._id.toString().endsWith(shortId));
    if (!match) {
      return interaction.reply({ content: '❌ Reminder not found or already delivered.', ephemeral: true });
    }

    await Reminder.findByIdAndDelete(match._id);
    return interaction.reply({ content: `✅ Reminder **${match.topic}** has been cancelled.`, ephemeral: true });
  }
};
