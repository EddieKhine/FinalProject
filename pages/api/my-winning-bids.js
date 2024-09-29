import dbConnect from '../../lib/db';
import Auction from '../../models/Auction';
import Bid from '../../models/Bid';

export default async function handler(req, res) {
  await dbConnect();

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Find all auctions where the user has won
    const auctions = await Auction.find({ winner: { $exists: true } })
      .populate({
        path: 'winner',
        match: { bidder: userId }, // Only return auctions where the current user is the winner
        populate: { path: 'bidder', select: 'username' } // Populate the bidder info
      })
      .populate('creator', 'username') // Populate the auction creator information
      .lean();

    // Filter out auctions where the user is not the winner
    const userWinningAuctions = auctions.filter(auction => auction.winner && auction.winner.bidder._id == userId);

    res.status(200).json(userWinningAuctions);
  } catch (error) {
    console.error('Error fetching winning bids:', error);
    res.status(500).json({ message: 'Failed to fetch winning bids' });
  }
}
