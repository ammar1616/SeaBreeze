const { body } = require('express-validator');

const Employee = require('../models/employee');

exports.isEmployee = () => {
    return [
        body('name')
            .optional()
            .trim()
            .isString()
            .withMessage('Name must be a string'),

        body('jobRole')
            .optional()
            .trim()
            .isString()
            .withMessage('Job role must be a string'),

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

        body('workAddress')
            .optional()
            .trim()
            .isString()
            .withMessage('Work address must be a string'),

        body('baseSalary')
            .optional()
            .trim()
            .isNumeric()
            .withMessage('Base salary must be a number')
            .isFloat({ min: 0, max: 1000000 })
            .withMessage('Base salary must be a non-negative float'),

        body('paymentMethod')
            .optional()
            .trim()
            .isString()
            .withMessage('Payment method must be a string')
            .isIn(['bank', 'wallet', 'postal', 'payroll', 'cash'])
            .withMessage('Invalid payment method'),
    ];
};

exports.isRequired = () => {
    return [
        body('id')
            .notEmpty()
            .withMessage('ID cannot be empty')
            .isNumeric()
            .withMessage('ID must be a number')
            .isFloat({ min: 100, max: 9999999 })
            .withMessage('ID must be at least 100 and at most 9999999')
            .custom(async (id) => {
                const employee = await Employee.findOne({ id });
                if (employee) {
                    return Promise.reject('ID already exists!');
                }
            }),
            
        body('name')
            .notEmpty()
            .withMessage('Name cannot be empty'),

        body('jobRole')
            .notEmpty()
            .withMessage('Job role cannot be empty'),

        body('ssn')
            .notEmpty()
            .withMessage('SSN cannot be empty')
            .custom(async (ssn) => {
                const employee = await Employee.findOne({ ssn });
                if (employee) {
                    return Promise.reject('SSN already exists!');
                }
            }),

        body('phone')
            .notEmpty()
            .withMessage('Phone cannot be empty')
            .custom(async (phone) => {
                const employee = await Employee.findOne({ phone });
                if (employee) {
                    return Promise.reject('Phone already exists!');
                }
            }),

        body('workAddress')
            .notEmpty()
            .withMessage('Work address cannot be empty'),

        body('baseSalary')
            .notEmpty()
            .withMessage('Base salary cannot be empty'),
    ];
};