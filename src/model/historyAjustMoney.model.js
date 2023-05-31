import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const HistoryAjustMoney = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    ajustMoney: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.model('HistoryAjustMoney', HistoryAjustMoney);
