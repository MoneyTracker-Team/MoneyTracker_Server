import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TypeSpend = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dwskvqnkc/image/upload/v1688891395/money_tracker_image_store/default-image_bsoxjb.jpg',
    },
    isDaily: { type: Boolean },
    isDefault: { type: Boolean },
  },
  { timestamps: true },
);

export default mongoose.model('TypeSpend', TypeSpend);
