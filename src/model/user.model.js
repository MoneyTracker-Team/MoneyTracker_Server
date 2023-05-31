import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: Number },
  currentMoney: { type: Number },
  avatar: { type: String },
  slogan: { type: String },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', User);
