const router = require('express').Router();

const { getUser, getUsers, addUser, updateUser, updatePassword, deleteUser } = require('../controllers/user');
const { isUser, isPassword, isRequired } = require('../validations/user');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', isRequired(), isUser(), isPassword(), addUser);

router.put('/:userId', isUser(), updateUser);

router.put('/:userId/password', isPassword(), updatePassword);

router.delete('/:userId', deleteUser);

module.exports = router;