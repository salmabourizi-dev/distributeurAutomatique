const Transaction = require('../models/Transaction');
const { v4: uuidv4 } = require('uuid');

/**
 * TransactionService - Manages transaction operations
 */
class TransactionService {
  constructor() {
    this.transactions = [];
    this.acceptedCoinValues = [0.05, 0.10, 0.20, 0.50, 1.00, 2.00]; // Euro coins
  }

  /**
   * Create a new transaction
   * @returns {Transaction} New transaction
   */
  createTransaction() {
    const id = uuidv4();
    const transaction = new Transaction(id);
    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Get transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Transaction|null} Found transaction or null
   */
  getTransaction(id) {
    return this.transactions.find(transaction => transaction.id === id) || null;
  }

  /**
   * Insert coin into transaction
   * @param {string} transactionId - Transaction ID
   * @param {number} value - Coin value
   * @returns {Transaction|false} Updated transaction or false if failed
   */
  insertCoin(transactionId, value) {
    const transaction = this.getTransaction(transactionId);
    
    if (!transaction || transaction.status !== 'PENDING') {
      return false;
    }

    // Check if coin value is accepted
    if (!this.acceptedCoinValues.includes(value)) {
      return false;
    }

    transaction.insertCoin(value);
    return transaction;
  }

  /**
   * Select a product in a transaction
   * @param {string} transactionId - Transaction ID
   * @param {Product} product - Product to select
   * @returns {Transaction|false} Updated transaction or false if failed
   */
  selectProduct(transactionId, product) {
    const transaction = this.getTransaction(transactionId);
    
    if (!transaction || transaction.status !== 'PENDING') {
      return false;
    }

    const success = transaction.selectProduct(product);
    return success ? transaction : false;
  }

  /**
   * Complete a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Transaction|false} Completed transaction or false if failed
   */
  completeTransaction(transactionId) {
    const transaction = this.getTransaction(transactionId);
    
    if (!transaction || transaction.status !== 'PENDING') {
      return false;
    }

    transaction.completeTransaction();
    return transaction;
  }

  /**
   * Cancel a transaction
   * @param {string} transactionId - Transaction ID
   * @param {Array} products - List of all products to restore inventory
   * @returns {Transaction|false} Cancelled transaction or false if failed
   */
  cancelTransaction(transactionId, products) {
    const transaction = this.getTransaction(transactionId);
    
    if (!transaction || transaction.status !== 'PENDING') {
      return false;
    }

    transaction.cancelTransaction(products);
    return transaction;
  }

  /**
   * Get all transactions
   * @returns {Array} List of all transactions
   */
  getAllTransactions() {
    return this.transactions;
  }
}

module.exports = TransactionService;