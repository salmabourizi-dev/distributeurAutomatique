const ProductService = require('../../services/ProductService');
const Product = require('../../models/Product');

describe('ProductService', () => {
  let productService;

  beforeEach(() => {
    productService = new ProductService();
  });

  test('should initialize with sample products', () => {
    const products = productService.getAllProducts();
    expect(products.length).toBeGreaterThan(0);
    products.forEach(product => {
      expect(product).toBeInstanceOf(Product);
    });
  });

  test('getAllProducts should return all products', () => {
    const products = productService.getAllProducts();
    expect(Array.isArray(products)).toBe(true);
  });

  test('getProductById should return product with matching id', () => {
    const products = productService.getAllProducts();
    const firstProduct = products[0];
    const result = productService.getProductById(firstProduct.id);
    
    expect(result).toEqual(firstProduct);
  });

  test('getProductById should return null for non-existent id', () => {
    const result = productService.getProductById('non-existent-id');
    expect(result).toBeNull();
  });

  test('isProductAvailable should return true for product with quantity > 0', () => {
    const products = productService.getAllProducts();
    const availableProduct = products.find(p => p.quantity > 0);
    const result = productService.isProductAvailable(availableProduct.id);
    
    expect(result).toBe(true);
  });

  test('isProductAvailable should return false for product with quantity = 0', () => {
    const products = productService.getAllProducts();
    const product = products[0];
    const originalQuantity = product.quantity;
    
    // Set quantity to 0
    product.quantity = 0;
    const result = productService.isProductAvailable(product.id);
    
    expect(result).toBe(false);
    
    // Restore original quantity
    product.quantity = originalQuantity;
  });

  test('isProductAvailable should return null for non-existent id', () => {
    const result = productService.isProductAvailable('non-existent-id');
    expect(result).toBeNull();
  });

  test('updateProductQuantity should update quantity for valid id and quantity', () => {
    const products = productService.getAllProducts();
    const product = products[0];
    const newQuantity = 20;
    
    const result = productService.updateProductQuantity(product.id, newQuantity);
    
    expect(result).toBe(true);
    expect(product.quantity).toBe(newQuantity);
  });

  test('updateProductQuantity should return false for negative quantity', () => {
    const products = productService.getAllProducts();
    const product = products[0];
    const originalQuantity = product.quantity;
    const newQuantity = -5;
    
    const result = productService.updateProductQuantity(product.id, newQuantity);
    
    expect(result).toBe(false);
    expect(product.quantity).toBe(originalQuantity);
  });

  test('updateProductQuantity should return false for non-existent id', () => {
    const result = productService.updateProductQuantity('non-existent-id', 10);
    expect(result).toBe(false);
  });

  test('addProduct should add a new product to the list', () => {
    const initialProductCount = productService.getAllProducts().length;
    const newProduct = new Product('new-id', 'New Product', 2.50, 10, '/new.jpg');
    
    const result = productService.addProduct(newProduct);
    const updatedProducts = productService.getAllProducts();
    
    expect(result).toEqual(newProduct);
    expect(updatedProducts.length).toBe(initialProductCount + 1);
    expect(updatedProducts).toContain(newProduct);
  });
});