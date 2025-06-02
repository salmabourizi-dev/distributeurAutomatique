import React from 'react';
import './ProductList.css';

const ProductList = ({ products, onSelectProduct, disabled }) => {
  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="product-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className={`product-item ${product.quantity <= 0 ? 'out-of-stock' : ''}`}
            onClick={() => !disabled && product.quantity > 0 && onSelectProduct(product.id)}
          >
            <div className="product-image">
              <img 
                src={product.imagePath.startsWith('http') 
                  ? product.imagePath 
                  : 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
                alt={product.name} 
              />
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-price">{product.price.toFixed(2)}€</p>
              <p className="product-quantity">
                {product.quantity > 0 
                  ? `Stock: ${product.quantity}` 
                  : 'Out of stock'}
              </p>
            </div>
            <button 
              className="select-button"
              disabled={disabled || product.quantity <= 0}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;