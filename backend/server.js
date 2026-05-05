const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. Load environment variables
dotenv.config();

// 2. Initialize the app
const app = express();

// 3. Middleware - MUST come before routes
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Allow your Vite frontend
    credentials: true
}));

// 4. Route Imports (Removed the duplicate authRoutes declaration)
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// 5. Connect to Local MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to Local MongoDB Successfully'))
    .catch((err) => console.error('MongoDB Connection Error:', err));

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// 7. Basic Test Route
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running...');
});

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

