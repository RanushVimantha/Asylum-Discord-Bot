import { EmbedBuilder } from 'discord.js';

export default {
  customId: /^replyModal:\d+$/, // regex match for dynamic modal IDs

  async execute(interaction) {
    const confessionId = interaction.customId.split(':')[1];
    const replyText = interaction.fields.getTextInputValue('replyText');

    const embed = new EmbedBuilder()
      .setTitle(`📨 Anonymous Reply to Confession #${confessionId}`)
      .setDescription(replyText)
      .setColor(0xff99cc)
      .setTimestamp();

    const replyChannelId = 'YOUR_CONFESSION_CHANNEL_ID'; // same channel as confessions
    const channel = interaction.guild.channels.cache.get(replyChannelId);
    if (!channel) {
      return interaction.reply({ content: 'Reply channel not found.', ephemeral: true });
    }

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: '✅ Your anonymous reply has been sent.', ephemeral: true });
  }
};
