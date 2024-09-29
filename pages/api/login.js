// pages/api/login.js
import dbConnect from '../../lib/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Establish the database connection
  await dbConnect();

  // Only allow POST method
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Ensure username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      // Generate a JWT token
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      // Return the token and username
      return res.status(200).json({ token, username: user.username });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
