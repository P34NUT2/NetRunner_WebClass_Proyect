//por lo que vi es buena pratica hacer una especie de routing para solo aplicar o usar en el index
const express = require('express');
const router = express.Router();

const { register } = require('../controllers/Auth_And_Registration');

router.post('/register', register);

module.exports = router;