import React from 'react';
import './TransactionDisplay.css';

const TransactionDisplay = ({ insertedAmount, selectedProducts, change }) => {
  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => total + product.price, 0);
  };

  return (
    <div className="transaction-display">
      <div className="balance-display">
        <h3>Current Balance</h3>
        <p className="amount">{insertedAmount.toFixed(2)}€</p>
      </div>

      {selectedProducts.length > 0 && (
        <div className="selected-products">
          <h3>Selected Products</h3>
          <ul>
            {selectedProducts.map((product, index) => (
              <li key={index}>
                {product.name} - {product.price.toFixed(2)}€
              </li>
            ))}
          </ul>
          <div className="total">
            <p>Total: {calculateTotal().toFixed(2)}€</p>
          </div>
        </div>
      )}

      {change > 0 && (
        <div className="change-display">
          <h3>Your Change</h3>
          <p className="amount">{change.toFixed(2)}€</p>
        </div>
      )}
    </div>
  );
};

export default TransactionDisplay;