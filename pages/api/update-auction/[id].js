import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import dbConnect from '../../../lib/db';
import Auction from '../../../models/Auction';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
  },
};

// Helper function to parse form data including files
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: path.join(process.cwd(), '/public/uploads'), // Specify the directory for auction image uploads
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit for the file
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { fields, files } = await parseForm(req); // Parse the form data
    let { auctionId, name, description, startAuction, endAuction } = fields;

    // Ensure that fields are parsed as strings and not arrays
    name = Array.isArray(name) ? name[0] : name;
    description = Array.isArray(description) ? description[0] : description;
    startAuction = Array.isArray(startAuction) ? startAuction[0] : startAuction;
    endAuction = Array.isArray(endAuction) ? endAuction[0] : endAuction;

    // Validate required fields
    if (!auctionId || !name || !description || !startAuction || !endAuction) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Construct the update object with the auction details
    const updateData = {
      name,
      description,
      startAuction: new Date(startAuction),
      endAuction: new Date(endAuction),
    };

    // Check if a new auction image was uploaded before updating the `imagePath`
    if (files.auctionImage && files.auctionImage.newFilename) {
      const auctionImagePath = `/uploads/${files.auctionImage.newFilename}`;
      updateData.imagePath = auctionImagePath; // Only update the image path if an image was uploaded
    } else {
      // Do not update `imagePath` if no new image was uploaded
      console.log('No new image uploaded, keeping the existing image path');
    }

    // Update the auction in the database
    const updatedAuction = await Auction.findByIdAndUpdate(auctionId, updateData, { new: true });

    if (!updatedAuction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.status(200).json(updatedAuction);
  } catch (error) {
    console.error('Error updating auction:', error);
    res.status(500).json({ message: 'Error updating auction' });
  }
}
