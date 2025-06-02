const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const adminConfig = require('../config/adminConfig');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Email:', email);
  console.log('Received Password:', password);

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    console.log('Password Match Result:', await user.matchPassword(password));
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    console.log('Password Match Result: false or User not found');
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Auth admin & get token
// @route   POST /api/users/admin/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (username === adminConfig.ADMIN_USERNAME && password === adminConfig.ADMIN_PASSWORD) {
    res.json({
      _id: 'admin',
      name: 'Admin',
      isAdmin: true,
      token: generateToken('admin'), // Generate a token for admin, perhaps a different type or with specific claims
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = { authUser, registerUser, getUserProfile, getUsers, authAdmin };