const { validationResult } = require('express-validator');

const employeeService = require('../services/employee');

exports.getEmployees = async (req, res) => {
    try {
        let employees = await employeeService.getEmployees();
        if (employees.error) {
            return res.status(404).json({ error: employees.error });
        }
        employees = employees.map(employee => {
            return {
                id: employee.id,
                name: employee.name,
                jobRole: employee.jobRole,
                ssn: employee.ssn,
                phone: employee.phone,
                workAddress: employee.workAddress,
            };
        });
        res.json({ message: 'Employees fetched successfully', employees });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return res.status(404).json({ error: employee.error });
        }
        res.json({
            message: 'Employee fetched successfully', employee: {
                id: employee.id,
                name: employee.name,
                jobRole: employee.jobRole,
                ssn: employee.ssn,
                phone: employee.phone,
                workAddress: employee.workAddress,
                paymentMethod: employee.paymentMethod,
                paymentMethodDetails: employee.paymentMethodDetails
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { id, name, jobRole, ssn, phone, workAddress, baseSalary, paymentMethod, paymentMethodDetails } = req.body;
        const employee = await employeeService.createEmployee({
            id,
            name,
            jobRole,
            ssn,
            phone,
            workAddress,
            baseSalary,
            paymentMethod,
            paymentMethodDetails
        });
        if (employee.error) {
            return res.status(409).json({ error: employee.error });
        }
        res.json({ message: 'Employee added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { employeeId } = req.params;
        const { name, jobRole, ssn, phone, workAddress, baseSalary, paymentMethod } = req.body;
        const employee = await employeeService.updateEmployee({
            id: employeeId,
            name,
            jobRole,
            ssn,
            phone,
            workAddress,
            baseSalary,
            paymentMethod
        });
        if (employee.error) {
            return res.status(409).json({ error: employee.error });
        }
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updatePaymentMethod = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { paymentMethod, paymentMethodDetails } = req.body;
        const employee = await employeeService.updatePaymentMethod(employeeId, paymentMethod, paymentMethodDetails);
        if (employee.error) {
            return res.status(409).json({ error: employee.error });
        }
        res.json({ message: 'Payment method updated successfully', employee });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.removeEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await employeeService.deleteEmployee(employeeId);
        if (employee.error) {
            return res.status(409).json({ error: employee.error });
        }
        res.json({ message: 'Employee removed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.searchEmployees = async (req, res) => {
    try {
        const { query } = req.query;
        let employees = await employeeService.searchEmployees(query);
        if (employees.error) {
            return res.status(404).json({ error: employees.error });
        }
        employees = employees.map(employee => {
            return {
                id: employee.id,
                name: employee.name,
                jobRole: employee.jobRole,
                ssn: employee.ssn,
                phone: employee.phone,
                workAddress: employee.workAddress,
            };
        });
        res.json({ message: 'Employees fetched successfully', employees });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};