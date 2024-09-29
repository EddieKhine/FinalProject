import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startAuction: {
    type: Date,
    required: true,
  },
  endAuction: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true, // Default to true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
    default: null,
  },
});

const Auction = mongoose.models.Auction || mongoose.model('Auction', auctionSchema);
export default Auction;
