import mongoose from 'mongoose';
import User from '../models/User.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/founderlink');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed demo users if not present
    const hasSarah = await User.findOne({ email: 'sarah.jenkins@founder.com' });
    if (!hasSarah) {
      await User.create({
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@founder.com',
        password: 'password',
        role: 'Founder'
      });
      console.log('Seeded Sarah Jenkins (Founder)');
    }

    const hasAlex = await User.findOne({ email: 'alex.rivera@devmail.com' });
    if (!hasAlex) {
      await User.create({
        name: 'Alex Rivera',
        email: 'alex.rivera@devmail.com',
        password: 'password',
        role: 'Talent'
      });
      console.log('Seeded Alex Rivera (Talent)');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
