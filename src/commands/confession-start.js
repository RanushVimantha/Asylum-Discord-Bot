import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('confession-start')
    .setDescription('Send the first confession button message (admin only)'),

  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has('Administrator')) {
        await interaction.reply({
          content: '❌ Only admins can use this command.',
          ephemeral: true
        });
        return;
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('confessionSubmit')
          .setLabel('Submit a confession!')
          .setStyle(ButtonStyle.Primary)
      );

      // Send the message to the channel
      await interaction.channel.send({
        content: '🕵️ Click the button below to submit your anonymous confession.',
        components: [row]
      });

      // Respond to the slash command with a silent success
      if (!interaction.replied) {
        await interaction.reply({
          content: '✅ Confession button posted!',
          ephemeral: true
        });
      }

    } catch (error) {
      console.error('❌ Error in /confession-start:', error);

      // Only try to reply if we haven't already
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Something went wrong while posting the button.',
          ephemeral: true
        });
      }
    }
  }
};
