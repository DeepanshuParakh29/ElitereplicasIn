const express = require('express');
const router = express.Router();
const { getOrders } = require('../controllers/orderController');

// @desc    Fetch all orders
// @route   GET /api/orders
// @access  Private/Admin
router.route('/').get(getOrders);

module.exports = router;