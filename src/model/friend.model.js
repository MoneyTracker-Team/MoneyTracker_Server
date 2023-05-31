import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const Friend = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    image: { type: String },
    isTemporaty: { type: Boolean },
  },
  { timestamps: true },
);

export default mongoose.model('Friend', Friend);
