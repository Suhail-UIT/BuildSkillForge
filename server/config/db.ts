import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ MONGODB_URI not provided. Running in persistent memory/local mode with built-in storage engine.');
    return false;
  }

  try {
    if (!isConnected) {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log('✅ Connected to MongoDB Atlas successfully.');
    }
    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB Atlas connection failed. Falling back to local storage engine:', (error as Error).message);
    return false;
  }
}
