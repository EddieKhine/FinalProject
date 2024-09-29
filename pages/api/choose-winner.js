import dbConnect from '../../lib/db';
import Auction from '../../models/Auction';
import Bid from '../../models/Bid';

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { auctionId, bidId } = req.body;

  // Validate the input
  if (!auctionId || !bidId) {
    return res.status(400).json({ message: 'Auction ID and Bid ID are required' });
  }

  try {
    // Find the auction and update it with the winning bid
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if the auction is already inactive
    if (!auction.isActive) {
      return res.status(400).json({ message: 'Auction is already inactive' });
    }

    // Fetch the winning bid details
    const winningBid = await Bid.findById(bidId).populate('bidder', 'username');
    if (!winningBid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Update the auction with the winning bid and set it to inactive
    auction.winner = winningBid; // Store the full winning bid
    auction.isActive = false;
    await auction.save();

    res.status(200).json({ message: 'Winner chosen successfully', auction });
  } catch (error) {
    console.error('Error choosing winner:', error.message);
    res.status(500).json({ message: 'Error choosing winner', error: error.message });
  }
}
