/**
 * Transaction Model - Manages the state of a vending machine transaction
 */
class Transaction {
  constructor(id) {
    this.id = id;
    this.insertedAmount = 0;
    this.selectedProducts = [];
    this.status = 'PENDING'; // PENDING, COMPLETED, CANCELLED
    this.change = 0;
    this.timestamp = new Date();
  }

  insertCoin(value) {
    if (value > 0) {
      this.insertedAmount += value;
      return this.insertedAmount;
    }
    return false;
  }

  selectProduct(product) {
    if (product.isAvailable() && this.insertedAmount >= product.price) {
      this.selectedProducts.push(product);
      this.insertedAmount -= product.price;
      product.decreaseQuantity();
      return true;
    }
    return false;
  }

  calculateChange() {
    this.change = this.insertedAmount;
    this.insertedAmount = 0;
    return this.change;
  }

  completeTransaction() {
    if (this.status === 'PENDING') {
      this.status = 'COMPLETED';
      this.calculateChange();
      return true;
    }
    return false;
  }

  cancelTransaction(products) {
    if (this.status === 'PENDING') {
      // Return selected products to inventory
      this.selectedProducts.forEach(product => {
        const originalProduct = products.find(p => p.id === product.id);
        if (originalProduct) {
          originalProduct.increaseQuantity();
        }
      });

      // Set change to return all inserted money
      this.change = this.insertedAmount;
      this.insertedAmount = 0;
      this.status = 'CANCELLED';
      return true;
    }
    return false;
  }
}

module.exports = Transaction;