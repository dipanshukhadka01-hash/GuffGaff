import mongoose from 'mongoose';

export const connectDatabase = async (mongoUri) => {
  try {
    if (!mongoUri) {
      throw new Error('Missing MONGODB_URI environment variable.');
    }

    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || 'guffgaff'
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error', error);
    throw error;
  }
};
