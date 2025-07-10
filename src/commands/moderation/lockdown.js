import { SlashCommandBuilder, ChannelType } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lock or unlock ALL text and voice channels for @everyone')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Choose to lock or unlock')
        .setRequired(true)
        .addChoices(
          { name: 'lock', value: 'lock' },
          { name: 'unlock', value: 'unlock' }
        )
    ),

  async execute(interaction) {
    const MOD_ROLE_ID = '1392824426357067806'; // 🔧 Replace with your mod role ID
    const ANNOUNCE_CHANNEL_ID = '1367751287956967454'; // 🔧 Replace with your announcement channel ID

    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    const action = interaction.options.getString('action');
    const everyone = interaction.guild.roles.everyone;

    const allChannels = interaction.guild.channels.cache;
    const textAndVoiceChannels = allChannels.filter(
      c => c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice
    );

    let count = 0;

    // ✅ Defer reply to prevent timeout
    await interaction.deferReply({ ephemeral: true });

    // 🔒 Apply permission changes
    for (const channel of textAndVoiceChannels.values()) {
      try {
        const perms =
          channel.type === ChannelType.GuildVoice
            ? { Connect: action === 'lock' ? false : null }
            : { SendMessages: action === 'lock' ? false : null };

        await channel.permissionOverwrites.edit(everyone, perms);
        count++;
      } catch (err) {
        console.warn(`⚠️ Could not modify permissions for ${channel.name}`);
      }
    }

    // ⛔ Disconnect all voice users if action is lock
    if (action === 'lock') {
      const voiceChannels = allChannels.filter(c => c.type === ChannelType.GuildVoice);
      for (const vc of voiceChannels.values()) {
        for (const [_, member] of vc.members) {
          try {
            await member.voice.disconnect('Lockdown in effect');
          } catch (err) {
            console.warn(`⚠️ Could not disconnect ${member.user.tag} from ${vc.name}`);
          }
        }
      }
    }

    // 📣 Send announcement message
    const announceChannel = interaction.guild.channels.cache.get(ANNOUNCE_CHANNEL_ID);
    if (announceChannel && announceChannel.isTextBased()) {
      const msg =
        action === 'lock'
          ? '🔒 **[SYSTEM ALERT]**: The server has been placed under lockdown. All channels have been locked for your safety. Remain calm and await further instructions.'
          : '🔓 **[SYSTEM NOTICE]**: The lockdown has been lifted. Normal operations have resumed. Thank you for your patience.';

      await announceChannel.send(msg);
    }

    // ✅ Final reply
    await interaction.editReply(
      action === 'lock'
        ? `🚨 Lockdown initiated. 🔒 Locked ${count} channels and disconnected all voice users.`
        : `✅ Lockdown lifted. 🔓 Unlocked ${count} channels.`
    );
  }
};
