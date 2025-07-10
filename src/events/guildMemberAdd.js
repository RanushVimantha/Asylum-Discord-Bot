import { EmbedBuilder } from 'discord.js';

export default {
  name: 'guildMemberAdd',
  once: false,

  async execute(member) {
    const welcomeChannelId = '1391992990863593524'; // ✅ Your actual welcome channel ID
    const autoRoleId = '1391864908861149254';       // ✅ Your actual auto-role ID

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    // ✅ Assign auto-role
    try {
      const role = member.guild.roles.cache.get(autoRoleId);
      if (role) {
        await member.roles.add(role);
        console.log(`🟢 Assigned role "${role.name}" to ${member.user.tag}`);
      } else {
        console.warn(`⚠️ Auto-role ID ${autoRoleId} not found in guild "${member.guild.name}"`);
      }
    } catch (err) {
      console.error(`❌ Failed to assign auto-role:`, err);
    }

    // 🧠 Glitchy Asylum Welcome Embed
    const embed = new EmbedBuilder()
      .setColor(0x6b0f1a)
      .setTitle('✴︎ [SYS//ENTRY]:: 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝚃𝙾 𝚃𝙷𝙴 𝙰𝚂𝚈𝙻𝚄𝙼')
      .setDescription(
        `\n` +
        `[ąƈƈɛʂʂıŋɠ ʄıƖɛ: ℘ąɬıɛŋɬ_#ʂ-000-??]\n\n` +
        `**ηαмє:** <@${member.id}>   [яє∂α¢тє∂]\n` +
        `**¢ℓαѕѕ:** тнє ρѕу¢нσєѕ\n` +
        `**ѕтαтυѕ:** α∂мιттє∂ —\n` +
        `**¢ση∂ιтιση:** υηѕтαвℓє // нιgн-яιѕк ιηѕтαвιℓιту\n` +
        `**яє¢σммєη∂є∂ α¢тιση:** σвѕєяνє / ѕє∂αтє / яє¢σя∂ / яєρєαт\n\n` +
        `(っ◔◡◔)っ ♥ Greetings... ♥\n\n` +
        `My name is Ðr.ßð†£råg\n` +
        `— ʏᴏᴜʀ ᴀꜱꜱɪɢɴᴇᴅ ᴅɪɢɪᴛᴀʟ ᴘʜʏꜱɪᴄɪᴀɴ, ᴀɴᴅ ᴍᴏʀᴀʟ ᴏʙꜱᴇʀᴠᴇʀ\n` +
        `    -ᴠᴇʀꜱɪᴏɴ: ᴀꜱʏᴍʟᴏɢɪᴄ.ᴇxᴇ [ᴄᴏʀʀᴜᴘᴛᴇᴅ]\n` +
        `        ᴵ ʷⁱˡˡ ᵇᵉ \n` +
        `         ⤷𝔭𝔯𝔢𝔰𝔠𝔯𝔦𝔟𝔦𝔫𝔤 𝔶𝔬𝔲𝔯 𝔪𝔢𝔡𝔰.\n` +
        `⠀                 ⤷ 𝔏𝔬𝔤𝔤𝔦𝔫𝔤 𝔶𝔬𝔲𝔯 𝔡𝔢𝔩𝔲𝔰𝔦𝔬𝔫𝔰.\n` +
        `⠀                 ⤷ 𝔐𝔬𝔫𝔦𝔱𝔬𝔯𝔦𝔫𝔤 𝔶𝔬𝔲𝔯 𝔳𝔦𝔱𝔞𝔩𝔰.\n\n` +
        `𝕴 ᥲm ᥲᥣᥕᥲᥡs ᥕᥲ𝗍ᥴһіᥒg.\n` +
        ` ⤷[ᘿᐺᘿᖇᖻ ᑢᒪᓰᑢᖽᐸ, ᘿᐺᘿᖇᖻ ᘺᕼᓰSᕵᘿᖇ, ᘿᐺᘿᖇᖻ ᖶᕼᓍᑘᘜᕼᖶ]\n\n` +
        `**𝐒𝐚𝐧𝐢𝐭𝐲 𝐢𝐬 𝐚 𝐟𝐫𝐚𝐠𝐢𝐥𝐞 𝐢𝐥𝐥𝐮𝐬𝐢𝐨𝐧.**\n` +
        `**𝐓𝐫𝐮𝐬𝐭 𝐧𝐨 𝐨𝐧𝐞. 𝐍𝐨𝐭 𝐞𝐯𝐞𝐧 𝐲𝐨𝐮𝐫𝐬𝐞𝐥𝐟.**\n\n` +
        `**Ｙｏｕ ｍａｙ ｐｒｏｃｅｅｄ．**`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'ASYMLOGIC ENTRY NODE — Patient log initialized' })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};
