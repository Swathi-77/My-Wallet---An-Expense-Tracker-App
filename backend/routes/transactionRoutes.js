const express = require('express');
const router = express.Router();

// Import Controller Functions
const { addTransaction, getTransactions, getRecap } = require('../controllers/transactionController');

// Import Middleware
const { protect } = require('../middleware/authMiddleware'); 

// --- SAFETY CHECK: This will print to your terminal ---
console.log("DEBUG: addTransaction is a:", typeof addTransaction);
console.log("DEBUG: protect is a:", typeof protect);

// Line 11 is usually one of these. 
// If either 'protect' or 'addTransaction' is NOT a function, it will crash here.
router.post('/add', protect, addTransaction); 
router.get('/all', protect, getTransactions);
router.get('/recap', protect, getRecap);

module.exports = router;