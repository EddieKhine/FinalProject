import jwt from 'jsonwebtoken';

export const verifyToken = (token) => {
  if (!token) {
    throw new Error('No token provided');
  }

  // Log the secret for debugging (make sure to remove this in production)
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // This will return the decoded payload
  } catch (err) {
    console.error("Token verification error:", err); // Log the error for debugging
    throw new Error('Invalid token');
  }
};
