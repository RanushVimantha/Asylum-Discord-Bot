import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remindme')
    .setDescription('Set a personal reminder'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('reminderModal')
      .setTitle('Set a Reminder');

    const topicInput = new TextInputBuilder()
      .setCustomId('reminderTopic')
      .setLabel('Reminder Topic')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const datetimeInput = new TextInputBuilder()
      .setCustomId('reminderDatetime')
      .setLabel('When? (DD/MM/YYYY HH:mm)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const priorityInput = new TextInputBuilder()
      .setCustomId('reminderPriority')
      .setLabel('Priority (Low / Normal / High)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const row1 = new ActionRowBuilder().addComponents(topicInput);
    const row2 = new ActionRowBuilder().addComponents(datetimeInput);
    const row3 = new ActionRowBuilder().addComponents(priorityInput);

    modal.addComponents(row1, row2, row3);

    await interaction.showModal(modal);
  }
};
