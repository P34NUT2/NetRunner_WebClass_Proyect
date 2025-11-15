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
const login = async (req, res) => {
  try {
    // 1. Extraemos username y password del body
    const { username, password } = req.body;

    // 2. Validamos que ambos campos estén presentes
    if (!username || !password) {
      return res.status(400).json({
        error: 'Username y password son requeridos'
      });
    }

    // 3. Buscamos el usuario en la base de datos por username
    const user = await prisma.user.findUnique({
      where: { username }
    });

    // 4. Si no existe el usuario, devolvemos error genérico
    // SEGURIDAD: NO revelamos si el username existe o no (info útil para enumerar usuarios)
    // Usamos el mismo mensaje para ambos casos (user no existe o password incorrecta)
    if (!user) {
      return res.status(404).json({
        error: 'Recurso no encontrado.'
      });
    }

    // 5. Comparamos la contraseña proporcionada con el hash guardado
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 6. Si la contraseña no coincide, devolvemos el MISMO error que arriba
    // SEGURIDAD: Timing attack protection - siempre tardamos lo mismo
    if (!isPasswordValid) {
      return res.status(404).json({
        error: 'Recurso no encontrado.'
      });
    }

    // 7. Generamos un token JWT con los datos del usuario
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 8. Devolvemos el token y los datos del usuario (sin la contraseña)
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        role: user.role,
        profileImg: user.profileImg
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error al iniciar sesión',
      details: error.message
    });
  }
};

//////////////////////////////////
// Funcion Identificacion USRS
//////////////////////////////////
const getProfile = async (req, res) => {
  try {
    // req.user viene del middleware verifyToken
    const userId = req.user.userId;

    // Buscamos el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        realName: true,
        role: true,
        profileImg: true,
        createdAt: true,
        updatedAt: true
        // NO incluimos password por seguridad
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      user
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      error: 'Error al obtener perfil',
      details: error.message
    });
  }
};

//////////////////////////////////
// ACTUALIZAR PERFIL
//////////////////////////////////
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { realName } = req.body;

    // Validar que realName esté presente
    if (!realName) {
      return res.status(400).json({
        error: 'El nombre completo es requerido'
      });
    }

    // Validar longitud
    if (realName.length > 50) {
      return res.status(400).json({
        error: 'El nombre real no puede tener más de 50 caracteres'
      });
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { realName },
      select: {
        id: true,
        username: true,
        realName: true,
        role: true,
        profileImg: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      error: 'Error al actualizar perfil',
      details: error.message
    });
  }
};

//exportamos todo esto
module.exports = {
    register,
    login,
    getProfile,
    updateProfile
 };

