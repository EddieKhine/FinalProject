import dbConnect from '../../lib/db';
import Auction from '../../models/Auction';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); // Store images in public/uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

// API handler for auctions
export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const auctions = await Auction.find({}).populate('creator', 'username'); // Get auctions and populate creator
      res.status(200).json(auctions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch auctions' });
    }
  } else if (req.method === 'POST') {
    upload.single('photo')(req, res, async (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const { name, description, startTime, endTime } = req.body;
      const photo = `/uploads/${req.file.filename}`; // Set the photo URL
      const creator = req.body.username; // Get the username from the request body

      try {
        const auction = new Auction({
          name,
          description,
          photo,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          creator, // Use username for creator
        });
        await auction.save();
        res.status(201).json(auction);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create auction' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
