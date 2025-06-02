import React from 'react';
import './ActionButtons.css';

const ActionButtons = ({ onComplete, onCancel, onNewTransaction, disabled, selectedProducts }) => {
  return (
    <div className="action-buttons">
      <button
        className="complete-button"
        onClick={onComplete}
        disabled={disabled || selectedProducts.length === 0}
      >
        Complete Purchase
      </button>
      <button
        className="cancel-button"
        onClick={onCancel}
        disabled={disabled}
      >
        Cancel
      </button>
      <button
        className="new-transaction-button"
        onClick={onNewTransaction}
        disabled={!disabled}
      >
        New Transaction
      </button>
    </div>
  );
};

export default ActionButtons;