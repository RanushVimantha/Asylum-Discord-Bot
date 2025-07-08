import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getNextConfessionNumber } from '../utils/confessionCounter.js';

export default {
  customId: 'confessionModal',

  async execute(interaction) {
    const confessionText = interaction.fields.getTextInputValue('confessionInput');
    const confessionId = getNextConfessionNumber();

    const embed = new EmbedBuilder()
      .setTitle(`📢 Anonymous Confession (#${confessionId})`)
      .setDescription(`"${confessionText}"`)
      .setColor(0x7289DA)
      .setTimestamp();

    const confessionChannelId = 'YOUR_CONFESSION_CHANNEL_ID'; // Replace with actual ID
    const channel = interaction.guild.channels.cache.get(confessionChannelId);
    if (!channel) {
      return interaction.reply({ content: '❌ Confession channel not found.', ephemeral: true });
    }

    // Send the confession message and capture the sent message
    const sent = await channel.send({ embeds: [embed] });

    // Add buttons with message ID
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confessionSubmit')
        .setLabel('Submit a confession!')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`reply:${confessionId}:${sent.id}`)
        .setLabel('Reply')
        .setStyle(ButtonStyle.Secondary)
    );

    // Edit message to add buttons
    await sent.edit({ embeds: [embed], components: [buttons] });

    await interaction.reply({ content: '✅ Confession sent anonymously.', ephemeral: true });
  }
};
