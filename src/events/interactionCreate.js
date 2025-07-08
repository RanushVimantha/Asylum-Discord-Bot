export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    // 🔹 Slash command
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error('❌ Slash command error:', error);
        await interaction.reply({
          content: 'There was an error while executing this command.',
          ephemeral: true
        });
      }
    }

    // 🔸 Button interaction
    if (interaction.isButton()) {
      for (const [id, button] of client.buttons) {
        if (
          (typeof id === 'string' && id === interaction.customId) ||
          (id instanceof RegExp && id.test(interaction.customId))
        ) {
          try {
            return await button.execute(interaction);
          } catch (error) {
            console.error('❌ Button error:', error);
            await interaction.reply({
              content: 'There was an error with that button interaction.',
              ephemeral: true
            });
          }
        }
      }
    }

    // 🔹 Modal submission interaction
    if (interaction.isModalSubmit()) {
      for (const [id, modal] of client.modals) {
        if (
          (typeof id === 'string' && id === interaction.customId) ||
          (id instanceof RegExp && id.test(interaction.customId))
        ) {
          try {
            return await modal.execute(interaction);
          } catch (error) {
            console.error('❌ Modal error:', error);
            await interaction.reply({
              content: 'There was an error while submitting the form.',
              ephemeral: true
            });
          }
        }
      }
    }
  }
};
