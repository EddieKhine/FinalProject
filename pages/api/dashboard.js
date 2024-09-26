// In your API route (e.g., /api/dashboard.js)
import { verifyToken } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Get the token from the header

    try {
      const decoded = verifyToken(token); // Verify the token
      // Proceed with your logic, e.g., fetching dashboard data
      res.status(200).json({ message: 'Data fetched successfully', user: decoded });
    } catch (error) {
      return res.status(401).json({ message: error.message }); // Return error if token is invalid
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
