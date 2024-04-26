const router = require('express').Router();

const { addEmployee, updateEmployee, removeEmployee, getEmployees, getEmployee, searchEmployees, updatePaymentMethod } = require('../controllers/employee');
const { isEmployee, isRequired } = require("../validations/employee")

router.post('/add', isRequired(), isEmployee(), addEmployee);

router.put('/update/paymentMethod/:employeeId', updatePaymentMethod);

router.put('/update/:employeeId', isEmployee(), updateEmployee);

router.delete('/remove/:employeeId', removeEmployee);

router.get('/', getEmployees);

router.get('/search', searchEmployees);

router.get('/:employeeId', getEmployee);

module.exports = router;