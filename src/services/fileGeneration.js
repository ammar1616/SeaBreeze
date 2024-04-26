const ExcelJS = require('exceljs');

exports.xlxsGeneration = async (filter, data) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sea Breeze');
        worksheet.properties.defaultRowHeight = 20;
        worksheet.properties.defaultColWidth = 15;
        let columns = commonHeaders;
        if (filter === 'bank') {
            columns = columns.concat(bankHeaders);
        } else if (filter === 'wallet') {
            columns = columns.concat(walletHeaders);
        } else if (filter === 'postal') {
            columns = columns.concat(postalHeaders);
        } else if (filter === 'payroll') {
            columns = columns.concat(payrollHeaders);
        }
        worksheet.columns = columns;
        data.employees.forEach((employee) => {
            const row = {
                id: employee.id,
                name: employee.name,
                jobRole: employee.jobRole,
                workAddress: employee.workAddress,
                baseSalary: employee.baseSalary,
                dailySalary: employee.dailySalary,
                daysWorked: employee.daysWorked,
                cost: employee.cost,
                totalLoans: employee.totalLoans,
                totalBonuses: employee.totalBonuses,
                totalDeductions: employee.totalDeductions,
                totalCompensations: employee.totalCompensations,
                delayedSalary: employee.delayedSalary,
                totalSalary: employee.totalSalary
            };
            if (employee.paymentMethod === 'bank') {
                row.paymentMethod = 'تحويل بنكي';
            } else if (employee.paymentMethod === 'wallet') {
                row.paymentMethod = 'محفظة إلكترونية';
            } else if (employee.paymentMethod === 'postal') {
                row.paymentMethod = 'بريد';
            } else if (employee.paymentMethod === 'payroll') {
                row.paymentMethod = 'Payroll';
            } else {
                row.paymentMethod = 'كاش';
            }
            if (filter === 'bank') {
                row.bank = employee.paymentMethodDetails.bankName;
                row.accountNumber = employee.paymentMethodDetails.accountNumber.toString();
            } else if (filter === 'wallet') {
                row.wallet = employee.paymentMethodDetails.walletName;
                row.phoneNumber = employee.paymentMethodDetails.phoneNumber.toString();
            } else if (filter === 'postal') {
                row.receiverName = employee.paymentMethodDetails.name;
                row.ssn = employee.paymentMethodDetails.ssn.toString();
            } else if (filter === 'payroll') {
                row.accountNumber = employee.paymentMethodDetails.accountNumber.toString();
            }
            worksheet.addRow(row);
        });
        const date = new Date();
        const fileName = `seabreeze${filter ? `-${filter}` : ''}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}.xlsx`;
        const filePath = `./docs/${fileName}`;
        await workbook.xlsx.writeFile(filePath);
        return filePath.toString();
    } catch (error) {
        console.log(error);
        return { error: 'Internal Server Error' };
    }
};

const commonHeaders = [
    { header: 'الكود', key: 'id', width: 4, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'الاسم', key: 'name', width: 13, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'الوطيفة', key: 'jobRole', width: 7, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } }, ,
    { header: 'المركب', key: 'workAddress', width: 9, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'المرتب الاساسي', key: 'baseSalary', width: 7, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'مرتب اليوم', key: 'dailySalary', width: 5, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'ايام العمل', key: 'daysWorked', width: 5, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'التكلفه', key: 'cost', width: 5, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'السلف', key: 'totalLoans', width: 5, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'المكافآت', key: 'totalBonuses', width: 5, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'الاستقطاعات', key: 'totalDeductions', width: 6, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'البدلات', key: 'totalCompensations', width: 5, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'المرتب المرحل', key: 'delayedSalary', width: 7, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'صافي المرتب', key: 'totalSalary', width: 6, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'طريقة الدفع', key: 'paymentMethod', width: 7, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } }
];

const bankHeaders = [
    { header: 'البنك', key: 'bank', width: 10, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'رقم الحساب', key: 'accountNumber', width: 12, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } }
];

const walletHeaders = [
    { header: 'المحفظة', key: 'wallet', width: 9, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'رقم المحمول', key: 'phoneNumber', width: 11, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } }
];

const postalHeaders = [
    { header: 'المستلم', key: 'receiverName', width: 12, style: { border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
    { header: 'الرقم القومي', key: 'ssn', width: 12, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } }
];

const payrollHeaders = [
    { header: 'رقم الحساب', key: 'accountNumber', width: 12, style: { alignment: { horizontal: 'center' }, border: { bottom: { style: 'thin' }, right: { style: 'thin' }, left: { style: 'thin' }, top: { style: 'thin' } }, font: { size: 7 } } },
];