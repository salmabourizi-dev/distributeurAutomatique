import axios from 'axios';

const API_URL = '/api';

// Create a custom instance of axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Start a new transaction
export const startTransaction = async () => {
  try {
    const response = await api.post('/transactions/start');
    return response.data;
  } catch (error) {
    console.error('Error starting transaction:', error);
    throw error;
  }
};

// Insert coin into transaction
export const insertCoin = async (transactionId, value) => {
  try {
    const response = await api.post('/transactions/insert-coin', {
      transactionId,
      value
    });
    return response.data;
  } catch (error) {
    console.error('Error inserting coin:', error);
    throw error;
  }
};

// Select a product
export const selectProduct = async (transactionId, productId) => {
  try {
    const response = await api.post('/transactions/select-product', {
      transactionId,
      productId
    });
    return response.data;
  } catch (error) {
    console.error('Error selecting product:', error);
    throw error;
  }
};

// Complete transaction
export const completeTransaction = async (transactionId) => {
  try {
    const response = await api.post('/transactions/complete', {
      transactionId
    });
    return response.data;
  } catch (error) {
    console.error('Error completing transaction:', error);
    throw error;
  }
};

// Cancel transaction
export const cancelTransaction = async (transactionId) => {
  try {
    const response = await api.post('/transactions/cancel', {
      transactionId
    });
    return response.data;
  } catch (error) {
    console.error('Error cancelling transaction:', error);
    throw error;
  }
};

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get transaction details
export const getTransaction = async (transactionId) => {
  try {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};