const Product = require('../../models/Product');

describe('Product Model', () => {
  let product;

  beforeEach(() => {
    product = new Product('1', 'Test Product', 1.50, 5, '/test.jpg');
  });

  test('should create a product with correct properties', () => {
    expect(product.id).toBe('1');
    expect(product.name).toBe('Test Product');
    expect(product.price).toBe(1.50);
    expect(product.quantity).toBe(5);
    expect(product.imagePath).toBe('/test.jpg');
  });

  test('isAvailable should return true when quantity > 0', () => {
    expect(product.isAvailable()).toBe(true);
  });

  test('isAvailable should return false when quantity = 0', () => {
    product.quantity = 0;
    expect(product.isAvailable()).toBe(false);
  });

  test('decreaseQuantity should decrease quantity by 1 and return true when quantity > 0', () => {
    const initialQuantity = product.quantity;
    const result = product.decreaseQuantity();
    
    expect(result).toBe(true);
    expect(product.quantity).toBe(initialQuantity - 1);
  });

  test('decreaseQuantity should return false and not change quantity when quantity = 0', () => {
    product.quantity = 0;
    const result = product.decreaseQuantity();
    
    expect(result).toBe(false);
    expect(product.quantity).toBe(0);
  });

  test('increaseQuantity should increase quantity by specified amount', () => {
    const initialQuantity = product.quantity;
    const amount = 3;
    const result = product.increaseQuantity(amount);
    
    expect(result).toBe(initialQuantity + amount);
    expect(product.quantity).toBe(initialQuantity + amount);
  });

  test('increaseQuantity should increase quantity by 1 when no amount specified', () => {
    const initialQuantity = product.quantity;
    const result = product.increaseQuantity();
    
    expect(result).toBe(initialQuantity + 1);
    expect(product.quantity).toBe(initialQuantity + 1);
  });

  test('updatePrice should update price and return true for valid price', () => {
    const newPrice = 2.00;
    const result = product.updatePrice(newPrice);
    
    expect(result).toBe(true);
    expect(product.price).toBe(newPrice);
  });

  test('updatePrice should return false and not update price for negative price', () => {
    const initialPrice = product.price;
    const newPrice = -1.00;
    const result = product.updatePrice(newPrice);
    
    expect(result).toBe(false);
    expect(product.price).toBe(initialPrice);
  });
});