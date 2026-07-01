import mongoose from 'mongoose';
import env from './env.js';

export const connectDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!env.mongoUri) {
    throw new Error('MONGO_URI is required to connect to MongoDB');
  }

  await mongoose.connect(env.mongoUri, {
    dbName: env.dbName,
  });
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
