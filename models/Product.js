/**
 * Product Model - Represents a product in the vending machine
 */
class Product {
  constructor(id, name, price, quantity, imagePath) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.imagePath = imagePath;
  }

  isAvailable() {
    return this.quantity > 0;
  }

  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity -= 1;
      return true;
    }
    return false;
  }

  increaseQuantity(amount = 1) {
    this.quantity += amount;
    return this.quantity;
  }

  updatePrice(newPrice) {
    if (newPrice >= 0) {
      this.price = newPrice;
      return true;
    }
    return false;
  }
}

module.exports = Product;