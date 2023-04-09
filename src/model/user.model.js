import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
  nickName: { type: String },
  email: { type: String },
  password: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: Number },
  money: { type: Number },
  avatar: { type: String },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', User);
