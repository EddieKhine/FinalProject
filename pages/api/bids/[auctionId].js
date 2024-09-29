import dbConnect from '../../../lib/db';
import Bid from '../../../models/Bid';

export default async function handler(req, res) {
  await dbConnect();
  const { auctionId } = req.query;

  if (req.method === 'GET') {
    try {
      const bids = await Bid.find({ auction: auctionId }).populate('bidder', 'username email');
      res.status(200).json(bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      res.status(500).json({ message: 'Error fetching bids', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
