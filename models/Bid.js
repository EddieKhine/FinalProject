// models/Bid.js
import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemDescription: {
    type: String,
    required: true,
  },
  itemImage: {
    type: String, // Field for the item image path
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema);
export default Bid;
