const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER USER ---
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user or email already exists
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).json({ error: "User or Email already exists" });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create new user with explicit 0 balances
        user = new User({
            username,
            email,
            password: hashedPassword,
            cashBalance: 0,
            digitalBalance: 0
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// --- LOGIN USER ---
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 2. Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 3. Create JWT Token (using 'id' to match your other controllers)
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '24h' } // Increased to 24h for better development experience
        );

        res.json({ 
            token, 
            message: "Login Successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// --- GET PROFILE ---
exports.getProfile = async (req, res) => {
    try {
        // Ensure req.user exists (set by your authMiddleware)
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Not authorized, no token" });
        }

        // Fetch user and exclude password
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};