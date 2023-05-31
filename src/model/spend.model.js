import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Spend = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    typeId: { type: Schema.Types.ObjectId, ref: 'TypeSpend' },
    moneySpend: { type: Number },
    dateTime: { type: Date },
    location: { type: String },
    image: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'Friend' }],
    note: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model('Spend', Spend);
