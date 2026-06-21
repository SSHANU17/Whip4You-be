
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whip4you');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Seed default admin user if it does not exist
    const adminEmail = 'Maansaab2210@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'P@ssw0rd',
        isAdmin: true
      });
      console.log(`👤 Default admin user seeded: ${adminEmail}`);
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

export default connectDB;
