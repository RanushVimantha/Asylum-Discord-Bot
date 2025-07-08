import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
  customId: /^reply:\d+$/, // regex-based match

  async execute(interaction) {
    const confessionId = interaction.customId.split(':')[1];

    const modal = new ModalBuilder()
      .setCustomId(`replyModal:${confessionId}`)
      .setTitle(`Reply to Confession #${confessionId}`);

    const input = new TextInputBuilder()
      .setCustomId('replyText')
      .setLabel('Write your reply')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};
