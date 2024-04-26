const moment = require('moment');

const { validationResult } = require('express-validator');

const debtService = require('../services/debt');

exports.getAllDebts = async (req, res) => {
    try {
        const { pending } = req.query;
        const employeesDebts = await debtService.getAllDebts(pending);
        if (employeesDebts.error) {
            return res.status(404).json({ error: employeesDebts.error });
        }
        res.json({ message: 'Debts fetched successfully', debts: employeesDebts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getDebts = async (req, res) => {
    try {
        const { pending } = req.query;
        const { employeeId } = req.params;
        const employeeDebtsInformation = await debtService.getDebts(employeeId, pending);
        if (employeeDebtsInformation.error) {
            return res.status(404).json({ error: employeeDebtsInformation.error });
        }
        const employee = {
            id: employeeDebtsInformation.employee.id,
            name: employeeDebtsInformation.employee.name,
            jobRole: employeeDebtsInformation.employee.jobRole,
            ssn: employeeDebtsInformation.employee.ssn,
            phone: employeeDebtsInformation.employee.phone,
            workAddress: employeeDebtsInformation.employee.workAddress,
            totalSalary: employeeDebtsInformation.employee.totalSalary
        };
        res.json({ message: 'Debts fetched successfully', employee, debts: employeeDebtsInformation.debts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getDebt = async (req, res) => {
    try {
        const { debtId } = req.params;
        const debtInformation = await debtService.getDebt(debtId);
        if (debtInformation.error) {
            return res.status(404).json({ error: debtInformation.error });
        }
        res.json({ message: 'Debt fetched successfully', employee: debtInformation.employee, debt: debtInformation.debt });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createDebt = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { employeeId } = req.params;
        let { amount, reason, date } = req.body;
        amount = parseInt(amount);
        const debt = await debtService.createDebt(employeeId, amount, reason, moment(date));
        if (debt.error) {
            return res.status(404).json({ error: debt.error });
        }
        res.status(201).json({ message: 'Debt created successfully', debt });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.makePayment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { debtId } = req.params;
        let { amount } = req.body;
        amount = parseInt(amount);
        const debt = await debtService.makePayment(debtId, amount);
        if (debt.error) {
            return res.status(404).json({ error: debt.error });
        }
        res.json({ message: 'Payment made successfully', debt });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};