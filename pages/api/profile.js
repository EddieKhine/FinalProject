// pages/api/profile.js
import dbConnect from '../../../lib/db'; // Ensure the path to db.js is correct
import User from '../../../models/User'; // Ensure the path to your User model is correct

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { userId } = req.query; // Assume userId is passed as a query parameter
    try {
      const user = await User.findById(userId); // Adjust based on your User model structure
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
