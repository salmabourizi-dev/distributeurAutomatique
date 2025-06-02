const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products
router.get('/', productController.getAllProducts);

// GET a single product by ID
router.get('/:id', productController.getProductById);

// GET product availability
router.get('/:id/availability', productController.checkProductAvailability);

module.exports = router;