const TransactionService = require('../../services/TransactionService');
const Transaction = require('../../models/Transaction');
const Product = require('../../models/Product');

// Mock uuid to return predictable values
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

describe('TransactionService', () => {
  let transactionService;
  let product;

  beforeEach(() => {
    transactionService = new TransactionService();
    product = new Product('1', 'Test Product', 1.50, 5, '/test.jpg');
  });

  test('should initialize with empty transactions array', () => {
    expect(transactionService.transactions).toEqual([]);
  });

  test('should initialize with accepted coin values', () => {
    expect(transactionService.acceptedCoinValues).toEqual([0.05, 0.10, 0.20, 0.50, 1.00, 2.00]);
  });

  test('createTransaction should create a new transaction with UUID and add to transactions array', () => {
    const transaction = transactionService.createTransaction();
    
    expect(transaction).toBeInstanceOf(Transaction);
    expect(transaction.id).toBe('mock-uuid');
    expect(transactionService.transactions).toContain(transaction);
  });

  test('getTransaction should return transaction with matching id', () => {
    const transaction = transactionService.createTransaction();
    const result = transactionService.getTransaction(transaction.id);
    
    expect(result).toEqual(transaction);
  });

  test('getTransaction should return null for non-existent id', () => {
    const result = transactionService.getTransaction('non-existent-id');
    expect(result).toBeNull();
  });

  test('insertCoin should add coin value to transaction and return updated transaction', () => {
    const transaction = transactionService.createTransaction();
    const coinValue = 1.00;
    const initialAmount = transaction.insertedAmount;
    
    const result = transactionService.insertCoin(transaction.id, coinValue);
    
    expect(result).toEqual(transaction);
    expect(transaction.insertedAmount).toBe(initialAmount + coinValue);
  });

  test('insertCoin should return false for non-accepted coin value', () => {
    const transaction = transactionService.createTransaction();
    const coinValue = 0.30; // Not in acceptedCoinValues
    
    const result = transactionService.insertCoin(transaction.id, coinValue);
    
    expect(result).toBe(false);
  });

  test('insertCoin should return false for non-existent transaction', () => {
    const result = transactionService.insertCoin('non-existent-id', 1.00);
    expect(result).toBe(false);
  });

  test('insertCoin should return false for non-PENDING transaction', () => {
    const transaction = transactionService.createTransaction();
    transaction.status = 'COMPLETED';
    
    const result = transactionService.insertCoin(transaction.id, 1.00);
    
    expect(result).toBe(false);
  });

  test('selectProduct should add product to transaction and return updated transaction', () => {
    const transaction = transactionService.createTransaction();
    transaction.insertedAmount = 2.00;
    
    const result = transactionService.selectProduct(transaction.id, product);
    
    expect(result).toEqual(transaction);
    expect(transaction.selectedProducts).toContain(product);
  });

  test('selectProduct should return false when insufficient funds', () => {
    const transaction = transactionService.createTransaction();
    transaction.insertedAmount = 1.00;
    product.price = 2.00;
    
    const result = transactionService.selectProduct(transaction.id, product);
    
    expect(result).toBe(false);
  });

  test('selectProduct should return false for non-existent transaction', () => {
    const result = transactionService.selectProduct('non-existent-id', product);
    expect(result).toBe(false);
  });

  test('selectProduct should return false for non-PENDING transaction', () => {
    const transaction = transactionService.createTransaction();
    transaction.status = 'COMPLETED';
    
    const result = transactionService.selectProduct(transaction.id, product);
    
    expect(result).toBe(false);
  });

  test('completeTransaction should complete transaction and return updated transaction', () => {
    const transaction = transactionService.createTransaction();
    transaction.insertedAmount = 2.00;
    
    const result = transactionService.completeTransaction(transaction.id);
    
    expect(result).toEqual(transaction);
    expect(transaction.status).toBe('COMPLETED');
    expect(transaction.change).toBe(2.00);
  });

  test('completeTransaction should return false for non-existent transaction', () => {
    const result = transactionService.completeTransaction('non-existent-id');
    expect(result).toBe(false);
  });

  test('completeTransaction should return false for non-PENDING transaction', () => {
    const transaction = transactionService.createTransaction();
    transaction.status = 'COMPLETED';
    
    const result = transactionService.completeTransaction(transaction.id);
    
    expect(result).toBe(false);
  });

  test('cancelTransaction should cancel transaction, refund money, and return updated transaction', () => {
    const transaction = transactionService.createTransaction();
    transaction.insertedAmount = 2.00;
    transaction.selectedProducts.push(product);
    
    const products = [product];
    const result = transactionService.cancelTransaction(transaction.id, products);
    
    expect(result).toEqual(transaction);
    expect(transaction.status).toBe('CANCELLED');
    expect(transaction.change).toBe(2.00);
  });

  test('cancelTransaction should return false for non-existent transaction', () => {
    const products = [product];
    const result = transactionService.cancelTransaction('non-existent-id', products);
    expect(result).toBe(false);
  });

  test('cancelTransaction should return false for non-PENDING transaction', () => {
    const transaction = transactionService.createTransaction();
    transaction.status = 'COMPLETED';
    
    const products = [product];
    const result = transactionService.cancelTransaction(transaction.id, products);
    
    expect(result).toBe(false);
  });

  test('getAllTransactions should return all transactions', () => {
    transactionService.createTransaction();
    transactionService.createTransaction();
    
    const result = transactionService.getAllTransactions();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    result.forEach(transaction => {
      expect(transaction).toBeInstanceOf(Transaction);
    });
  });
});