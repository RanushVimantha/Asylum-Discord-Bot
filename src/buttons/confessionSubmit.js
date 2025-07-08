import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
  customId: 'confessionSubmit',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('confessionModal')
      .setTitle('Anonymous Confession');

    const input = new TextInputBuilder()
      .setCustomId('confessionInput')
      .setLabel('Write your confession')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};
