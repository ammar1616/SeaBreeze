const { body } = require('express-validator');

exports.login = () => {
    return [
        body('email')
            .notEmpty()
            .withMessage('Email must not be empty')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail(),

        body('password')
            .notEmpty()
            .withMessage('Password must not be empty'),
    ];
};