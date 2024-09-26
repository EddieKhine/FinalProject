// models/Auction.js
import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencing user
}, { timestamps: true });

export default mongoose.models.Auction || mongoose.model('Auction', auctionSchema);
