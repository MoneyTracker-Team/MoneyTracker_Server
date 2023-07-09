import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Friend = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dwskvqnkc/image/upload/v1688892064/money_tracker_image_store/avt_defaut_jvtz7u.jpg',
    },
    isTemporaty: { type: Boolean },
  },
  { timestamps: true },
);

export default mongoose.model('Friend', Friend);
