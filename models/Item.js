import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  bids: [
    {
      bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      amount: { type: Number, required: true },
    },
  ],
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
