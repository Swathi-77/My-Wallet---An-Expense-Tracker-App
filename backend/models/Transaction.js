const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { // Keep 'userId' to match your controller logic
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'digital'],
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Timestamps are useful!

module.exports = mongoose.model('Transaction', TransactionSchema);