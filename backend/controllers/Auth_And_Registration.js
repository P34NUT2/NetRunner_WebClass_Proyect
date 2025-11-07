//importo prisma para usarlo
const prisma = require('../config/prisma');

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Agregamos Salt para prevenir fuerza bruta en este caso 10 carcateres aleatorios
const SALT = 10;

//////////////////////////////////
// REGISTRO DE USUARIOS
//////////////////////////////////
const register = async (req, res) => {
  try {
    // 1. Extraemos los datos del body
    const { username, realName, password } = req.body;

    // 2. Validamos que todos los campos estén presentes
    if (!username || !realName || !password) {
      return res.status(400).json({
        error: 'Todos los campos son requeridos: username, realName, password'
      });
    }

    // 3. Validamos la longitud del username (máximo 20 caracteres según el schema)
    if (username.length > 20) {
      return res.status(400).json({
        error: 'El username no puede tener más de 20 caracteres'
      });
    }

    // 4. Validamos la longitud del realName (máximo 50 caracteres según el schema)
    if (realName.length > 50) {
      return res.status(400).json({
        error: 'El nombre real no puede tener más de 50 caracteres'
      });
    }

    // 5. Validamos que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      return res.status(400).json({
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // 6. Verificamos si el username ya existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    // Aca se supone que tengo que poner un 403 pero por lo que eh aprendido de hacking
    //es mala idea indicarla al atacante que hay un probelma de permisos mejor envio un 400
    if (existingUser) {
      return res.status(400).json({
        error: 'No se pudo completar el registro. Verifica tus datos.'
      });
    }

    // 7. Hasheamos la contraseña antes de guardarla
    // NUNCA guardamos contraseñas en texto plano
    const hashedPassword = await bcrypt.hash(password, SALT);

    // 8. Creamos el usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        username,
        realName,
        password: hashedPassword,
        role: 'user' // Por defecto todos los usuarios nuevos tienen rol 'user'
      }
    });

    // 9. Generamos un token JWT para el nuevo usuario
    const token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
        role: newUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 10. Devolvemos la respuesta exitosa (NO incluimos la contraseña)
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        realName: newUser.realName,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error al registrar usuario',
      details: error.message
    });
  }
};

//////////////////////////////////
// LOGIN DE USUARIOS
//////////////////////////////////


//exportamos todo esto
module.exports = { register };

