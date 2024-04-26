const { validationResult } = require('express-validator');

const financialService = require('../services/financial');
const employeeService = require('../services/employee');
const shiftService = require('../services/shift');

exports.getEmployeeWithFinancials = async (req, res) => {
    try {
        const { employeeId } = req.params;
        let employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return res.status(404).json({ error: employee.error });
        }
        const unpayedShifts = await shiftService.unpayedShifts(employeeId);
        if (unpayedShifts.error) {
            return res.status(404).json({ error: unpayedShifts.error });
        }
        const cost = employee.dailySalary * employee.daysWorked;
        res.json({ message: 'Financials fetched successfully', employee, cost, unpayedShifts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addFinancial = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { employeeId } = req.params;
        let { type, amount, description } = req.body;
        amount = parseFloat(amount);
        const date = new Date();
        const financial = await financialService.addFinancial({
            id: employeeId,
            type,
            amount,
            date,
            description
        });
        if (financial.error) {
            return res.status(409).json({ error: financial.error });
        }
        res.json({
            message: 'Financial added successfully',
            financial: {
                type,
                amount,
                date,
                description
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.payEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { payedAmount } = req.body;
        const employee = await financialService.payEmployee(employeeId, payedAmount);
        if (employee.error) {
            return res.status(409).json({ error: employee.error });
        }
        res.json({ message: 'Employee payed successfully', employee });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.unpayedEmployees = async (req, res) => {
    try {
        const flag = req.query.all;
        const workAddress = req.query.workAddress;
        const paymentMethod = req.query.paymentMethod;
        let unpayedEmployeesInformation;
        if (flag === 'true') {
            unpayedEmployeesInformation = await financialService.allUnpayedEmployees(workAddress, paymentMethod);
        } else {
            unpayedEmployeesInformation = await financialService.unpayedEmployees(workAddress, paymentMethod);
        }
        if (unpayedEmployeesInformation.error) {
            return res.status(404).json({ error: unpayedEmployeesInformation.error });
        }
        res.json({
            message: 'Unpayed employees fetched successfully',
            totalCosts: unpayedEmployeesInformation.totalCosts,
            totalEmployeesLoans: unpayedEmployeesInformation.totalEmployeesLoans,
            totalEmployeesBonuses: unpayedEmployeesInformation.totalEmployeesBonuses,
            totalEmployeesDeductions: unpayedEmployeesInformation.totalEmployeesDeductions,
            totalEmployeesCompensations: unpayedEmployeesInformation.totalEmployeesCompensations,
            totalSalaries: unpayedEmployeesInformation.totalSalaries,
            employees: unpayedEmployeesInformation.employees
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.resetSalaries = async (req, res) => {
    try {
        const employees = await financialService.resetSalaries();
        if (employees.error) {
            return res.status(409).json({ error: employees.error });
        }
        res.json({ message: 'Salaries reset successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};