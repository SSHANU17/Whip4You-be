import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/whip4you';
    console.log(`Connecting to database: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to database successfully.');

    const adminEmail = 'Maansaab2210@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log(`Admin user with email "${adminEmail}" already exists in the database.`);
      // Update the password in case it was modified or wrong
      adminExists.password = 'P@ssw0rd';
      await adminExists.save();
      console.log('Admin user password has been reset to "P@ssw0rd".');
    } else {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'P@ssw0rd',
        isAdmin: true
      });
      console.log(`Admin user "${adminEmail}" successfully created/seeded.`);
    }

    await mongoose.disconnect();
    console.log('Database disconnected. Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seed();
