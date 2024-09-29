import formidable from 'formidable';
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

  const form = formidable({
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

    let { username, email, password } = fields;
    const profilePicture = files.profilePicture ? files.profilePicture[0] : null;

    // Handle cases where Formidable sends fields as arrays
    username = Array.isArray(username) ? username[0] : username;
    email = Array.isArray(email) ? email[0] : email;
    password = Array.isArray(password) ? password[0] : password;

    if (!email || !username) {
      return res.status(400).json({ message: 'Email and username are required' });
    }

    try {
      const updateData = {};

      // Only update the username if provided
      if (username && username.trim() !== '') {
        updateData.username = username;
      }

      // Only hash and update the password if it's provided and not empty
      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        updateData.password = hashedPassword;
      }

      // Handle profile picture upload and set the path in the database if provided
      if (profilePicture) {
        const profilePicturePath = `/uploads/profiles/${profilePicture.newFilename}`;
        updateData.profilePicture = profilePicturePath;
        console.log('Profile picture path to be updated:', profilePicturePath);
      } else {
        console.log('No profile picture uploaded');
      }

      // Update the user data in MongoDB
      const user = await User.findOneAndUpdate({ email }, updateData, { new: true });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('User successfully updated:', user);
      return res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  });
}
