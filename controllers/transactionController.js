const TransactionService = require('../services/TransactionService');
const ProductService = require('../services/ProductService');

// Create service instances
const transactionService = new TransactionService();
const productService = new ProductService();

// Transaction Controller
const transactionController = {
  // Start a new transaction
  startTransaction: (req, res) => {
    try {
      const transaction = transactionService.createTransaction();
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Insert coin into transaction
  insertCoin: (req, res) => {
    try {
      const { transactionId, value } = req.body;
      
      if (!transactionId || !value) {
        return res.status(400).json({ message: 'Transaction ID and coin value are required' });
      }

      const result = transactionService.insertCoin(transactionId, parseFloat(value));
      
      if (!result) {
        return res.status(404).json({ message: 'Transaction not found or invalid coin value' });
      }
      
      res.status(200).json({ 
        transactionId, 
        insertedAmount: result.insertedAmount,
        message: `Inserted ${value} successfully` 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Select a product
  selectProduct: (req, res) => {
    try {
      const { transactionId, productId } = req.body;
      
      if (!transactionId || !productId) {
        return res.status(400).json({ message: 'Transaction ID and product ID are required' });
      }

      const product = productService.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const result = transactionService.selectProduct(transactionId, product);
      
      if (!result) {
        return res.status(400).json({ 
          message: 'Unable to select product. Check if transaction exists, product is available, and sufficient funds inserted.' 
        });
      }
      
      res.status(200).json({ 
        transactionId, 
        selectedProduct: product.name,
        remainingBalance: result.insertedAmount,
        message: 'Product selected successfully' 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Complete transaction
  completeTransaction: (req, res) => {
    try {
      const { transactionId } = req.body;
      
      if (!transactionId) {
        return res.status(400).json({ message: 'Transaction ID is required' });
      }

      const result = transactionService.completeTransaction(transactionId);
      
      if (!result) {
        return res.status(404).json({ message: 'Transaction not found or already completed/cancelled' });
      }
      
      res.status(200).json({ 
        transactionId, 
        status: 'COMPLETED',
        change: result.change,
        selectedProducts: result.selectedProducts.map(p => p.name),
        message: 'Transaction completed successfully' 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Cancel transaction
  cancelTransaction: (req, res) => {
    try {
      const { transactionId } = req.body;
      
      if (!transactionId) {
        return res.status(400).json({ message: 'Transaction ID is required' });
      }

      const products = productService.getAllProducts();
      const result = transactionService.cancelTransaction(transactionId, products);
      
      if (!result) {
        return res.status(404).json({ message: 'Transaction not found or already completed/cancelled' });
      }
      
      res.status(200).json({ 
        transactionId, 
        status: 'CANCELLED',
        refundedAmount: result.change,
        message: 'Transaction cancelled successfully' 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get transaction details
  getTransaction: (req, res) => {
    try {
      const { id } = req.params;
      const transaction = transactionService.getTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = transactionController;