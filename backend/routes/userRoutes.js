const express = require('express');
const router = express.Router();
const { authUser, getUsers, authAdmin } = require('../controllers/userController');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const { registerUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, getUsers);
router.post('/login', authUser);
router.post('/admin/login', authAdmin); // New route for admin login
router.route('/profile').get(protect, getUserProfile);

module.exports = router;