const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');

// @desc    Fetch all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

module.exports = { getOrders };