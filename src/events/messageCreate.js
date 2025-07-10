export default {
  name: 'messageCreate',
  once: false,

  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;

    const linksChannelId = '1391860100662300803'; // 🔁 Replace this

    const content = message.content.toLowerCase();
    const hasLink = /(https?:\/\/[^\s]+)/.test(content);
    const isGif = /(https?:\/\/[^\s]+\.(gif|gifv))/.test(content);
    const isDiscordInvite = /(discord\.gg\/|discord\.com\/invite\/)/.test(content);

    // 1. Delete all discord invite links
    if (isDiscordInvite) {
      await message.delete().catch(() => {});
      return;
    }

    // 2. Redirect normal links not in #links channel (unless gif)
    if (hasLink && !isGif && message.channel.id !== linksChannelId) {
      try {
        await message.delete();

        const linksChannel = await client.channels.fetch(linksChannelId);
        if (linksChannel && linksChannel.isTextBased()) {
          await linksChannel.send({
            content: `🔗 Message from <@${message.author.id}> (originally from <#${message.channel.id}>):\n${message.content}`
          });
        }
      } catch (err) {
        console.error(`❌ Failed to handle link message:`, err);
      }
    }
  }
};
