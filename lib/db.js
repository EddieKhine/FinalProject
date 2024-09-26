import mongoose from 'mongoose';

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    throw error; // Rethrow the error to be caught in the API
  }
};

export default dbConnect;
