const Employee = require('../models/employee');

exports.getEmployees = async () => {
    try {
        const employees = await Employee.find({});
        return employees;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.getEmployee = async (employeeId) => {
    try {
        const employee = await Employee.findOne({ id: employeeId });
        if (!employee) {
            return { error: 'Employee does not exist!' };
        }
        return employee;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.createEmployee = async (employeeData) => {
    try {
        const { id, name, jobRole, ssn, phone, workAddress, baseSalary, paymentMethod, paymentMethodDetails } = employeeData;
        const dailySalary = baseSalary / 30;
        const employee = new Employee({
            id,
            name,
            jobRole,
            ssn,
            phone,
            workAddress,
            baseSalary,
            totalSalary: 0,
            dailySalary,
            daysWorked: 0,
            delayedSalary: 0,
            shift: {
                inShift: false,
                currentShift: null
            },
        });
        if (paymentMethodDetails) {
            if (paymentMethod === 'bank') {
                employee.paymentMethodDetails.bank = {
                    accountNumber: paymentMethodDetails.accountNumber,
                    bankName: paymentMethodDetails.bankName,
                }
            } else if (paymentMethod === 'wallet') {
                employee.paymentMethodDetails.wallet = {
                    phoneNumber: paymentMethodDetails.phoneNumber,
                    walletName: paymentMethodDetails.walletName,
                }
            } else if (paymentMethod === 'postal') {
                employee.paymentMethodDetails.postal.ssn = paymentMethodDetails.ssn;
                if (employee.ssn !== paymentMethodDetails.ssn) {
                    employee.paymentMethodDetails.postal.name = paymentMethodDetails.name;
                } else {
                    employee.paymentMethodDetails.postal.name = employee.name;
                }
            } else if (paymentMethod === 'payroll') {
                employee.paymentMethodDetails.payroll = {
                    accountNumber: paymentMethodDetails.accountNumber,
                }
            } else if (paymentMethod === 'cash') {
                employee.paymentMethod = paymentMethod;
            } else {
                return { error: 'Invalid Payment Method' };
            }
            employee.paymentMethod = paymentMethod;
        }
        await employee.save();
        return employee;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.updateEmployee = async (employeeData) => {
    try {
        const { id, name, jobRole, ssn, phone, workAddress, baseSalary, paymentMethod } = employeeData;
        const employee = await Employee.findOne({ id });
        if (!employee) {
            return { error: 'Employee does not exist!' };
        }
        const existingEmployee = await Employee.findOne({ ssn });
        if (existingEmployee && existingEmployee.id.toString() !== id.toString()) {
            return { error: 'SSN already exists!' };
        }
        if (phone) {
            const existingEmployee = await Employee.findOne({ phone });
            if (existingEmployee && existingEmployee.id.toString() !== id.toString()) {
                return { error: 'Phone already exists!' };
            }
        }
        employee.name = name || employee.name;
        employee.jobRole = jobRole || employee.jobRole;
        employee.ssn = ssn || employee.ssn;
        employee.phone = phone || employee.phone;
        employee.workAddress = workAddress || employee.workAddress;
        employee.baseSalary = baseSalary || employee.baseSalary;
        employee.dailySalary = employee.baseSalary / 30;
        employee.paymentMethod = paymentMethod || employee.paymentMethod;
        await employee.save();
        return employee;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.updatePaymentMethod = async (employeeId, paymentMethod, paymentMethodDetails) => {
    try {
        const employee = await Employee.findOne({ id: employeeId });
        if (!employee) {
            return { error: 'Employee does not exist!' };
        }
        if (paymentMethodDetails) {
            if (paymentMethod === 'bank') {
                employee.paymentMethodDetails.bank = {
                    accountNumber: paymentMethodDetails.accountNumber,
                    bankName: paymentMethodDetails.bankName,
                }
            } else if (paymentMethod === 'wallet') {
                employee.paymentMethodDetails.wallet = {
                    phoneNumber: paymentMethodDetails.phoneNumber,
                    walletName: paymentMethodDetails.walletName,
                }
            } else if (paymentMethod === 'postal') {
                employee.paymentMethodDetails.postal = {
                    ssn: paymentMethodDetails.ssn,
                    name: paymentMethodDetails.name,
                }
            } else if (paymentMethod === 'payroll') {
                employee.paymentMethodDetails.payroll = {
                    accountNumber: paymentMethodDetails.accountNumber,
                }
            } else if (paymentMethod === 'cash') {
                employee.paymentMethod = paymentMethod;
            } else {
                return { error: 'Invalid payment method' };
            }
        }
        employee.paymentMethod = paymentMethod;
        const updatedEmployee = await employee.save();
        return updatedEmployee;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.deleteEmployee = async (employeeId) => {
    try {
        const employee = await Employee.findOne({ id: employeeId });
        if (!employee) {
            return { error: 'Employee does not exist!' };
        }
        await employee.deleteOne();
        return employee;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

exports.searchEmployees = async (query) => {
    try {
        const employees = await Employee.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { jobRole: query },
                { workAddress: query },
                { ssn: query },
                { phone: query }
            ]
        });
        return employees;
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};