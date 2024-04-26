const { body } = require('express-validator');

exports.isDebt = () => {
    return [
        body('amount')
            .notEmpty()
            .withMessage('Amount is required')
            .isNumeric()
            .withMessage('Amount must be a number')
            .isFloat({ min: 1, max: 1000000 })
            .withMessage('Amount must be greater than 0')
            .custom(async (amount) => {
                if (amount % 1 !== 0) {
                    return Promise.reject('Amount must be an integer');
                }
            }),

        body('reason')
            .notEmpty()
            .withMessage('Reason is required')
            .trim()
            .isString()
            .withMessage('Reason must be a string'),

        body('date')
            .notEmpty()
            .withMessage('Date is required')
            .trim()
            .isString()
            .withMessage('Date must be a string')
            .isLength({ min: 10, max: 10 })
            .withMessage('Date must be 10 characters long')
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage('Invalid date')
            .custom((value) => {
                const date = new Date(value);
                if (date.toString() === 'Invalid Date') {
                    throw new Error('Invalid date');
                }
                if (date > new Date()) {
                    throw new Error('Date cannot be in the future');
                }
                return true;
            }),
    ];
};

exports.isPayment = () => {
    return [
        body('amount')
            .notEmpty()
            .withMessage('Amount is required')
            .trim()
            .isNumeric()
            .withMessage('Amount must be a number')
            .isFloat({ min: 1, max: 1000000 })
            .withMessage('Amount must be greater than 0')
            .custom(async (amount) => {
                if (amount % 1 !== 0) {
                    return Promise.reject('Amount must be an integer');
                }
            }),
    ];
};