import { IncomingForm } from 'formidable'; // Correct import
import fs from 'fs';
import path from 'path';
import dbConnect from '../../lib/db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ensure the upload directory exists
  const profileUploadDir = path.join(process.cwd(), '/public/uploads/profiles');
  try {
    if (!fs.existsSync(profileUploadDir)) {
      console.log('Creating upload directory...');
      fs.mkdirSync(profileUploadDir, { recursive: true });
      console.log('Directory created.');
    } else {
      console.log('Upload directory exists.');
    }
  } catch (err) {
    console.error('Error creating upload directory:', err);
    return res.status(500).json({ message: 'Failed to create upload directory' });
  }

  const form = new IncomingForm({
    uploadDir: profileUploadDir, // Set upload directory
    keepExtensions: true, // Keep file extensions
    maxFileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    console.log('Parsed fields:', fields);
    console.log('Parsed files:', files);

    const { username, email, password } = fields;
    const profilePicture = files.profilePicture;

    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }

    try {
      const updateData = { username };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      if (profilePicture) {
        const profilePicturePath = `/uploads/profiles/${profilePicture.newFilename}`;
        updateData.profilePicture = profilePicturePath;
        console.log('Profile picture path:', profilePicturePath);
      }

      const user = await User.findOneAndUpdate({ email }, updateData, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  });
}
