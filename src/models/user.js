const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['accountant', 'secretary', 'admin'],
        default: 'secretary'
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    ssn: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    collection: 'users'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
