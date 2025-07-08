export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    // Slash command
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
    }

    // Button click
    if (interaction.isButton()) {
      const button = client.buttons?.get(interaction.customId);
      if (button) await button.execute(interaction);
    }

    // Modal submission
    if (interaction.isModalSubmit()) {
      const modal = client.modals?.get(interaction.customId);
      if (modal) await modal.execute(interaction);
    }
  }
};
