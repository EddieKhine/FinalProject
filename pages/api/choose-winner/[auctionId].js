import dbConnect from '../../../lib/db';
import Auction from '../../../models/Auction';

export default async function handler(req, res) {
  await dbConnect();

  const { auctionId } = req.query;

  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { bidId } = req.body;

  if (!auctionId || !bidId) {
    return res.status(400).json({ message: 'Auction ID and Bid ID are required.' });
  }

  try {
    const auction = await Auction.findByIdAndUpdate(
      auctionId,
      { winner: bidId },
      { new: true }
    ).populate('winner');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found.' });
    }

    res.status(200).json(auction);
  } catch (error) {
    console.error('Error choosing winner:', error.message);
    res.status(500).json({ message: 'Error choosing winner.', error: error.message });
  }
}
