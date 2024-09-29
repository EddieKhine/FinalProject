import dbConnect from '../../lib/db';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, userID } = req.body;

  if (!email || !userID) {
    return res.status(400).json({ message: 'Email and userID are required' });
  }

  try {
    const user = await User.findOne({ _id: userID, email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data without password
    const userData = {
      username: user.username,
      email: user.email,
    };

    return res.status(200).json(userData);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user data' });
  }
}
