import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Wallet, Landmark, PlusCircle, MinusCircle, X } from 'lucide-react';

const Dashboard = () => {
    const [balances, setBalances] = useState({ cash: 0, digital: 0 });
    const [transactions, setTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        amount: '',
        type: 'income', 
        paymentMethod: 'cash', 
        category: '',
        otherReason: '',
        description: ''
    });

    const incomeCategories = ['Job Salary', 'Part-time Salary', 'Saving', 'Other'];
    const expenseCategories = ['Food', 'Groceries', 'Skincare', 'Makeup', 'Travel Expense', 'Medical Expense', 'Shopping', 'Other'];

    // Helper to get fresh headers
    const getAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const fetchData = async () => {
        try {
            // Fetch Transactions
            const transRes = await API.get('/transactions/all', getAuthHeaders());
            setTransactions(transRes.data);

            // Fetch Profile/Balances
            const userRes = await API.get('/auth/profile', getAuthHeaders()); 
            setBalances({ 
                cash: userRes.data.cashBalance || 0, 
                digital: userRes.data.digitalBalance || 0 
            });
        } catch (err) {
            console.error("Error fetching data", err);
            // If we get a 401, the token is likely expired
            if (err.response?.status === 401) {
                console.warn("Session expired. Please log in again.");
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const finalDescription = formData.category === 'Other' ? formData.otherReason : formData.category;

        try {
            const res = await API.post('/transactions/add', {
                amount: Number(formData.amount),
                type: formData.type,
                paymentMethod: formData.paymentMethod,
                category: formData.category,
                description: finalDescription
            }, getAuthHeaders());
            
            // Immediately update balances from the server response
            if (res.data.balance) {
                setBalances(res.data.balance);
            }

            setShowForm(false);
            setFormData({ amount: '', type: 'income', paymentMethod: 'cash', category: '', otherReason: '', description: '' });
            
            // Refresh history
            fetchData(); 
        } catch (err) {
            alert("Error: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen p-4 pb-20 relative">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
                <p className="text-gray-500 text-sm">Welcome back</p>
            </header>

            {/* Top Balances */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-600 p-4 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Wallet size={20} />
                        <span className="text-xs opacity-80">Cash Balance</span>
                    </div>
                    <div className="text-xl font-bold">₹{balances.cash}</div>
                </div>
                <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Landmark size={20} />
                        <span className="text-xs opacity-80">Digital Balance</span>
                    </div>
                    <div className="text-xl font-bold">₹{balances.digital}</div>
                </div>
            </div>

            {/* Options: Cash In & Cash Out */}
            <div className="flex justify-around mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <button 
                    onClick={() => { setShowForm(true); setFormData({...formData, type: 'income'}); }}
                    className="flex flex-col items-center gap-1 text-green-600 hover:bg-green-50 p-2 rounded-xl transition"
                >
                    <PlusCircle size={32} />
                    <span className="text-xs font-semibold">Cash In</span>
                </button>
                <button 
                    onClick={() => { setShowForm(true); setFormData({...formData, type: 'expense'}); }}
                    className="flex flex-col items-center gap-1 text-red-500 hover:bg-red-50 p-2 rounded-xl transition"
                >
                    <MinusCircle size={32} />
                    <span className="text-xs font-semibold">Cash Out</span>
                </button>
            </div>

            {/* Transaction History List */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    {transactions.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-4">No transactions yet. Add some above!</p>
                    ) : (
                        transactions.map((t) => (
                            <div key={t._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                        {t.type === 'income' ? <PlusCircle size={20} /> : <MinusCircle size={20} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">{t.category}</p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {t.description && t.description !== t.category ? `${t.description} • ` : ''} 
                                            {t.paymentMethod}
                                        </p>
                                    </div>
                                </div>
                                <div className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                    {t.type === 'income' ? '+' : '-'}₹{t.amount}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* The Form Popup */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative">
                        <button onClick={() => setShowForm(false)} className="absolute right-4 top-4 text-gray-400">
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-xl font-bold mb-4">
                            {formData.type === 'income' ? 'Cash In' : 'Cash Out'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Select Wallet</label>
                                <div className="flex gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                                        className={`flex-1 py-2 rounded-lg border font-semibold ${formData.paymentMethod === 'cash' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200'}`}
                                    >Cash</button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, paymentMethod: 'digital'})}
                                        className={`flex-1 py-2 rounded-lg border font-semibold ${formData.paymentMethod === 'digital' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}
                                    >Digital</button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    className="w-full border-b-2 border-gray-200 p-2 text-lg font-bold focus:border-gray-800 outline-none transition"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                    required
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Reason</label>
                                <select 
                                    className="w-full border-b-2 border-gray-200 p-2 outline-none focus:border-gray-800 transition"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    required
                                >
                                    <option value="">Select a reason</option>
                                    {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.category === 'Other' && (
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Please specify the reason</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-b-2 border-gray-200 p-2 outline-none focus:border-gray-800 transition"
                                        placeholder="Enter reason..."
                                        value={formData.otherReason}
                                        onChange={(e) => setFormData({...formData, otherReason: e.target.value})}
                                        required
                                    />
                                </div>
                            )}

                            <button type="submit" className={`w-full text-white py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 ${formData.type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}>
                                Confirm {formData.type === 'income' ? 'Cash In' : 'Cash Out'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;