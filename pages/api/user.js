import dbConnect from '../../lib/db';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  // Assuming the client sends the user object in the headers
  const { id, email } = req.headers; 

  if (!id || !email) {
    return res.status(401).json({ message: 'Unauthorized: No user data provided' });
  }

  try {
    // Find the user by both ID and email to ensure it's correct
    const user = await User.findOne({ _id: id, email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return only the necessary fields
    return res.status(200).json({ id: user._id, username: user.username, email: user.email });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user data' });
  }
}
