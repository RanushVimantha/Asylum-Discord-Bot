import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('confession')
    .setDescription('Submit an anonymous confession'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('confessionModal')
      .setTitle('Anonymous Confession');

    const confessionInput = new TextInputBuilder()
      .setCustomId('confessionText')
      .setLabel('Write your confession')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(confessionInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};
