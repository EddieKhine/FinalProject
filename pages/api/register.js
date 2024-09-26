// pages/api/register.js
import dbConnect from '../../lib/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
