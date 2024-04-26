const moment = require('moment');

const { validationResult } = require('express-validator');

const employeeService = require('../services/employee');
const shiftService = require('../services/shift');

exports.shift = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { employeeId } = req.params;
        const { date, time, location, description } = req.body;
        const employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return res.status(404).json({ error: employee.error });
        }
        if (employee.shift.inShift) {
            const shift = await shiftService.endShift(employeeId, date, time);
            if (shift.error) {
                return res.status(409).json({ error: shift.error });
            }
            res.json({ message: 'Shift ended', shift });
        } else {
            const shift = await shiftService.startShift(employeeId, date, time, location, description);
            if (shift.error) {
                return res.status(409).json({ error: shift.error });
            }
            res.json({ message: 'Shift started', shift });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getShifts = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const shiftsInformation = await shiftService.getShifts(employeeId);
        if (shiftsInformation.error) {
            return res.status(404).json({ error: shiftsInformation.error });
        }
        const employee = {
            id: shiftsInformation.employee.id,
            name: shiftsInformation.employee.name,
            jobRole: shiftsInformation.employee.jobRole,
            ssn: shiftsInformation.employee.ssn,
            phone: shiftsInformation.employee.phone,
            workAddress: shiftsInformation.employee.workAddress,
            shift: shiftsInformation.employee.shift
        }
        const shifts = shiftsInformation.shifts.map(shift => {
            return {
                id: shift.id,
                employeeId: shift.employeeId,
                startTime: shift.startTime,
                endTime: shift.endTime,
                duration: shift.duration,
                bonus: shift.bonus.days,
                deduction: shift.deduction.days,
                location: shift.location,
                description: shift.description
            };
        });
        res.json({ message: 'Shifts fetched successfully', employee, shifts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getShiftsWithFinancials = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const shiftsInformation = await shiftService.getShifts(employeeId);
        if (shiftsInformation.error) {
            return res.status(404).json({ error: shiftsInformation.error });
        }
        const employee = {
            id: shiftsInformation.employee.id,
            name: shiftsInformation.employee.name,
            jobRole: shiftsInformation.employee.jobRole,
            ssn: shiftsInformation.employee.ssn,
            phone: shiftsInformation.employee.phone,
            workAddress: shiftsInformation.employee.workAddress,
            shift: shiftsInformation.employee.shift
        }
        res.json({ message: 'Shifts fetched successfully', employee, shifts: shiftsInformation.shifts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getShift = async (req, res) => {
    try {
        const { shiftId } = req.params;
        const shift = await shiftService.getShift(shiftId);
        if (shift.error) {
            return res.status(404).json({ error: shift.error });
        }
        res.json({ message: 'Shift fetched successfully', shift });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteShift = async (req, res) => {
    try {
        const { shiftId } = req.params;
        const shift = await shiftService.deleteShift(shiftId);
        if (shift.error) {
            return res.status(404).json({ error: shift.error });
        }
        res.json({ message: 'Shift deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};