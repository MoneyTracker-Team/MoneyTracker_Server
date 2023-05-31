import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SpendSchedule = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    month: { type: Number },
    scheduleMoney: { type: Number },
    remainMoney: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.model('SpendSchedule', SpendSchedule);
