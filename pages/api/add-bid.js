import dbConnect from '../../lib/db';
import Auction from '../../models/Auction';
import Bid from '../../models/Bid';

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { auctionId, bidderId, itemName, itemDescription } = req.body;

  // Validate the input
  if (!auctionId || !bidderId || !itemName || !itemDescription) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    // Ensure the auctionId and bidderId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(auctionId) || !mongoose.Types.ObjectId.isValid(bidderId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Create a new bid document
    const newBid = new Bid({
      auction: auctionId,
      bidder: bidderId,
      itemName,
      itemDescription,
      createdAt: new Date(),
    });

    await newBid.save();

    // Add the bid to the auction's bids array
    await Auction.findByIdAndUpdate(auctionId, {
      $push: { bids: newBid._id },
    });

    res.status(201).json({ message: 'Bid added successfully', bid: newBid });
  } catch (error) {
    console.error('Error adding bid:', error.message);
    res.status(500).json({ message: 'Error adding bid', error: error.message });
  }
}
