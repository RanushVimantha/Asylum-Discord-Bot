import { EmbedBuilder } from 'discord.js';

export default {
  name: 'guildMemberAdd',
  once: false,
  async execute(member, client) {
    const welcomeChannelId = '1391992990863593524'; // Change this to your actual channel ID
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle(`🎉 Welcome, ${member.user.username}!`)
      .setDescription(`Glad to have you in **${member.guild.name}**!`)
      .setColor(0x00FF00)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `User ID: ${member.id}` })
      .setTimestamp();

    channel.send({ embeds: [embed] });
  },
};
