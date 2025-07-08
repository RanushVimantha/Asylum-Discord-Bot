import Reminder from '../models/Reminder.js';

export async function startReminderScheduler(client) {
  setInterval(async () => {
    const now = new Date();
    const due = await Reminder.find({
      date: { $lte: now },
      delivered: false
    });

    for (const reminder of due) {
      try {
        const user = await client.users.fetch(reminder.userId);
        const embed = {
          title: `🔔 Reminder: ${reminder.topic}`,
          description: `Priority: **${reminder.priority}**\nTime: <t:${Math.floor(reminder.date.getTime() / 1000)}:F>`,
          color: 0xfac863,
          timestamp: new Date()
        };

        try {
          await user.send({ embeds: [embed] });
        } catch {
          const channel = client.channels.cache.get(reminder.channelId);
          if (channel?.isTextBased()) {
            await channel.send({ content: `<@${reminder.userId}>`, embeds: [embed] });
          }
        }

        reminder.delivered = true;
        await reminder.save();
      } catch (err) {
        console.error('Reminder delivery failed:', err);
      }
    }
  }, 60 * 1000); // check every 1 minute
}
