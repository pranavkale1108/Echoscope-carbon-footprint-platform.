import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Clean up outdated legacy username index to prevent duplicate keys with Firebase auth
    try {
      await conn.connection.collection('users').dropIndex('username_1');
      console.log('[Database] Dropped legacy unique username index.');
    } catch (err) {
      // Index didn't exist or already dropped, ignore
    }
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
