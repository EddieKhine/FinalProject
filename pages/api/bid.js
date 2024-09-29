import dbConnect from '../../lib/db';
import Bid from '../../models/Bid';
import Auction from '../../models/Auction';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { auctionId, userId, itemName, itemDescription } = req.body;

  // Validate input
  if (!auctionId || !userId || !itemName || !itemDescription) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Create a new bid document
    const newBid = new Bid({
      auction: auctionId,
      bidder: userId,
      itemName,
      itemDescription,
    });

    // Save the bid
    await newBid.save();

    // Update the auction to include the new bid
    await Auction.findByIdAndUpdate(auctionId, { $push: { bids: newBid._id } });

    res.status(201).json({ message: 'Bid placed successfully', bid: newBid });
  } catch (error) {
    console.error('Error placing bid:', error.message);
    res.status(500).json({ message: 'Error placing bid', error: error.message });
  }
}
