import { EmbedBuilder } from 'discord.js';

export default {
  name: 'guildMemberAdd',
  once: false,

  async execute(member) {
    console.log(`[EVENT] guildMemberAdd triggered for ${member.user.tag} (${member.id})`);

    const welcomeChannelId = '1391992990863593524'; // your actual channel ID
    const autoRoleId = '1391864908861149254';       // your actual role ID

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    try {
      const role = member.guild.roles.cache.get(autoRoleId);
      if (role) {
        await member.roles.add(role);
        console.log(`🟢 Assigned role "${role.name}" to ${member.user.tag}`);
      }
    } catch (err) {
      console.error(`❌ Failed to assign auto-role:`, err);
    }

    const embed = new EmbedBuilder()
      .setColor(0x6b0f1a)
      .setTitle('✴︎ [SYS//DISCHARGE_LOG]:: **℘ąɬıɛŋɬ_#ʂ-000-??**')
      .setDescription(
        `**ηαмє:** <@${member.id}> [█̶R̷E̶D̷A̸C̴T̷E̷D̷]  \n` +
        `**¢ℓαѕѕ:** тнє ρѕу¢нσєѕ  \n` +
        `**ѕтαтυѕ:** ∂ι𝕤𝔠𝓱𝕒𝕣g𝕖∂... ?  \n` +
        `**¢ση∂ιтιση:** 𝙀𝙍𝙍𝙊𝙍: [𝗨𝗡𝗞𝗡𝗢𝗪𝗡_𝗘𝗫𝗜𝗧_𝗩𝗘𝗖𝗧𝗢𝗥]  \n` +
        `**яє¢σммєη∂є∂ α¢тιση:** ▓▓▓▓▓\n\n` +
        `⤷[LOG OVERRIDE: **asymlogic.exe**]\n\n` +
        `> "Stability achieved. The patient has shown sufficient progress for reintroduction to society."\n` +
        `> "All monitoring protocols terminated successfully."\n\n` +
        `**⛓ ιηтєяηαℓ αℓєят:**\n` +
        `> [!] ⚠ тαяgєт єѕ¢αρє∂  \n` +
        `> [!] ⚠ ѕуѕтєм вяєα¢н ∂єтє¢тє∂  \n` +
        `> [!] ⚠ яєαℓιту ¢σмρяσмιѕє∂  \n\n` +
        `||→ 𝖱౿⍵𝗋ꪱᜒ𝗍ꪱᜒ𐓣𝗀 ρυᑲᥣꪱᜒɕ ᥣ𝗈𝗀…||\n\n` +
        '`⤷ Pαƚƈԋ ԃҽρʅσყҽԃ.\n' +
        '⤷ Tɾυƚԋ ʅσσρ ʂυρρɾҽʂʂҽԃ.\n' +
        '⤷ Mҽɱσɾყ ϝσɠ... ιɳιƚιαʅιȥҽԃ.`\n\n' +
        `----- [ 𝐃𝐫.𝐁𝐨𝐭𝐅𝐫𝐚𝐠'𝒔 𝐬𝐭𝐚𝐭𝐞𝐦𝐞𝐧𝐭 ]\n` +
        `**(っ◔◡◔)っ** 💖 𝘞𝘦 𝘸𝘪𝘴𝘩 𝘵𝘩𝘦𝘮 𝘵𝘩𝘦 𝘣𝘦𝘴𝘵 𝘰𝘧 𝘭𝘶𝘤𝘬 💖\n\n` +
        `𝕯𝖔 𝖓𝖔𝖙 𝖇𝖊 𝖈𝖚𝖗𝖎𝖔𝖚𝖘.\n` +
        `𝕯𝖔 𝖓𝖔𝖙 𝖆𝖙𝖙𝖊𝖒𝖕𝖙 𝖈𝖔𝖓𝖙𝖆𝖈𝖙.\n` +
        `𝕽𝖊𝖙𝖚𝖗𝖓 𝖙𝖔 𝖞𝖔𝖚𝖗 𝖕𝖗𝖊𝖘𝖈𝖗𝖎𝖇𝖊𝖉 𝖗𝖔𝖚𝖙𝖎𝖓𝖊𝖘, 𝖉𝖊𝖆𝖗 𝖕𝖆𝖙𝖎𝖊𝖓𝖙𝖘.`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'ASYMLOGIC ENTRY NODE — discharge mirage initialized' })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};
