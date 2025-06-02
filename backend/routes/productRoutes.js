const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, bulkUploadProducts, createProductReview } = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.route('/').get(getProducts);
router.route('/').post(protect, admin, createProduct);
router.route('/bulk-upload').post(protect, admin, upload.single('file'), bulkUploadProducts);
router.route('/:id').get(getProductById);
router.route('/:id').put(protect, admin, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;