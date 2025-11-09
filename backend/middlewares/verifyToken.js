// Middleware para verificar JWT
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  try {
    // 1. Extraer el token del header Authorization
    // Formato esperado: "Bearer TOKEN_AQUI"
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token no proporcionado'
      });
    }

    // 2. Extraer el token (remover "Bearer ")
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: 'Token no proporcionado'
      });
    }

    // 3. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Agregar los datos del usuario al request
    // Esto permite que los siguientes middlewares/controladores
    // puedan acceder a req.user
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };

    // 5. Continuar con el siguiente middleware/controlador
    next();

  } catch (error) {
    // Si el token es inválido o expiró
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado'
      });
    }

    // Otros errores
    console.error('Error en verificación de token:', error);
    return res.status(500).json({
      error: 'Error al verificar token'
    });
  }
};

module.exports = verifyToken;
