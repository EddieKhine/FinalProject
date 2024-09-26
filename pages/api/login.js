import dbConnect from '../../lib/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Ensure the JWT secret is correctly referenced
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, username: user.username });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
