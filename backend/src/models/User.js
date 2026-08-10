import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Founder', 'Talent'],
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    profilePicture: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    languages: {
      type: [String],
      default: []
    },
    resume: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// hashes password with bcrypt salt before committing to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// helpers for password check
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
