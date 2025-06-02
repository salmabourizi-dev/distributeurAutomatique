import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import CoinInsertion from './components/CoinInsertion';
import TransactionDisplay from './components/TransactionDisplay';
import ActionButtons from './components/ActionButtons';
import MessageDisplay from './components/MessageDisplay';
import { startTransaction, insertCoin, selectProduct, completeTransaction, cancelTransaction } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [transaction, setTransaction] = useState(null);
  const [insertedAmount, setInsertedAmount] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [message, setMessage] = useState({ text: 'Welcome to the Vending Machine!', type: 'info' });
  const [isLoading, setIsLoading] = useState(false);
  const [change, setChange] = useState(0);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    handleStartTransaction();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setMessage({ text: 'Failed to load products. Please try again.', type: 'error' });
    }
  };

  const handleStartTransaction = async () => {
    setIsLoading(true);
    try {
      const newTransaction = await startTransaction();
      setTransaction(newTransaction);
      setInsertedAmount(0);
      setSelectedProducts([]);
      setChange(0);
      setMessage({ text: 'Transaction started. Please insert coins and select products.', type: 'info' });
    } catch (error) {
      setMessage({ text: 'Failed to start transaction. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertCoin = async (value) => {
    if (!transaction) return;
    
    setIsLoading(true);
    try {
      const response = await insertCoin(transaction.id, value);
      setInsertedAmount(response.insertedAmount);
      setMessage({ text: `Inserted ${value}€ successfully.`, type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to insert coin. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = async (productId) => {
    if (!transaction) return;
    
    const selectedProduct = products.find(product => product.id === productId);
    
    if (!selectedProduct) {
      setMessage({ text: 'Product not found.', type: 'error' });
      return;
    }
    
    if (selectedProduct.quantity <= 0) {
      setMessage({ text: 'Sorry, this product is out of stock.', type: 'error' });
      return;
    }
    
    if (insertedAmount < selectedProduct.price) {
      setMessage({ text: `Insufficient funds. Please insert ${(selectedProduct.price - insertedAmount).toFixed(2)}€ more.`, type: 'error' });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await selectProduct(transaction.id, productId);
      setInsertedAmount(response.remainingBalance);
      
      // Update local product inventory
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, quantity: product.quantity - 1 } 
            : product
        )
      );
      
      // Add to selected products
      setSelectedProducts(prev => [...prev, selectedProduct]);
      setMessage({ text: `Selected ${selectedProduct.name} successfully.`, type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to select product. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTransaction = async () => {
    if (!transaction) return;
    
    if (selectedProducts.length === 0) {
      setMessage({ text: 'Please select at least one product before completing transaction.', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await completeTransaction(transaction.id);
      setChange(response.change);
      setMessage({ 
        text: `Transaction completed successfully! Change: ${response.change.toFixed(2)}€`, 
        type: 'success' 
      });
      
      // Start a new transaction after a delay
      setTimeout(() => {
        handleStartTransaction();
      }, 5000);
    } catch (error) {
      setMessage({ text: 'Failed to complete transaction. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTransaction = async () => {
    if (!transaction) return;
    
    setIsLoading(true);
    try {
      const response = await cancelTransaction(transaction.id);
      setChange(response.refundedAmount);
      
      // Restore product quantities
      if (selectedProducts.length > 0) {
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts];
          selectedProducts.forEach(selectedProduct => {
            const productIndex = updatedProducts.findIndex(p => p.id === selectedProduct.id);
            if (productIndex !== -1) {
              updatedProducts[productIndex] = {
                ...updatedProducts[productIndex],
                quantity: updatedProducts[productIndex].quantity + 1
              };
            }
          });
          return updatedProducts;
        });
      }
      
      setMessage({ 
        text: `Transaction cancelled. Refunded amount: ${response.refundedAmount.toFixed(2)}€`, 
        type: 'info' 
      });
      
      // Start a new transaction after a delay
      setTimeout(() => {
        handleStartTransaction();
      }, 5000);
    } catch (error) {
      setMessage({ text: 'Failed to cancel transaction. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Vending Machine</h1>
      </header>
      <div className="app-content">
        <div className="vending-machine">
          <div className="product-section">
            <ProductList 
              products={products} 
              onSelectProduct={handleSelectProduct}
              disabled={isLoading || !transaction || transaction.status !== 'PENDING'}
            />
          </div>
          <div className="control-section">
            <MessageDisplay message={message} />
            <TransactionDisplay 
              insertedAmount={insertedAmount} 
              selectedProducts={selectedProducts}
              change={change}
            />
            <CoinInsertion 
              onInsertCoin={handleInsertCoin}
              disabled={isLoading || !transaction || transaction.status !== 'PENDING'}
            />
            <ActionButtons 
              onComplete={handleCompleteTransaction}
              onCancel={handleCancelTransaction}
              onNewTransaction={handleStartTransaction}
              disabled={isLoading || !transaction || transaction.status !== 'PENDING'}
              selectedProducts={selectedProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;