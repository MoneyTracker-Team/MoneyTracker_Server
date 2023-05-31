import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Loan = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    debtorId: { type: Schema.Types.ObjectId, ref: 'Friend' },
    dateTime: { type: Date },
    location: { type: String },
    image: { type: String },
    note: { type: String },
    isDebt: { type: Boolean },
  },
  { timestamps: true },
);

export default mongoose.model('Loan', Loan);
