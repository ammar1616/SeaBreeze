const router = require('express').Router();

const { shift, getShiftsWithFinancials, getShifts, getShift, deleteShift } = require('../controllers/shift');
const { isDateTime } = require('../validations/shift');
const { notSecretary, isAdmin, notAccountant } = require('../middlewares/checkUser');

router.post('/:employeeId', notAccountant, isDateTime(), shift);

router.get('/financials/:employeeId', notSecretary, getShiftsWithFinancials);

router.get('/employees/:employeeId', getShifts);

router.get('/:shiftId', getShift);

router.delete('/:shiftId', isAdmin, deleteShift);

module.exports = router;