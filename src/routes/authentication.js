const router = require('express').Router();

const { login, logout } = require('../controllers/authentication');
const authValidation = require("../validations/authentication")

router.post('/login', authValidation.login(), login);

router.post('/logout', logout);

module.exports = router;