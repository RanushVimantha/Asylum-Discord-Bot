// src/utils/logModEvent.js
import { EmbedBuilder } from 'discord.js';

const LOG_CHANNELS = {
  voice: '1392835730052481114',
  channels: '1392835659235983410',
  messages: '1392835309657522258',
  bot: '1392833060348624920',
  invites: '1392835788970135562',
  modActions: '1391996480113479700',
  roles: '1392835123979751575',
  members: '1392834844605677648'
};

export async function logModEvent(guild, type, details) {
  const client = guild.client;
  const channelId = {
    memberJoin: LOG_CHANNELS.members,
    memberLeave: LOG_CHANNELS.members,
    messageDelete: LOG_CHANNELS.messages,
    messageUpdate: LOG_CHANNELS.messages,
    // more types will be mapped as needed
  }[type];

  if (!channelId) return;

  const logChannel = guild.channels.cache.get(channelId);
  if (!logChannel || !logChannel.isTextBased()) return;

  let embed;

  switch (type) {
    case 'memberJoin':
      embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setTitle('🟢 Member Joined')
        .setDescription(`User: <@${details.user.id}> (${details.user.tag})`)
        .setThumbnail(details.user.displayAvatarURL())
        .setTimestamp();
      break;

    case 'memberLeave':
      embed = new EmbedBuilder()
        .setColor(0xed4245)
        .setTitle('🔴 Member Left')
        .setDescription(`User: ${details.user.tag} (${details.user.id})`)
        .setThumbnail(details.user.displayAvatarURL())
        .setTimestamp();
      break;

    case 'messageDelete':
      embed = new EmbedBuilder()
        .setColor(0xffa500)
        .setTitle('🗑️ Message Deleted')
        .addFields(
          { name: 'User', value: `${details.user.tag} (${details.user.id})`, inline: true },
          { name: 'Channel', value: `<#${details.channel.id}>`, inline: true },
          { name: 'Content', value: details.content?.slice(0, 1024) || 'N/A' }
        )
        .setTimestamp();
      break;

    case 'messageUpdate':
      embed = new EmbedBuilder()
        .setColor(0xfee75c)
        .setTitle('✏️ Message Edited')
        .addFields(
          { name: 'User', value: `${details.user.tag} (${details.user.id})`, inline: true },
          { name: 'Channel', value: `<#${details.channel.id}>`, inline: true },
          { name: 'Before', value: details.oldContent?.slice(0, 1024) || 'N/A' },
          { name: 'After', value: details.newContent?.slice(0, 1024) || 'N/A' }
        )
        .setTimestamp();
      break;
  }

  if (embed) {
    await logChannel.send({ embeds: [embed] }).catch(console.error);
  }
}
