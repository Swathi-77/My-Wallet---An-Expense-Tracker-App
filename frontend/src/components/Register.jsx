import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '' 
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sends username, email, and password to your backend
            await API.post('/auth/register', formData);
            alert("Registration Successful!");
            navigate('/login');
        } catch (err) {
            // Displays the specific error (e.g., "User already exists")
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {/* Changed onSubmit to match the function name handleSubmit */}
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-2xl w-80 space-y-4">
                <h2 className="text-2xl font-bold text-center text-green-600">Join Us</h2>
                
                <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full p-3 border rounded-lg" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    required 
                />
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full p-3 border rounded-lg" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
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
                
                <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                    Register
                </button>
                
                <p className="text-xs text-center">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;