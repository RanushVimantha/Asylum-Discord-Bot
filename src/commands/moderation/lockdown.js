import { SlashCommandBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lock or unlock all text channels in the server')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Lock or unlock')
        .setRequired(true)
        .addChoices(
          { name: 'lock', value: 'lock' },
          { name: 'unlock', value: 'unlock' }
        )
    ),

  async execute(interaction) {
    const MOD_ROLE_ID = '139000000000000000'; // 🔧 Replace with your moderator role ID
    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    const action = interaction.options.getString('action');
    const everyone = interaction.guild.roles.everyone;

    const channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText);

    let count = 0;

    for (const channel of channels.values()) {
      try {
        await channel.permissionOverwrites.edit(everyone, {
          SendMessages: action === 'lock' ? false : null
        });
        count++;
      } catch (err) {
        console.warn(`Could not modify permissions for ${channel.name}`);
      }
    }

    await interaction.reply(
      action === 'lock'
        ? `🚨 Lockdown initiated. 🔒 Locked ${count} channels.`
        : `✅ Lockdown lifted. 🔓 Unlocked ${count} channels.`
    );
  }
};
