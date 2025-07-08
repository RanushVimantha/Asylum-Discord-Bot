import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
  customId: /^reply:\d+:\d+$/, // Format: reply:<confessionId>:<messageId>

  async execute(interaction) {
    const [_, confessionId, messageId] = interaction.customId.split(':');

    const modal = new ModalBuilder()
      .setCustomId(`replyModal:${confessionId}:${messageId}`)
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
