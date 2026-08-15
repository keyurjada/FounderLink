import mongoose from 'mongoose';
import Ideaform from './models/Ideaform.js';
import Application from './models/Application.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/founderlink');
  const ideas = await Ideaform.find().lean();
  for (const idea of ideas) {
    const acceptedCount = await Application.countDocuments({
      startupId: idea._id,
      status: 'Accepted'
    });
    console.log(`Idea: ${idea.startuptitle}, teamsize: ${idea.teamsize} (${typeof idea.teamsize}), acceptedCount: ${acceptedCount}`);
  }
  process.exit(0);
}
run();
