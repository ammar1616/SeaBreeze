const moment = require('moment');

const Shift = require('../models/shift');

const employeeService = require('../services/employee');
const financialService = require('../services/financial');

exports.getShifts = async (employeeId) => {
    try {
        const employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return { error: employee.error };
        }
        const shifts = await Shift.find({ employeeId }).sort({ startTime: -1 });
        if (!shifts) {
            return { error: 'Shifts do not exist!' };
        }
        return { employee, shifts };
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.getShift = async (shiftId) => {
    try {
        const shift = await Shift.findById(shiftId);
        if (!shift) {
            return { error: 'Shift does not exist!' };
        }
        return shift;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.startShift = async (employeeId, date, time, location, description) => {
    try {
        if (!location) {
            return { error: 'Location is required!' };
        }
        const employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return { error: employee.error };
        }
        if (employee.shift.inShift) {
            return { error: 'Employee is already in shift!' };
        }
        const startTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
        if (!startTime.isValid()) {
            return { error: 'Invalid date and time!' };
        }
        const shifts = await Shift.find({ employeeId: employee.id });
        for (let i = 0; i < shifts.length; i++) {
            if (moment(startTime).isBetween(moment(shifts[i].startTime), moment(shifts[i].endTime))) {
                return { error: 'Shifts cannot overlap!' };
            }
        }
        const shift = new Shift({
            employeeId,
            location,
            description,
            startTime,
        });
        employee.shift.inShift = true;
        employee.shift.currentShift = shift._id;
        await employee.save();
        await shift.save();
        return shift;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.endShift = async (employeeId, date, time) => {
    try {
        const employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return { error: employee.error };
        }
        if (!employee.shift.inShift) {
            return { error: 'Employee is not in shift!' };
        }
        const shift = await Shift.findById(employee.shift.currentShift);
        if (!shift) {
            return { error: 'Shift does not exist!' };
        }
        const endTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
        const shiftDurationInformation = calculateShiftDuration(shift.startTime, endTime);
        if (shiftDurationInformation.error) {
            return { error: shiftDurationInformation.error };
        }
        const shifts = await Shift.find({ employeeId: employee.id });
        for (let i = 0; i < shifts.length; i++) {
            if (shifts[i].id.toString() !== shift.id.toString()) {
                if (moment(endTime).isBetween(moment(shifts[i].startTime), moment(shifts[i].endTime))) {
                    return { error: 'Shifts cannot overlap!' };
                }
                if (moment(shifts[i].startTime).isBetween(moment(shift.startTime), moment(endTime))) {
                    return { error: 'Shifts cannot overlap!' };
                }
                if (moment(shifts[i].endTime).isBetween(moment(shift.startTime), moment(endTime))) {
                    return { error: 'Shifts cannot overlap!' };
                }
            }
        }
        shift.endTime = endTime;
        employee.shift.inShift = false;
        employee.shift.currentShift = null;
        const shiftSalary = await financialService.calculateShiftFinancials(employeeId, shiftDurationInformation);
        if (shiftSalary.error) {
            return { error: shiftSalary.error };
        }
        shift.salary = shiftSalary.shiftDurationSalary;
        if (shiftDurationInformation.bonuses > 0) {
            const shiftBonus = employee.bonuses.bonusesDetails.push({
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
                amount: shiftSalary.shiftBonus,
                description: 'مكافأة على الورديه'
            });
            shift.bonus.id = employee.bonuses.bonusesDetails[shiftBonus - 1]._id;
        }
        employee.bonuses.totalBonuses += shiftSalary.shiftBonus;
        employee.bonuses.days += shiftDurationInformation.bonuses;
        shift.bonus.amount = shiftSalary.shiftBonus;
        shift.bonus.days = shiftDurationInformation.bonuses;
        if (shiftDurationInformation.deductions > 0) {
            const shiftDeduction = employee.deductions.deductionsDetails.push({
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
                amount: shiftSalary.shiftDeduction,
                description: 'خصم على الورديه'
            });
            shift.deduction.id = employee.deductions.deductionsDetails[shiftDeduction - 1]._id;
        }
        employee.deductions.totalDeductions += shiftSalary.shiftDeduction;
        employee.deductions.days += shiftDurationInformation.deductions;
        shift.deduction.amount = shiftSalary.shiftDeduction;
        shift.deduction.days = shiftDurationInformation.deductions;
        employee.daysWorked += shiftDurationInformation.duration;
        employee.totalSalary += shiftSalary.shiftDurationSalary + shiftSalary.shiftBonus - shiftSalary.shiftDeduction;
        shift.totalSalary = shiftSalary.shiftDurationSalary + shiftSalary.shiftBonus - shiftSalary.shiftDeduction;
        shift.duration = shiftDurationInformation.duration;
        await employee.save();
        await shift.save();
        return shift;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

const calculateShiftDuration = (shiftStart, shiftEnd) => {
    try {
        const start = moment(shiftStart);
        const end = moment(shiftEnd);
        if (!start.isValid() || !end.isValid()) {
            return { error: 'Invalid date and time!!' };
        }
        if (end.isBefore(start)) {
            return { error: 'End time cannot be before start time!' };
        }
        let duration = end.diff(start, 'days');
        let bonuses = 0, deductions = 0;
        if (duration < 1) {
            return { error: 'Shift duration must be at least 1 day!' };
        }
        if (start.hours() > 9 || (start.hours() === 9 && start.minutes() > 1)) {
            deductions += 0.5;
        }
        if (start.hours() > 12 || (start.hours() === 12 && start.minutes() > 1)) {
            deductions += 0.5;
        }
        if (end.hours() > 9 || (end.hours() === 9 && end.minutes() > 1)) {
            bonuses += 0.5;
        }
        if (end.hours() > 12 || (end.hours() === 12 && end.minutes() > 1)) {
            bonuses += 0.5;
        }
        if (deductions > duration) {
            deductions = duration;
        }
        return { duration, bonuses, deductions };
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.payShifts = async (employeeId) => {
    try {
        const employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return { error: employee.error };
        }
        const shifts = await Shift.updateMany({ employeeId, payed: false }, { payed: true });
        return shifts;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.unpayedShifts = async (employeeId) => {
    try {
        const employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return { error: employee.error };
        }
        const shifts = await Shift.find({ employeeId, payed: false });
        return shifts;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.allUnpayedShifts = async () => {
    try {
        const shifts = await Shift.find({ payed: false });
        return shifts;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.deleteShift = async (shiftId) => {
    try {
        const shift = await Shift.findById(shiftId);
        if (!shift) {
            return { error: 'Shift does not exist!' };
        }
        if (shift.payed) {
            return { error: 'Shift is already payed!' };
        }
        const employee = await employeeService.getEmployee(shift.employeeId);
        if (employee.error) {
            return { error: employee.error };
        }
        if (employee.shift.currentShift === shiftId) {
            employee.shift.inShift = false;
            employee.shift.currentShift = null;
        }
        if (shift.bonus.id != null) {
            employee.bonuses.totalBonuses -= shift.bonus.amount;
            employee.bonuses.days -= shift.bonus.days;
            employee.bonuses.bonusesDetails.pull(shift.bonus.id);
        }
        if (shift.deduction.id != null) {
            employee.deductions.totalDeductions -= shift.deduction.amount;
            employee.deductions.days -= shift.deduction.days;
            employee.deductions.deductionsDetails.pull(shift.deduction.id);
        }
        employee.daysWorked -= shift.duration;
        employee.totalSalary -= shift.totalSalary;
        const deletedShift = await Shift.findByIdAndDelete(shiftId);
        await employee.save();
        return deletedShift;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};