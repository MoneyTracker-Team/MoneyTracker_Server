import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TypeSpend = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    image: { type: String },
    isDaily: { type: Boolean },
    isDefault: { type: Boolean },
  },
  { timestamps: true },
);

export default mongoose.model('TypeSpend', TypeSpend);
