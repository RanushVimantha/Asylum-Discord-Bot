// src/events/messageDelete.js
import { logModEvent } from '../../src/utils/logModEvent.js';

export default {
  name: 'messageDelete',
  once: false,
  async execute(message) {
    if (message.partial || !message.guild || message.author?.bot) return;

    await logModEvent(message.guild, 'messageDelete', {
      user: message.author,
      channel: message.channel,
      content: message.content
    });
  }
};
