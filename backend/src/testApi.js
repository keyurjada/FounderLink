import mongoose from 'mongoose';
import Ideaform from './models/Ideaform.js';
import Application from './models/Application.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/founderlink');
  const ideas = await Ideaform.find().sort({ createdAt: -1 }).lean();
  const ideasWithCounts = [];
  for (const idea of ideas) {
    const acceptedCount = await Application.countDocuments({
      startupId: idea._id,
      status: 'Accepted'
    });
    ideasWithCounts.push({ ...idea, acceptedCount });
  }
  
  console.log(JSON.stringify(ideasWithCounts, null, 2));
  process.exit(0);
}
run();
