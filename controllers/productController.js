const ProductService = require('../services/ProductService');

// Create a new instance of ProductService
const productService = new ProductService();

// Product Controller
const productController = {
  // Get all products
  getAllProducts: (req, res) => {
    try {
      const products = productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a single product by ID
  getProductById: (req, res) => {
    try {
      const id = req.params.id;
      const product = productService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Check if product is available
  checkProductAvailability: (req, res) => {
    try {
      const id = req.params.id;
      const isAvailable = productService.isProductAvailable(id);
      
      if (isAvailable === null) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json({ available: isAvailable });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = productController;