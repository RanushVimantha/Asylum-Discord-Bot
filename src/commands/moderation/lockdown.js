// src/commands/moderation/lockdown.js
import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { logModEvent } from '../../src/utils/logModEvent.js';

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
    const MOD_ROLE_ID = '1392824426357067806'; // 🔧 Replace with your moderator role ID
    const ANNOUNCE_CHANNEL_ID = '1392030027582799872'; // 🔧 Your #announcement channel ID

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

    await interaction.deferReply({ ephemeral: true });

    for (const channel of textAndVoiceChannels.values()) {
      try {
        const perms =
          channel.type === ChannelType.GuildVoice
            ? { Connect: action === 'lock' ? false : null }
            : { SendMessages: action === 'lock' ? false : null };

        await channel.permissionOverwrites.edit(everyone, perms);
        count++;
      } catch (err) {
        console.warn(`⚠️ Could not modify ${channel.name}`);
      }
    }

    // If locking, disconnect voice users
    if (action === 'lock') {
      const voiceChannels = allChannels.filter(c => c.type === ChannelType.GuildVoice);
      for (const vc of voiceChannels.values()) {
        for (const [, member] of vc.members) {
          try {
            await member.voice.disconnect('Lockdown in effect');
          } catch (err) {
            console.warn(`⚠️ Could not disconnect ${member.user.tag}`);
          }
        }
      }
    }

    // 📢 Public announcement
    const announceChannel = interaction.guild.channels.cache.get(ANNOUNCE_CHANNEL_ID);
    if (announceChannel?.isTextBased()) {
      const msg =
        action === 'lock'
          ? `@everyone 🔒 **[SYSTEM ALERT]**: The server has been placed under lockdown.\nAll channels are now locked. Please remain calm and await further instructions.`
          : `@everyone 🔓 **[SYSTEM NOTICE]**: The lockdown has been lifted.\nNormal operations have resumed. Thank you for your patience.`;

      await announceChannel.send({ content: msg, allowedMentions: { parse: ['everyone'] } });
    }

    // 🧾 Log lockdown action
    await logModEvent(interaction.guild, 'modAction', {
      action: action === 'lock' ? 'Lockdown Initiated' : 'Lockdown Lifted',
      moderator: interaction.user,
      reason: `Affected ${count} channels`
    });

    // ✅ Response to command issuer
    await interaction.editReply(
      action === 'lock'
        ? `🚨 Lockdown initiated. 🔒 Locked ${count} channels and disconnected all voice users.`
        : `✅ Lockdown lifted. 🔓 Unlocked ${count} channels.`
    );
  }
};
