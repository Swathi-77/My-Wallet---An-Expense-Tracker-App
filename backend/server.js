const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. Load environment variables
dotenv.config();

// 2. Initialize the app
const app = express();

// 3. Middleware
app.use(express.json());

// 4. Optimized CORS for your live URL
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://my-wallet-an-expense-tracker-app.vercel.app"
        ];
        
        // Allows local dev, your main URL, and any Vercel preview links
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// 5. Route Imports
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// 6. Connect to MongoDB
// This uses the MONGO_URI you added to Vercel Environment Variables
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Successfully'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

// 7. Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// 8. Basic Test Route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});

// 9. CRITICAL: Export for Vercel
module.exports = app;

// 10. Listen only when running locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}