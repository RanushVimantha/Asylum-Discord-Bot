import { EmbedBuilder } from 'discord.js';

export default {
  customId: /^replyModal:\d+:\d+$/, // Format: replyModal:<confessionId>:<messageId>

  async execute(interaction) {
    const parts = interaction.customId.split(':');
    const confessionId = parts[1];
    const messageId = parts[2];
    const replyText = interaction.fields.getTextInputValue('replyText');

    const embed = new EmbedBuilder()
      .setTitle(`📨 Anonymous Reply to Confession #${confessionId}`)
      .setDescription(replyText)
      .setColor(0xff99cc)
      .setTimestamp();

    const confessionChannelId = '1392113904200712343'; // Replace with actual ID
    const channel = interaction.guild.channels.cache.get(confessionChannelId);
    if (!channel) {
      return interaction.reply({ content: '❌ Confession channel not found.', ephemeral: true });
    }

    try {
      const originalMessage = await channel.messages.fetch(messageId);
      await originalMessage.reply({ embeds: [embed] });
      await interaction.reply({ content: '✅ Your anonymous reply has been sent.', ephemeral: true });
    } catch (err) {
      console.error('❌ Reply failed:', err);
      await interaction.reply({ content: '❌ Could not reply to the confession.', ephemeral: true });
    }
  }
};
