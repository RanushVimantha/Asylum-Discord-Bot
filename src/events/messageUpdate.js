// src/events/messageUpdate.js
import { logModEvent } from '../utils/logModEvent.js';

export default {
  name: 'messageUpdate',
  once: false,
  async execute(oldMessage, newMessage) {
    if (
      oldMessage.partial || newMessage.partial ||
      !oldMessage.guild || oldMessage.author?.bot ||
      oldMessage.content === newMessage.content
    ) return;

    await logModEvent(oldMessage.guild, 'messageUpdate', {
      user: oldMessage.author,
      channel: oldMessage.channel,
      oldContent: oldMessage.content,
      newContent: newMessage.content
    });
  }
};
