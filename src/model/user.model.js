import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: Boolean },
    currentMoney: { type: Number },
    avatar: { type: String },
    slogan: { type: String },
    // createAt: { type: Date, default: Date.now },
    // updateAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model('User', User);
