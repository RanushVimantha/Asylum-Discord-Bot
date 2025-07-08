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

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confessionSubmit')
        .setLabel('Submit a confession!')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`reply:${confessionId}`)
        .setLabel('Reply')
        .setStyle(ButtonStyle.Secondary)
    );

    const confessionChannelId = 'YOUR_CONFESSION_CHANNEL_ID'; // Replace this
    const confessionChannel = interaction.guild.channels.cache.get(confessionChannelId);
    if (!confessionChannel) {
      return interaction.reply({ content: '❌ Confession channel not found.', ephemeral: true });
    }

    await confessionChannel.send({ embeds: [embed], components: [buttons] });
    await interaction.reply({ content: '✅ Confession sent anonymously.', ephemeral: true });
  }
};
