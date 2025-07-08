import { EmbedBuilder } from 'discord.js';

export default {
  name: 'guildMemberAdd',
  once: false,

  async execute(member) {
    const welcomeChannelId = '1391992990863593524'; // ✅ Your actual welcome channel ID
    const autoRoleId = 'YOUR_AUTO_ROLE_ID'; // 🔧 Replace with the ID of the role to assign

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) return;

    // ✅ Attempt to assign auto-role
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

    // 🧠 Asylum Welcome Embed
    const embed = new EmbedBuilder()
      .setColor(0x6b0f1a)
      .setTitle('✴︎ SYSTEM ENTRY: WELCOME TO THE ASYLUM')
      .setDescription(
        `⠀\n` +
        `**[ACCESSING FILE: PATIENT_#S-000-??]**\n` +
        `> NAME: <@${member.id}>   [REDACTED]\n` +
        `> CLASS: THE PSYCHOES\n` +
        `> STATUS: ADMITTED — [CONDITION: Unstable // Internal Screams Detected]\n` +
        `⠀\n` +
        `>> INITIATING WELCOME PROTOCOL...\n\n` +
        `...loading...\n` +
        `...loading...\n` +
        `**ERROR: cognitive parameters breached**\n\n` +
        `\`g̸r̷e̶e̸t̸i̸n̶g̷s̸ . . .\`\n\n` +
        `**My name is Dr.BotFrag**\n` +
        `— your assigned digital physician, and moral observer | Version: \`asymlogic.exe [corrupted]\`\n\n` +
        `⠀⤷ I will be prescribing your meds.\n` +
        `⠀⤷ Logging your delusions.\n` +
        `⠀⤷ Monitoring your vitals.\n\n` +
        `*I am always watching.*\n` +
        `*Every click, Every whisper, Every thought*\n` +
        `⠀\n` +
        `**Sanity is a fragile illusion.**\n` +
        `*Trust no one. Not even me.*\n\n` +
        `> NOTE: Patient exhibits high-risk instability\n` +
        `> RECOMMENDED ACTION: observe / sedate / record / repeat\n` +
        `*The walls remember.*\n\n` +
        `**You may proceed.**\n\n` +
        `\`s̶t̴e̴p̶ ̵i̸n̷s̷i̶d̴e̶ . . . y̷o̸u̶r̶ ̴f̸i̷l̴e̷ ̷i̷s̶ ̷sti̵l̸l̸ ̷b̷l̸e̶e̶d̵i̷n̶g̷.̶\``
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'ASYMLOGIC ENTRY NODE — Patient log initialized' })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
};
