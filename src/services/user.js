const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.getUsers = async () => {
    try {
        const users = await User.find({}).select('-password');
        return users;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.getUser = async (userId) => {
    try {
        let user;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            user = await User.findById(userId).select('-password');
        } else {
            user = await User.findOne({ $or: [{ username: userId }, { email: userId }] }).select('-password');
        }
        if (!user) {
            return { error: 'User not found!' };
        }
        return user;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.addUser = async (userData) => {
    try {
        const { username, email, password, role, phone, ssn } = userData;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'User already exists!' };
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ username, email, password: hashedPassword, role, phone, ssn });
        await user.save();
        return user;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.updateUser = async (userData) => {
    try {
        const { id, username, email, role, phone, ssn } = userData;
        const user = await User.findById(id);
        if (!user) {
            return { error: 'User does not exist!' };
        }
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return { error: 'Email already exists!' };
            }
        }
        if (phone) {
            const existingUser = await User.findOne({ phone });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return { error: 'Phone number already exists!' };
            }
        }
        if (ssn) {
            const existingUser = await User.findOne({ ssn });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return { error: 'SSN already exists!' };
            }
        }
        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;
        user.phone = phone || user.phone;
        user.ssn = ssn || user.ssn;
        await user.save();
        return user;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.updatePassword = async (userId, password) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { error: 'User does not exist!' };
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        return user;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.deleteUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return { error: 'User not found!' };
        }
        return user;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.createSuperAdmin = async () => {
    try {
        const existingUser = await User.findOne({ role: 'admin' });
        if (existingUser) {
            return;
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt);
        const user = new User({
            username: process.env.SUPER_ADMIN_USERNAME,
            email: process.env.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: process.env.SUPER_ADMIN_ROLE,
            phone: process.env.SUPER_ADMIN_PHONE,
            ssn: process.env.SUPER_ADMIN_SSN
        });
        return await user.save();
    } catch (error) {
        console.log(error);
    }
};