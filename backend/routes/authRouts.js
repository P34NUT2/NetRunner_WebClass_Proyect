//por lo que vi es buena pratica hacer una especie de routing para solo aplicar o usar en el index
const express = require('express');
const router = express.Router();

const { register, login, getProfile } = require('../controllers/Auth_And_Registration');
const verifyToken = require('../middlewares/verifyToken');

// Rutas públicas (no requieren autenticación)
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas (requieren autenticación con JWT)
router.get('/profile', verifyToken, getProfile);

module.exports = router;