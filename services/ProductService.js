const Product = require('../models/Product');

/**
 * ProductService - Manages product operations
 */
class ProductService {
  constructor() {
    // Initialize with some sample products
    this.products = [
      new Product('1', 'Coca Cola', 1.50, 10, '/images/coca-cola.jpg'),
      new Product('2', 'Pepsi', 1.50, 8, '/images/pepsi.jpg'),
      new Product('3', 'Fanta', 1.50, 5, '/images/fanta.jpg'),
      new Product('4', 'Sprite', 1.50, 7, '/images/sprite.jpg'),
      new Product('5', 'Water', 1.00, 15, '/images/water.jpg'),
      new Product('6', 'Snickers', 1.20, 12, '/images/snickers.jpg'),
      new Product('7', 'Mars', 1.20, 10, '/images/mars.jpg'),
      new Product('8', 'Twix', 1.20, 8, '/images/twix.jpg'),
      new Product('9', 'KitKat', 1.30, 6, '/images/kitkat.jpg'),
      new Product('10', 'Pringles', 2.50, 4, '/images/pringles.jpg')
    ];
  }

  /**
   * Get all products
   * @returns {Array} List of all products
   */
  getAllProducts() {
    return this.products;
  }

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Product|null} Found product or null
   */
  getProductById(id) {
    return this.products.find(product => product.id === id) || null;
  }

  /**
   * Check if a product is available
   * @param {string} id - Product ID
   * @returns {boolean|null} Availability status or null if product not found
   */
  isProductAvailable(id) {
    const product = this.getProductById(id);
    return product ? product.isAvailable() : null;
  }

  /**
   * Update product quantity
   * @param {string} id - Product ID
   * @param {number} newQuantity - New quantity
   * @returns {boolean} Success status
   */
  updateProductQuantity(id, newQuantity) {
    const product = this.getProductById(id);
    if (product && newQuantity >= 0) {
      product.quantity = newQuantity;
      return true;
    }
    return false;
  }

  /**
   * Add a new product
   * @param {Product} product - New product to add
   * @returns {Product} Added product
   */
  addProduct(product) {
    this.products.push(product);
    return product;
  }
}

module.exports = ProductService;