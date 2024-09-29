import dbConnect from '../../lib/db';
import User from '../../models/User';
import multer from 'multer';
import nextConnect from 'next-connect';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads', // Change this to your desired directory
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  await dbConnect();

  const { userId } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imagePath = `/uploads/${req.file.filename}`;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { photo: imagePath },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile picture updated successfully', photo: imagePath });
  } catch (error) {
    res.status(500).json({ message: `Error updating profile picture: ${error.message}` });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, since we're handling file upload with multer
  },
};
