import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('confession-start')
    .setDescription('Send the first confession button message (admin only)'),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ Only admins can use this command.', ephemeral: true });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confessionSubmit')
        .setLabel('Submit a confession!')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({
      content: '🕵️ Click the button below to submit your anonymous confession.',
      components: [row]
    });

    await interaction.reply({ content: '✅ Confession button posted successfully.', ephemeral: true });
  }
};
