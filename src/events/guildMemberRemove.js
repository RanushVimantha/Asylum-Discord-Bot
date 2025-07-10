import { EmbedBuilder } from 'discord.js';
import { logModEvent } from '../utils/logModEvent.js';

export default {
  name: 'guildMemberRemove',
  once: false,

  async execute(member) {
    const goodbyeChannelId = '1392023742175248482';
    const channel = member.guild.channels.cache.get(goodbyeChannelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x910000)
      .setTitle('✴︎ [SYS//DISCHARGE LOG]:: **℘ąɬıɛŋɬ_#ʂ-000-??**')
      .setDescription(
        `**ηαмє:** <@${member.id}> [█̶R̷E̶D̷A̸C̴T̷E̷D̷]  \n` +
        `**¢ℓαѕѕ:** тнє ρѕу¢нσєѕ  \n` +
        `**ѕтαтυѕ:** ∂ι𝕤𝔠𝓱𝕒𝕣g𝕖∂... ?  \n` +
        `**¢ση∂ιтιση:** 𝙀𝙍𝙍𝙊𝙍: [𝗨𝗡𝗞𝗡𝗢𝗪𝗡 𝗘𝗫𝗜𝗧 𝗩𝗘𝗖𝗧𝗢𝗥]  \n` +
        `**яє¢σммєη∂є∂ α¢тιση:** ▓▓▓▓▓\n\n` +
        `⤷[LOG OVERRIDE: **asymlogic.exe**]\n\n` +
        `> "Stability achieved. The patient has shown sufficient progress for reintroduction to society."\n` +
        `> "All monitoring protocols terminated successfully."\n\n` +
        `**⛓ ιηтєяηαℓ αℓєят:**\n` +
        `> [!] ⚠ тαяgєт єѕ¢αρє∂\n` +
        `> [!] ⚠ ѕуѕтєм вяєα¢н ∂єтє¢тє∂\n` +
        `> [!] ⚠ яєαℓιту ¢σмρяσмιѕє∂\n\n` +
        `||→ 𝖱౿⍵𝗋ꪱᜒ𝗍ꪱᜒ𐓣𝗀 ρυᑲᥣꪱᜒɕ ᥣ𝗈𝗀…||\n\n` +
        '`⤷ Pαƚƈԋ ԃҽρʅσყҽԃ.\n' +
        '⤷ Tɾυƚԋ ʅσσρ ʂυρρɾҽʂʂҽԃ.\n' +
        '⤷ Mҽɱσɾყ ϝσɠ... ιɳιƚιαʅιȥҽԃ.`\n\n' +
        `----- [ 𝐃𝐫.𝐁𝐨𝐭𝐅𝐫𝐚𝐠'𝒔 𝐬𝐭𝐚𝐭𝐞𝐦𝐞𝐧𝐭 ]\n` +
        `**(っ◔◡◔)っ**  𝘞𝘦 𝘸𝘪𝘴𝘩 𝘵𝘩𝘦𝘮 𝘵𝘩𝘦 𝘣𝘦𝘴𝘵 𝘰𝘧 𝘭𝘶𝘤𝘬  \n\n` +
        `𝕯𝖔 𝖓𝖔𝖙 𝖇𝖊 𝖈𝖚𝖗𝖎𝖔𝖚𝖘.\n` +
        `𝕯𝖔 𝖓𝖔𝖙 𝖆𝖙𝖙𝖊𝖒𝖕𝖙 𝖈𝖔𝖓𝖙𝖆𝖈𝖙.\n` +
        `𝕽𝖊𝖙𝖚𝖗𝖓 𝖙𝖔 𝖞𝖔𝖚𝖗 𝖕𝖗𝖊𝖘𝖈𝖗𝖎𝖇𝖊𝖉 𝖗𝖔𝖚𝖙𝖎𝖓𝖊𝖘, 𝖉𝖊𝖆𝖗 𝖕𝖆𝖙𝖎𝖊𝖓𝖙𝖘.`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'ASYMLOGIC EXIT NODE — discharge complete' })
      .setTimestamp();

    await channel.send({ embeds: [embed] });

    // ✅ Log to Mod System
    await logModEvent(member.guild, 'memberLeave', { user: member.user });
  }
};
