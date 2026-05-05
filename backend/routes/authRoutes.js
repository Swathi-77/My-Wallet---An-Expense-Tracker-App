const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');

// For the profile route, you might need a middleware to verify the JWT
// If you don't have authMiddleware yet, you can temporarily remove it to test
// const authMiddleware = require('../middleware/authMiddleware'); 

// Authentication Routes
router.post('/register', register);
router.post('/login', login);

// Profile Route (Protected)
// If you haven't built the middleware yet, use: router.get('/profile', getProfile);
router.get('/profile', getProfile); 

module.exports = router;