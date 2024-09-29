import dbConnect from '../../lib/db';
import Auction from '../../models/Auction';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, description, startAuction, endAuction, creator } = req.body;

  // Validate the input
  if (!name || !description || !startAuction || !endAuction || !creator) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  // Check if the dates are valid
  if (new Date(startAuction) >= new Date(endAuction)) {
    return res.status(400).json({ message: 'End time must be after start time.' });
  }

  try {
    // Ensure the creator is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(creator)) {
      return res.status(400).json({ message: 'Invalid creator ID format' });
    }

    // Create a new auction document
    const newAuction = new Auction({
      creator, // Already validated as ObjectId
      name,
      description,
      startAuction,
      endAuction,
      isActive: true, // Ensure isActive is set to true
      createdAt: new Date(),
    });

    await newAuction.save();

    res.status(201).json({ message: 'Auction created successfully', auction: newAuction });
  } catch (error) {
    console.error('Error creating auction:', error.message);
    res.status(500).json({ message: 'Error creating auction', error: error.message });
  }
}
