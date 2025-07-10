import { SlashCommandBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lock or unlock ALL text and voice channels for @everyone')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Choose to lock or unlock all channels')
        .setRequired(true)
        .addChoices(
          { name: 'lock', value: 'lock' },
          { name: 'unlock', value: 'unlock' }
        )
    ),

  async execute(interaction) {
    const MOD_ROLE_ID = '1392824426357067806'; // 🔧 Replace with your mod role ID
    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    const action = interaction.options.getString('action');
    const everyone = interaction.guild.roles.everyone;

    const channels = interaction.guild.channels.cache.filter(c =>
      c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice
    );

    let changed = 0;

    for (const channel of channels.values()) {
      try {
        const perms =
          channel.type === ChannelType.GuildVoice
            ? { Connect: action === 'lock' ? false : null }
            : { SendMessages: action === 'lock' ? false : null };

        await channel.permissionOverwrites.edit(everyone, perms);
        changed++;
      } catch (err) {
        console.warn(`⚠️ Could not modify ${channel.name}`);
      }
    }

    await interaction.reply(
      action === 'lock'
        ? `🚨 Server-wide lockdown initiated.\n🔒 Locked ${changed} channels (text & voice).`
        : `✅ Lockdown lifted.\n🔓 Unlocked ${changed} channels (text & voice).`
    );
  }
};
