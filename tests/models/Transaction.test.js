const Transaction = require('../../models/Transaction');
const Product = require('../../models/Product');

describe('Transaction Model', () => {
  let transaction;
  let product;

  beforeEach(() => {
    transaction = new Transaction('123');
    product = new Product('1', 'Test Product', 1.50, 5, '/test.jpg');
  });

  test('should create a transaction with correct initial values', () => {
    expect(transaction.id).toBe('123');
    expect(transaction.insertedAmount).toBe(0);
    expect(transaction.selectedProducts).toEqual([]);
    expect(transaction.status).toBe('PENDING');
    expect(transaction.change).toBe(0);
    expect(transaction.timestamp).toBeInstanceOf(Date);
  });

  test('insertCoin should add value to insertedAmount and return new total', () => {
    const value = 1.00;
    const result = transaction.insertCoin(value);
    
    expect(result).toBe(value);
    expect(transaction.insertedAmount).toBe(value);
  });

  test('insertCoin should return false for negative values', () => {
    const value = -1.00;
    const result = transaction.insertCoin(value);
    
    expect(result).toBe(false);
    expect(transaction.insertedAmount).toBe(0);
  });

  test('selectProduct should add product to selectedProducts and decrease balance when product available and sufficient funds', () => {
    transaction.insertedAmount = 2.00;
    const initialAmount = transaction.insertedAmount;
    const result = transaction.selectProduct(product);
    
    expect(result).toBe(true);
    expect(transaction.selectedProducts).toContain(product);
    expect(transaction.insertedAmount).toBe(initialAmount - product.price);
  });

  test('selectProduct should return false when product is not available', () => {
    transaction.insertedAmount = 2.00;
    product.quantity = 0;
    const result = transaction.selectProduct(product);
    
    expect(result).toBe(false);
    expect(transaction.selectedProducts).not.toContain(product);
  });

  test('selectProduct should return false when insufficient funds', () => {
    transaction.insertedAmount = 1.00;
    const result = transaction.selectProduct(product);
    
    expect(result).toBe(false);
    expect(transaction.selectedProducts).not.toContain(product);
  });

  test('calculateChange should set change to insertedAmount and reset insertedAmount', () => {
    transaction.insertedAmount = 2.00;
    const result = transaction.calculateChange();
    
    expect(result).toBe(2.00);
    expect(transaction.change).toBe(2.00);
    expect(transaction.insertedAmount).toBe(0);
  });

  test('completeTransaction should change status to COMPLETED and calculate change', () => {
    transaction.insertedAmount = 2.00;
    const result = transaction.completeTransaction();
    
    expect(result).toBe(true);
    expect(transaction.status).toBe('COMPLETED');
    expect(transaction.change).toBe(2.00);
    expect(transaction.insertedAmount).toBe(0);
  });

  test('completeTransaction should return false if transaction not PENDING', () => {
    transaction.status = 'COMPLETED';
    const result = transaction.completeTransaction();
    
    expect(result).toBe(false);
  });

  test('cancelTransaction should change status to CANCELLED, restore products, and refund money', () => {
    transaction.insertedAmount = 2.00;
    transaction.selectedProducts.push(product);
    product.quantity = 4; // Quantity was decreased when added to selectedProducts
    
    const products = [product];
    const result = transaction.cancelTransaction(products);
    
    expect(result).toBe(true);
    expect(transaction.status).toBe('CANCELLED');
    expect(transaction.change).toBe(2.00);
    expect(transaction.insertedAmount).toBe(0);
    expect(product.quantity).toBe(5); // Quantity should be restored
  });

  test('cancelTransaction should return false if transaction not PENDING', () => {
    transaction.status = 'COMPLETED';
    const products = [product];
    const result = transaction.cancelTransaction(products);
    
    expect(result).toBe(false);
  });
});