const { body } = require('express-validator');

exports.isFinancial = () => {
    return [
        body('type')
            .notEmpty()
            .withMessage('Type cannot be empty')
            .trim()
            .isString()
            .withMessage('Type must be a string')
            .isIn(['loan', 'bonus', 'deduction', 'compensation'])
            .withMessage('Invalid financial type'),

        body('amount')
            .notEmpty()
            .withMessage('Amount cannot be empty')
            .trim()
            .isNumeric()
            .withMessage('Amount must be a number')
            .isFloat({ min: 0 })
            .withMessage('Amount must be a non-negative float'),

        body('description')
            .optional()
            .trim()
            .isString()
            .withMessage('Description must be a string')
    ]
};

exports.isPayroll = () => {
    return [
        body('payedAmount')
            .notEmpty()
            .withMessage('Payed amount cannot be empty')
            .trim()
            .isNumeric()
            .withMessage('Payed amount must be a number')
            .isFloat({ min: 0 })
            .withMessage('Payed amount must be a non-negative float')
    ]
};