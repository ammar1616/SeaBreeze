const router = require('express').Router();

const { createDebt, getDebts, getAllDebts, makePayment, getDebt } = require('../controllers/debt');
const { isDebt, isPayment } = require('../validations/debt');

router.get('/', getAllDebts);

router.post('/:employeeId', isDebt(), createDebt);

router.get('/employees/:employeeId', getDebts);

router.get('/:debtId', getDebt);

router.patch('/:debtId', isPayment(), makePayment);

module.exports = router;