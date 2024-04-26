const router = require('express').Router();

const { getEmployeeWithFinancials, addFinancial, payEmployee, resetSalaries, unpayedEmployees } = require('../controllers/financial');
const { generateFile } = require('../controllers/fileGeneration');
const { isFinancial, isPayroll } = require('../validations/financial');

router.get('/unpayed', unpayedEmployees);

router.get('/:employeeId', getEmployeeWithFinancials);

router.post('/:employeeId', isFinancial(), addFinancial);

router.post('/payroll/:employeeId', isPayroll(), payEmployee);

router.put('/reset', resetSalaries);

module.exports = router;