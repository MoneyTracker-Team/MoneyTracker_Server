import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Loan = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    debtorId: { type: Schema.Types.ObjectId, ref: 'Friend' },
    moneySpend: { type: Number },
    dateTime: { type: Date },
    location: { type: String },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dwskvqnkc/image/upload/v1688891395/money_tracker_image_store/default-image_bsoxjb.jpg',
    },
    note: { type: String },
    isDebt: { type: Boolean },
  },
  { timestamps: true },
);

export default mongoose.model('Loan', Loan);
