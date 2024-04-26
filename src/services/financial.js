const Employee = require('../models/employee');

const employeeService = require('../services/employee');
const shiftService = require('../services/shift');

exports.addFinancial = async (financialData) => {
    try {
        const { id, type, amount, date, description } = financialData;
        const employee = await employeeService.getEmployee(id);
        if (employee.error) {
            return { error: employee.error };
        }
        if (type === 'loan' || type === 'deduction') {
            if (type === 'loan') {
                if (employee.loans.totalLoans + employee.deductions.totalDeductions + amount > employee.baseSalary) {
                    return { error: 'Loan exceeds salary' };
                }
                employee.loans.loansDetails.push({ amount, date, description });
                employee.loans.totalLoans += amount;
                employee.totalSalary -= amount;
            } else {
                employee.deductions.deductionsDetails.push({ amount, date, description });
                employee.deductions.totalDeductions += amount;
                employee.totalSalary -= amount;
            }
        } else if (type === 'bonus' || type === 'compensation') {
            if (type === 'bonus') {
                employee.bonuses.bonusesDetails.push({ amount, date, description });
                employee.bonuses.totalBonuses += amount;
                employee.totalSalary += amount;
            } else {
                employee.compensations.compensationsDetails.push({ amount, date, description });
                employee.compensations.totalCompensations += amount;
                employee.totalSalary += amount;
            }
        } else {
            return { error: 'Invalid financial type' };
        }
        const updatedEmployee = await employee.save();
        return updatedEmployee;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.payEmployee = async (employeeId, payedAmount) => {
    try {
        const employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return { error: employee.error };
        }
        if (employee.totalSalary < payedAmount) {
            return { error: 'Insufficient salary' };
        }
        if (employee.totalSalary < 0) {
            return { error: 'Negative salary' };
        }
        employee.totalSalary > payedAmount ? employee.delayedSalary = employee.totalSalary - payedAmount : employee.delayedSalary = 0;
        employee.payments.push({
            date: new Date(),
            payedAmount,
            paymentMethod: employee.paymentMethod,
            delayedAmount: employee.delayedSalary,
            daysWorked: employee.daysWorked,
            bonusDays: employee.bonuses.days,
            deductionDays: employee.deductions.days,
            totalBonuses: employee.bonuses.totalBonuses,
            totalDeductions: employee.deductions.totalDeductions,
            totalLoans: employee.loans.totalLoans,
            totalCompensations: employee.compensations.totalCompensations
        });
        employee.totalSalary = employee.delayedSalary;
        employee.daysWorked = 0;
        employee.loans.totalLoans = 0;
        employee.bonuses.totalBonuses = 0;
        employee.bonuses.days = 0;
        employee.deductions.totalDeductions = 0;
        employee.deductions.days = 0;
        employee.compensations.totalCompensations = 0;
        await shiftService.payShifts(employeeId);
        const updatedEmployee = await employee.save();
        return updatedEmployee;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.unpayedEmployees = async (workAddress, paymentMethod) => {
    try {
        const unpayedShifts = await shiftService.allUnpayedShifts();
        if (unpayedShifts.error) {
            return { error: unpayedShifts.error };
        }
        const employeeIds = new Set();
        unpayedShifts.forEach(shift => {
            employeeIds.add(shift.employeeId);
        });
        const employees = [];
        let totalEmployeesLoans = 0,
            totalEmployeesBonuses = 0,
            totalEmployeesDeductions = 0,
            totalEmployeesCompensations = 0,
            totalDelayedSalaries = 0,
            totalSalaries = 0,
            totalCosts = 0;
        for (let id of employeeIds) {
            let employee;
            if (workAddress && paymentMethod) {
                employee = await Employee.findOne({ id, workAddress, paymentMethod });
            } else if (workAddress) {
                employee = await Employee.findOne({ id, workAddress });
            } else if (paymentMethod) {
                employee = await Employee.findOne({ id, paymentMethod });
            } else {
                employee = await Employee.findOne({ id });
            }
            if (employee) {
                totalCosts += Math.round(employee.dailySalary * employee.daysWorked * 100) / 100;
                totalEmployeesLoans += employee.loans.totalLoans;
                totalEmployeesBonuses += employee.bonuses.totalBonuses;
                totalEmployeesDeductions += employee.deductions.totalDeductions;
                totalEmployeesCompensations += employee.compensations.totalCompensations;
                totalDelayedSalaries += employee.delayedSalary;
                totalSalaries += employee.totalSalary;
                const currentEmployee = {
                    id: employee.id,
                    name: employee.name,
                    jobRole: employee.jobRole,
                    ssn: employee.ssn,
                    phone: employee.phone,
                    workAddress: employee.workAddress,
                    baseSalary: employee.baseSalary,
                    dailySalary: employee.dailySalary,
                    daysWorked: employee.daysWorked,
                    cost: Math.round(employee.dailySalary * employee.daysWorked * 100) / 100,
                    totalLoans: employee.loans.totalLoans,
                    totalBonuses: employee.bonuses.totalBonuses,
                    totalDeductions: employee.deductions.totalDeductions,
                    totalCompensations: employee.compensations.totalCompensations,
                    delayedSalary: employee.delayedSalary,
                    totalSalary: employee.totalSalary,
                };
                currentEmployee.paymentMethod = employee.paymentMethod;
                if (employee.paymentMethod === 'bank') {
                    currentEmployee.paymentMethodDetails = employee.paymentMethodDetails.bank;
                } else if (employee.paymentMethod === 'wallet') {
                    currentEmployee.paymentMethodDetails = employee.paymentMethodDetails.wallet;
                } else if (employee.paymentMethod === 'postal') {
                    currentEmployee.paymentMethodDetails = employee.paymentMethodDetails.postal;
                } else if (employee.paymentMethod === 'payroll') {
                    currentEmployee.paymentMethodDetails = employee.paymentMethodDetails.payroll;
                } else if (employee.paymentMethod === 'cash') {
                    currentEmployee.paymentMethodDetails = 'cash';
                }
                employees.push(currentEmployee);
            }
        }
        totalCosts = Math.round(totalCosts * 100) / 100;
        totalEmployeesLoans = Math.round(totalEmployeesLoans * 100) / 100;
        totalEmployeesBonuses = Math.round(totalEmployeesBonuses * 100) / 100;
        totalEmployeesDeductions = Math.round(totalEmployeesDeductions * 100) / 100;
        totalEmployeesCompensations = Math.round(totalEmployeesCompensations * 100) / 100;
        totalDelayedSalaries = Math.round(totalDelayedSalaries * 100) / 100;
        totalSalaries = Math.round(totalSalaries * 100) / 100;
        return {
            totalCosts,
            totalEmployeesLoans,
            totalEmployeesBonuses,
            totalEmployeesDeductions,
            totalEmployeesCompensations,
            totalDelayedSalaries,
            totalSalaries,
            employees
        };
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.allUnpayedEmployees = async (workAddress, paymentMethod) => {
    try {
        let employees;
        if (workAddress && paymentMethod) {
            employees = await Employee.find({ totalSalary: { $gt: 0 }, workAddress, paymentMethod });
        } else if (workAddress) {
            employees = await Employee.find({ totalSalary: { $gt: 0 }, workAddress });
        } else if (paymentMethod) {
            employees = await Employee.find({ totalSalary: { $gt: 0 }, paymentMethod });
        } else {
            employees = await Employee.find({ totalSalary: { $gt: 0 } });
        }
        let allEmployees = [];
        let totalEmployeesLoans = 0,
            totalEmployeesBonuses = 0,
            totalEmployeesDeductions = 0,
            totalEmployeesCompensations = 0,
            totalDelayedSalaries = 0,
            totalSalaries = 0,
            totalCosts = 0;
        employees.forEach(employee => {
            totalCosts += Math.round(employee.dailySalary * employee.daysWorked * 100) / 100;
            totalEmployeesLoans += employee.loans.totalLoans;
            totalEmployeesBonuses += employee.bonuses.totalBonuses;
            totalEmployeesDeductions += employee.deductions.totalDeductions;
            totalEmployeesCompensations += employee.compensations.totalCompensations;
            totalDelayedSalaries += employee.delayedSalary;
            totalSalaries += employee.totalSalary;
            const currentEmployee = {
                id: employee.id,
                name: employee.name,
                jobRole: employee.jobRole,
                ssn: employee.ssn,
                phone: employee.phone,
                workAddress: employee.workAddress,
                baseSalary: employee.baseSalary,
                dailySalary: employee.dailySalary,
                daysWorked: employee.daysWorked,
                cost: Math.round(employee.dailySalary * employee.daysWorked * 100) / 100,
                totalLoans: employee.loans.totalLoans,
                totalBonuses: employee.bonuses.totalBonuses,
                totalDeductions: employee.deductions.totalDeductions,
                totalCompensations: employee.compensations.totalCompensations,
                delayedSalary: employee.delayedSalary,
                totalSalary: employee.totalSalary,
            };
            currentEmployee.paymentMethod = employee.paymentMethod;
            if (employee.paymentMethod === 'bank') {
                currentEmployee.paymentMethodDetails = employee.paymentMethodDetails.bank;
            } else if (employee.paymentMethod === 'wallet') {
                currentEmployee.paymentMethodDetails = employee.paymentMethodDetails.wallet;
            } else if (employee.paymentMethod === 'postal') {
                currentEmployee.paymentMethodDetails = employee.paymentMethodDetails.postal;
            } else if (employee.paymentMethod === 'payroll') {
                currentEmployee.paymentMethodDetails = employee.paymentMethodDetails.payroll;
            } else if (employee.paymentMethod === 'cash') {
                currentEmployee.paymentMethodDetails = 'cash';
            }
            allEmployees.push(currentEmployee);
        });
        totalCosts = Math.round(totalCosts * 100) / 100;
        totalEmployeesLoans = Math.round(totalEmployeesLoans * 100) / 100;
        totalEmployeesBonuses = Math.round(totalEmployeesBonuses * 100) / 100;
        totalEmployeesDeductions = Math.round(totalEmployeesDeductions * 100) / 100;
        totalEmployeesCompensations = Math.round(totalEmployeesCompensations * 100) / 100;
        totalDelayedSalaries = Math.round(totalDelayedSalaries * 100) / 100;
        totalSalaries = Math.round(totalSalaries * 100) / 100;
        return {
            totalCosts,
            totalEmployeesLoans,
            totalEmployeesBonuses,
            totalEmployeesDeductions,
            totalEmployeesCompensations,
            totalDelayedSalaries,
            totalSalaries,
            employees: allEmployees
        };
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.resetSalaries = async () => {
    try {
        const employees = await Employee.find({});
        employees.forEach(async (employee) => {
            employee.totalSalary = 0;
            employee.daysWorked = 0;
            employee.loans.totalLoans = 0;
            employee.bonuses.totalBonuses = 0;
            employee.bonuses.days = 0;
            employee.deductions.totalDeductions = 0;
            employee.deductions.days = 0;
            employee.compensations.totalCompensations = 0;
            await employee.save();
        });
        return employees;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.calculateShiftFinancials = async (employeeId, shiftInformation) => {
    try {
        const employee = await employeeService.getEmployee(employeeId);
        if (employee.error) {
            return { error: employee.error };
        }
        const shiftDurationSalary = employee.dailySalary * shiftInformation.duration;
        const shiftBonus = employee.dailySalary * shiftInformation.bonuses;
        const shiftDeduction = employee.dailySalary * shiftInformation.deductions;
        return { shiftDurationSalary, shiftBonus, shiftDeduction };
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};