import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {

  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) {
    return console.log('MISSING MONGODB_URL');
  }

  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: 'devflow',
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });

    isConnected = true;
    console.log('MongoDB is connected');
  } catch (error) {
    console.log('MongoDB connection failed', error);
  }
};
