import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Spend = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    typeId: { type: Schema.Types.ObjectId, ref: 'TypeSpend' },
    moneySpend: { type: Number },
    dateTime: { type: Date },
    location: { type: String },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dwskvqnkc/image/upload/v1688891395/money_tracker_image_store/default-image_bsoxjb.jpg',
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'Friend' }],
    note: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model('Spend', Spend);
