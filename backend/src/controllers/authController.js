import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'founderlink-local-secret';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

// Register a new user account
const registerUser = async (req, res) => {
  const { name, email, password, role, phone, title } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || '',
      title: title || ''
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        title: user.title || '',
        profilePicture: user.profilePicture,
        skills: user.skills || [],
        languages: user.languages || [],
        resume: user.resume || '',
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user and returns jwt token
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        title: user.title || '',
        profilePicture: user.profilePicture,
        skills: user.skills || [],
        languages: user.languages || [],
        resume: user.resume || '',
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Return user profile info
const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      title: req.user.title || '',
      profilePicture: req.user.profilePicture,
      skills: req.user.skills || [],
      languages: req.user.languages || [],
      resume: req.user.resume || ''
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    if (req.body.title !== undefined) {
      user.title = req.body.title;
    }

    if (req.body.profilePicture !== undefined) {
      user.profilePicture = req.body.profilePicture;
    }

    if (req.body.skills !== undefined) {
      user.skills = normalizeList(req.body.skills);
    }

    if (req.body.languages !== undefined) {
      user.languages = normalizeList(req.body.languages);
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      title: updatedUser.title || '',
      profilePicture: updatedUser.profilePicture,
      skills: updatedUser.skills || [],
      languages: updatedUser.languages || [],
      resume: updatedUser.resume || '',
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const getTalents = async (req, res) => {
  try {
    const talents = await User.find({ role: 'Talent' }).select('-password');
    res.json(talents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadUserResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (req.file) {
      user.resume = req.file.path;
      await user.save();
      return res.json({ resume: user.resume, message: 'Resume uploaded successfully' });
    } else {
      return res.status(400).json({ message: 'No file provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, authUser, getUserProfile, updateUserProfile, getTalents, uploadUserResume };
