
const userService = require('../services/user');

const { validationResult } = require('express-validator');

exports.getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.json({ message: 'Users fetched successfully', users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userService.getUser(userId);
        if (user.error) {
            return res.status(404).json({ error: user.error });
        }
        res.json({ message: 'User fetched successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.addUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { username, email, password, role, phone, ssn } = req.body;
        const user = await userService.addUser({
            username,
            email,
            password,
            role,
            phone,
            ssn,
        });
        if (user.error) {
            return res.status(400).json({ error: user.error });
        }
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { userId } = req.params;
        const { username, email, role, phone, ssn } = req.body;
        const user = await userService.updateUser({
            id: userId,
            username,
            email,
            role,
            phone,
            ssn,
        });
        if (user.error) {
            return res.status(400).json({ error: user.error });
        }
        user.password = undefined;
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { userId } = req.params;
        const { password } = req.body;
        const user = await userService.updatePassword(userId, password);
        if (user.error) {
            return res.status(400).json({ error: user.error });
        }
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userService.deleteUser(userId);
        if (user.error) {
            return res.status(404).json({ error: user.error });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};