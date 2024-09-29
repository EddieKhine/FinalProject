import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import dbConnect from '../../lib/db';
import Auction from '../../models/Auction';

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data using Formidable
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), '/public/uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB file size limit
    });

    // Ensure the 'public/uploads' directory exists
    if (!fs.existsSync(path.join(process.cwd(), '/public/uploads'))) {
      fs.mkdirSync(path.join(process.cwd(), '/public/uploads'), { recursive: true });
    }

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  try {
    console.log("Connecting to the database...");
    await dbConnect();
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error("Database connection error:", error.message);
    return res.status(500).json({ message: "Database connection failed.", error: error.message });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Parse form data and files
    const { fields, files } = await parseForm(req);

    // Convert arrays to strings (Formidable may return arrays for text fields)
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const startAuction = Array.isArray(fields.startAuction) ? fields.startAuction[0] : fields.startAuction;
    const endAuction = Array.isArray(fields.endAuction) ? fields.endAuction[0] : fields.endAuction;
    const creator = Array.isArray(fields.creator) ? fields.creator[0] : fields.creator;

    if (!name || !description || !startAuction || !endAuction || !creator) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Access the uploaded image file
    const image = files.image && files.image[0];
    const imagePath = image ? `/uploads/${image.newFilename}` : null;

    // Create new auction
    const newAuction = new Auction({
      creator,
      name,
      description,
      startAuction,
      endAuction,
      imagePath,
      isActive: true,
      createdAt: new Date(),
    });

    await newAuction.save();

    res.status(201).json({ message: 'Auction created successfully', auction: newAuction });
  } catch (error) {
    console.error("Error creating auction:", error.message);
    res.status(500).json({ message: 'Error creating auction', error: error.message });
  }
}
