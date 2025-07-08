import { EmbedBuilder } from 'discord.js';

export default {
  name: 'guildMemberRemove',
  once: false,
  async execute(member, client) {
    const goodbyeChannelId = '1392023742175248482'; // Change this to your actual channel ID
    const channel = member.guild.channels.cache.get(goodbyeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle(`👋 Goodbye, ${member.user.username}`)
      .setDescription(`We're sad to see you go from **${member.guild.name}**.`)
      .setColor(0xFF0000)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `User ID: ${member.id}` })
      .setTimestamp();

    channel.send({ embeds: [embed] });
  },
};
