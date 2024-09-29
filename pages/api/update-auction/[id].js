import dbConnect from '../../../lib/db';
import Auction from '../../../models/Auction';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect(); // Ensure database connection
  const { id } = req.query;

  // Check if the `id` is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('Invalid auction ID:', id); // Log invalid ID
    return res.status(400).json({ message: 'Invalid auction ID' });
  }

  if (req.method === 'PUT') {
    const { name, description, startAuction, endAuction } = req.body;

    // Log incoming data
    console.log('Incoming data:', { name, description, startAuction, endAuction });

    // Validate incoming data
    if (!name || !description || !startAuction || !endAuction) {
      console.log('Missing fields in request:', { name, description, startAuction, endAuction }); // Log missing fields
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Parse dates correctly
    const startAuctionDate = new Date(startAuction);
    const endAuctionDate = new Date(endAuction);

    // Log parsed dates
    console.log('Parsed start date:', startAuctionDate);
    console.log('Parsed end date:', endAuctionDate);

    // Validate date range
    if (startAuctionDate >= endAuctionDate) {
      console.log('Invalid date range:', startAuctionDate, endAuctionDate); // Log date issue
      return res.status(400).json({ message: 'End time must be after start time.' });
    }

    try {
      // Update the auction in the database
      const updatedAuction = await Auction.findByIdAndUpdate(
        id,
        { 
          name, 
          description, 
          startAuction: startAuctionDate, 
          endAuction: endAuctionDate 
        },
        { new: true, runValidators: true } // Return the updated document and run schema validators
      );

      if (!updatedAuction) {
        console.log('Auction not found:', id); // Log not found issue
        return res.status(404).json({ message: 'Auction not found' });
      }

      console.log('Auction updated successfully:', updatedAuction); // Log successful update
      res.status(200).json(updatedAuction);
    } catch (error) {
      console.error('Error updating auction:', error.message); // Log error
      res.status(500).json({ message: 'Error updating auction', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
