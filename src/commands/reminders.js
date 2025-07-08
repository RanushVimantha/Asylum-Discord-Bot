import { SlashCommandBuilder } from 'discord.js';
import Reminder from '../models/Reminder.js';
import moment from 'moment';

export default {
  data: new SlashCommandBuilder()
    .setName('reminders')
    .setDescription('View your active reminders'),

  async execute(interaction) {
    const reminders = await Reminder.find({
      userId: interaction.user.id,
      delivered: false
    }).sort({ date: 1 });

    if (reminders.length === 0) {
      return interaction.reply({ content: '🕐 You have no upcoming reminders.', ephemeral: true });
    }

    const list = reminders.map((r, i) => {
      return `**#${r._id.toString().slice(-5)}** — ${r.topic}  
🗓️ ${moment(r.date).format('DD MMM YYYY HH:mm')}  
⚠️ Priority: **${r.priority}**`;
    }).join('\n\n');

    await interaction.reply({
      content: `📋 **Your Reminders**\n\n${list}`,
      ephemeral: true
    });
  }
};
