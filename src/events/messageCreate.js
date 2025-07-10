export default {
  name: 'messageCreate',
  once: false,

  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;

    const linksChannelId = 'YOUR_LINKS_CHANNEL_ID'; // 🔁 Replace this
    const channelId = message.channel.id;
    const content = message.content.toLowerCase();

    const hasLink = /(https?:\/\/[^\s]+)/.test(content);
    const isDiscordInvite = /(discord\.gg\/|discord\.com\/invite\/)/.test(content);

    const isGifLink = /(https?:\/\/[^\s]+\.(gif|gifv))/.test(content);
    const isGifHost = /(tenor\.com|giphy\.com|media\.discordapp\.net|cdn\.discordapp\.com)/.test(content);

    // 1. Always delete discord invites
    if (isDiscordInvite) {
      await message.delete().catch(() => {});
      return;
    }

    // 2. If message is a GIF (allowed), skip
    if ((isGifLink || isGifHost) && !isDiscordInvite) {
      return;
    }

    // 3. If it's a non-GIF link and not in #links → delete + redirect
    if (hasLink && channelId !== linksChannelId) {
      try {
        await message.delete();

        const linksChannel = await client.channels.fetch(linksChannelId);
        if (linksChannel && linksChannel.isTextBased()) {
          await linksChannel.send({
            content: `🔗 Message from <@${message.author.id}> (originally from <#${message.channel.id}>):\n${message.content}`
          });
        }
      } catch (err) {
        console.error(`❌ Link handler error:`, err);
      }
    }
  }
};
