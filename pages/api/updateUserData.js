import dbConnect from '../../lib/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, username, password } = req.body;

  if (!email || !username) {
    return res.status(400).json({ message: 'Email and username are required' });
  }

  try {
    const updateData = {
      username,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const user = await User.findOneAndUpdate(
      { email }, // Find user by email
      updateData, // Update user information
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user' });
  }
}
