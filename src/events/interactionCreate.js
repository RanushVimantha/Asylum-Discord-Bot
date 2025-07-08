import { EmbedBuilder } from 'discord.js';

export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    // Slash Command
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        await interaction.reply({
          content: 'There was an error executing that command.',
          ephemeral: true,
        });
      }
    }

    // Modal Submission
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'confessionModal') {
        const confession = interaction.fields.getTextInputValue('confessionText');

        const confessionChannelId = '1392113904200712343'; // 🔁 Replace with real ID
        const confessionChannel = interaction.guild.channels.cache.get(confessionChannelId);
        if (!confessionChannel) {
          return interaction.reply({ content: 'Confession channel not found.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setTitle('📢 Anonymous Confession')
          .setDescription(confession)
          .setColor(0x5555ff)
          .setTimestamp();

        await confessionChannel.send({ embeds: [embed] });
        await interaction.reply({ content: '✅ Your confession has been sent anonymously.', ephemeral: true });
      }
    }
  }
};
