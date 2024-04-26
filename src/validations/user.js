const { body } = require('express-validator');

const User = require('../models/user');

exports.isUser = () => {
    return [
        body('username')
            .optional()
            .trim()
            .isString()
            .withMessage('Username must be a string'),

        body('email')
            .optional()
            .trim()
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail(),

        body('role')
            .optional()
            .trim()
            .isString()
            .withMessage('Role must be a string')
            .isIn(['accountant', 'secretary', 'admin'])
            .withMessage('Role must be an accountant or secretary only'),

        body('ssn')
            .optional()
            .trim()
            .isString()
            .withMessage('SSN must be a string')
            .isLength({ min: 14, max: 14 })
            .withMessage('SSN must be 14 characters long')
            .matches(/^(2|3)\d{13}$/)
            .withMessage('Invalid SSN'),

        body('phone')
            .optional()
            .trim()
            .isString()
            .withMessage('Phone must be a string')
            .isLength({ min: 11, max: 11 })
            .withMessage('Phone must be 11 characters long')
            .matches(/^01[0125]\d{8}$/)
            .withMessage('Invalid phone number'),
    ];
};

exports.isRequired = () => {
    return [
        body('username')
            .notEmpty()
            .withMessage('Username cannot be empty'),

        body('email')
            .notEmpty()
            .withMessage('Email cannot be empty')
            .custom(async (email) => {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return Promise.reject('Email already exists!');
                }
            }),

        body('role')
            .notEmpty()
            .withMessage('Role cannot be empty'),

        body('ssn')
            .notEmpty()
            .withMessage('SSN cannot be empty')
            .custom(async (ssn) => {
                const existingUser = await User.findOne({ ssn });
                if (existingUser) {
                    return Promise.reject('SSN already exists!');
                }
            }),

        body('phone')
            .notEmpty()
            .withMessage('Phone cannot be empty')
            .custom(async (phone) => {
                const existingUser = await User.findOne({ phone });
                if (existingUser) {
                    return Promise.reject('Phone number already exists!');
                }
            }),
    ];
};

exports.isPassword = () => {
    return [
        body('password')
            .notEmpty()
            .withMessage('Password cannot be empty')
            .trim()
            .isLength({ min: 8, max: 256 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[0-9])/)
            .withMessage('Password must contain at least one number and one letter'),
    ];
};