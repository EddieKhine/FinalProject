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
    required: true, // Ensure that bidder is required
  },
  itemName: {
    type: String,
    required: true,
  },
  itemDescription: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema);
export default Bid;
