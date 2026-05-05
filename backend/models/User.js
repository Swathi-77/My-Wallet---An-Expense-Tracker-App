const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // Added email field to match your registration form
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    cashBalance: {
        type: Number,
        default: 0
    },
    digitalBalance: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);