import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    
    // Clean up outdated legacy username and firebaseUid indexes to prevent duplicate keys
    try {
      await conn.connection.collection('users').dropIndex('username_1');
      console.log('[Database] Dropped legacy unique username index.');
    } catch (err) {
      // Index didn't exist or already dropped, ignore
    }

    try {
      await conn.connection.collection('users').dropIndex('firebaseUid_1');
      console.log('[Database] Dropped legacy unique firebaseUid index.');
    } catch (err) {
      // Index didn't exist or already dropped, ignore
    }
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    // Do not call process.exit(1) so the Express server remains online and returns friendly JSON errors to the user
  }
};

export default connectDB;
