import dbConnect from '../../lib/db';
import User from '../../models/User';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  await dbConnect();

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return only the necessary fields
    return res.status(200).json({ id: user._id, username: user.username, email: user.email });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user data' });
  }
}
