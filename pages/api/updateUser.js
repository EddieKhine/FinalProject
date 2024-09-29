import dbConnect from '../../lib/db';
import User from '../../models/User';
import { getSession } from 'next-auth/react';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getSession({ req });

  // Log session information for debugging
  console.log('Session in API route:', session);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      const updateData = {
        username,
        email,
      };

      // Only hash the password if it's being updated
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await User.findOneAndUpdate(
        { email: session.user.email }, // Find user by email from session
        updateData, // Update user information
        { new: true } // Return the updated document
      );

      return res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
