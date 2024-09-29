// pages/api/check-session.js
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized. No session found.' });
  }

  res.status(200).json({ message: 'Session found', session });
}
