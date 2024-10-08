import dbConnect from '../../lib/db';
import Auction from '../../models/Auction';
import Bid from '../../models/Bid';
export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required to filter auctions' });
    }

    try {
      // Fetch only active auctions that are not created by the current user
      const auctions = await Auction.find({
        creator: { $ne: userId }, // Exclude auctions created by the current user
        isActive: true // Only include active auctions
      })
        .populate('creator', 'username')
        .lean();

      // Fetch bids for each auction and attach them to the auction object
      for (let auction of auctions) {
        const bids = await Bid.find({ auction: auction._id }).populate('bidder', 'username');
        auction.bids = bids; // Attach bids to the auction
      }

      res.status(200).json(auctions); // Return the fetched auctions with bids
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
      res.status(500).json({ message: 'Failed to fetch auctions' }); // Return error
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
