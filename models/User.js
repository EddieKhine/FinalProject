// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // URL or path to the profile picture
    default: null,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
