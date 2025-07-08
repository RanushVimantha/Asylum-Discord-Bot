import Reminder from '../models/Reminder.js';
import moment from 'moment';

export default {
  customId: 'reminderModal',

  async execute(interaction) {
    const topic = interaction.fields.getTextInputValue('reminderTopic');
    const datetimeStr = interaction.fields.getTextInputValue('reminderDatetime');
    const priorityRaw = interaction.fields.getTextInputValue('reminderPriority') || 'Normal';

    const date = moment(datetimeStr, 'DD/MM/YYYY HH:mm', true);
    const priority = priorityRaw.trim().toLowerCase();

    if (!date.isValid()) {
      return await interaction.reply({ content: '❌ Invalid date format. Use DD/MM/YYYY HH:mm.', ephemeral: true });
    }

    if (!['low', 'normal', 'high'].includes(priority)) {
      return await interaction.reply({ content: '❌ Invalid priority. Use Low, Normal, or High.', ephemeral: true });
    }

    const reminder = new Reminder({
      userId: interaction.user.id,
      channelId: interaction.channelId,
      topic,
      date: date.toDate(),
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
    });

    await reminder.save();

    await interaction.reply({
      content: `✅ Reminder saved for ${date.format('DD MMM YYYY, HH:mm')}!`,
      ephemeral: true
    });
  }
};
