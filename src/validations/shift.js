const { body } = require('express-validator');

exports.isDateTime = () => {
    return [
        body('date')
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

        body('time')
            .trim()
            .isString()
            .withMessage('Time must be a string')
            .isLength({ min: 5, max: 5 })
            .withMessage('Time must be 5 characters long')
            .matches(/^\d{2}:\d{2}$/)
            .withMessage('Invalid time'),

        body('description')
            .optional()
            .trim()
            .isString()
            .withMessage('Description must be a string')
            .isLength({ min: 3, max: 100 })
            .withMessage('Description must be between 3 and 100 characters long')
    ];
};