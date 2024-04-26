const router = require('express').Router();

const { generateFile } = require('../controllers/fileGeneration');

router.get('/xlsx', generateFile);

module.exports = router;