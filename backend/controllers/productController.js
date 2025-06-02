const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, stock, sku } = req.body;

  const product = new Product({
    name,
    price,
    description,
    image,
    brand,
    category,
    stock,
    sku,
    user: req.user._id, // Assuming user is authenticated and available in req.user
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, stock, sku } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.stock = stock;
    product.sku = sku;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const bulkUploadProducts = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const xlsx = require('xlsx');
  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const productsData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const createdProducts = [];
  const errors = [];

  for (const productData of productsData) {
    try {
      // Basic validation
      if (!productData['Product Name'] || !productData['Price'] || !productData['Stock'] || !productData['Category'] || !productData['SKU']) {
        errors.push({ product: productData, message: 'Missing required fields' });
        continue;
      }

      // Check for duplicate SKU (assuming SKU is unique)
      const existingProduct = await Product.findOne({ sku: productData['SKU'] });
      if (existingProduct) {
        errors.push({ product: productData, message: 'Duplicate SKU' });
        continue;
      }

      const product = new Product({
        name: productData['Product Name'],
        description: productData['Description'],
        price: productData['Price'],
        stock: productData['Stock'],
        category: productData['Category'],
        sku: productData['SKU'],
        image: productData['Image URL / file'],
        user: req.user._id, // Assuming user is authenticated and available in req.user
      });

      const createdProduct = await product.save();
      createdProducts.push(createdProduct);
    } catch (error) {
      errors.push({ product: productData, message: error.message });
    }
  }

  if (errors.length > 0) {
    res.status(207).json({ message: 'Bulk upload completed with some errors', createdProducts, errors });
  } else {
    res.status(201).json({ message: 'Bulk upload completed successfully', createdProducts });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, bulkUploadProducts, createProductReview };