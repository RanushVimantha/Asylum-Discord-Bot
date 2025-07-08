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
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({
        content: '❌ Only admins can use this command.',
        ephemeral: true
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confessionSubmit')
        .setLabel('Submit a confession!')
        .setStyle(ButtonStyle.Primary)
    );

    // 🛠️ Reply with the button inside the slash command response
    await interaction.reply({
      content: '🕵️ Click the button below to submit your anonymous confession.',
      components: [row],
      ephemeral: false // or true if you want it visible only to user
    });

    // ❌ DO NOT call interaction.channel.send() and interaction.reply() both
  }
};
