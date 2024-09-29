// pages/api/delete-auction/[id].js
import dbConnect from '../../../lib/db';
import Auction from '../../../models/Auction';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const deletedAuction = await Auction.findByIdAndDelete(id);
      if (!deletedAuction) {
        return res.status(404).json({ message: 'Auction not found' });
      }
      res.status(200).json({ message: 'Auction deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting auction', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
