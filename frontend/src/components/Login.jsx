import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    // We use 'username' here to match your User.js model
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This sends { username, password } to the backend
            const { data } = await API.post('/auth/login', formData);
            
            // Store the token so you stay logged in
            localStorage.setItem('token', data.token); 
            
            alert("Login Successful!");
            navigate('/dashboard'); 
        } catch (err) {
            // This will show the actual error message from your backend terminal
            alert(err.response?.data?.error || "Login Failed");
            console.log("Login Error:", err.response?.data);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
            <h2 className="text-3xl font-bold mb-6 text-green-600">Expense Tracker</h2>
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full p-3 border rounded-lg" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full p-3 border rounded-lg"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
                <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold">
                    Login
                </button>
                <p className="text-center text-sm">
                    Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;