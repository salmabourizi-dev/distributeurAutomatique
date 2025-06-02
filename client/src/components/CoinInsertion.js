import React from 'react';
import './CoinInsertion.css';

const CoinInsertion = ({ onInsertCoin, disabled }) => {
  const coinValues = [0.05, 0.10, 0.20, 0.50, 1.00, 2.00];

  return (
    <div className="coin-insertion">
      <h2>Insert Coins</h2>
      <div className="coin-grid">
        {coinValues.map(value => (
          <button
            key={value}
            className="coin-button"
            onClick={() => onInsertCoin(value)}
            disabled={disabled}
          >
            {value.toFixed(2)}€
          </button>
        ))}
      </div>
    </div>
  );
};

export default CoinInsertion;