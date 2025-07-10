import mongoose from 'mongoose';

const warnSchema = new mongoose.Schema({
  guildId: String,
  userId: String,
  warnings: [
    {
      reason: String,
      date: Date,
      moderatorId: String
    }
  ]
});

export default mongoose.model('Warning', warnSchema);
