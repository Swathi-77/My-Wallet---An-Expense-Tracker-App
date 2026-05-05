const Transaction = require('../models/Transaction');
const User = require('../models/User');

// --- ADD TRANSACTION ---
exports.addTransaction = async (req, res) => {
    try {
        const { amount, type, paymentMethod, category, description } = req.body;
        const userId = req.user.id; 
        const amountNum = Number(amount);

        // 1. Create and save the transaction record
        const transaction = new Transaction({
            userId, 
            amount: amountNum,
            type,
            paymentMethod,
            category,
            description
        });
        await transaction.save();

        // 2. Determine the math: Positive for income, negative for expense
        const change = type === 'income' ? amountNum : -amountNum;

        // 3. Update the User Balance directly using $inc
        // This ensures the database adds/subtracts correctly even if starting from 0
        const updateField = paymentMethod === 'cash' 
            ? { cashBalance: change } 
            : { digitalBalance: change };
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: updateField },
            { new: true } // This returns the user with the new balance
        );

        res.status(201).json({ 
            message: "Transaction successful", 
            balance: { 
                cash: updatedUser.cashBalance || 0, 
                digital: updatedUser.digitalBalance || 0 
            } 
        });
    } catch (err) {
        console.error("Error adding transaction:", err);
        res.status(500).json({ error: err.message });
    }
};

// --- GET TRANSACTIONS ---
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- GET RECAP ---
exports.getRecap = async (req, res) => {
    try {
        const { period } = req.query; 
        const userId = req.user.id;
        let startDate = new Date();

        if (period === 'weekly') startDate.setDate(startDate.getDate() - 7);
        else if (period === 'monthly') startDate.setMonth(startDate.getMonth() - 1);
        else if (period === 'yearly') startDate.setFullYear(startDate.getFullYear() - 1);
        else if (period === 'sixmonths') startDate.setMonth(startDate.getMonth() - 6);

        const transactions = await Transaction.find({
            userId,
            date: { $gte: startDate }
        });

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);
            
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);

        res.json({
            period,
            totalIncome,
            totalExpense,
            netSavings: totalIncome - totalExpense,
            transactionCount: transactions.length,
            transactions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};