const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// POST start a new transaction
router.post('/start', transactionController.startTransaction);

// POST insert coin
router.post('/insert-coin', transactionController.insertCoin);

// POST select product
router.post('/select-product', transactionController.selectProduct);

// POST complete transaction
router.post('/complete', transactionController.completeTransaction);

// POST cancel transaction
router.post('/cancel', transactionController.cancelTransaction);

// GET transaction details
router.get('/:id', transactionController.getTransaction);

module.exports = router;