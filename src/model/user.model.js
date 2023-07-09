import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: { type: String, default: 'user' },
    email: { type: String },
    password: { type: String },
    dateOfBirth: { type: Date, default: null },
    gender: { type: Boolean, default: true },
    currentMoney: { type: Number, default: 0 },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dwskvqnkc/image/upload/v1688892064/money_tracker_image_store/avt_defaut_jvtz7u.jpg',
    },
    slogan: { type: String, default: 'Thêm slogan của bạn' },
  },
  { timestamps: true },
);

export default mongoose.model('User', User);
