import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  channelId: { type: String }, // optional, fallback
  topic: { type: String, required: true },
  date: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Normal', 'High'], default: 'Normal' },
  delivered: { type: Boolean, default: false }
});

export default mongoose.model('Reminder', reminderSchema);
