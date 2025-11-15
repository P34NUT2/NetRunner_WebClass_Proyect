const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const AuthRoutes = require('./routes/authRouts');
const ChatRoutes = require('./routes/chatRoutes');

// ===== CONFIGURACIÓN DE CORS =====
// Permitir peticiones desde el frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL del frontend Next.js
  credentials: true, // Permitir envío de cookies y headers de autenticación
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ===== MIDDLEWARES BÁSICOS =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== RUTAS =====
app.get('/', (req, res) => {
    res.json({
        message: `Servidor funcionando en el puerto ${PORT}`,
        endpoints: {
          auth: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/profile (requiere JWT)'
          },
          chat: {
            getChats: 'GET /api/chat (requiere JWT)',
            createChat: 'POST /api/chat (requiere JWT)',
            getMessages: 'GET /api/chat/:chatId/messages (requiere JWT)',
            sendMessage: 'POST /api/chat/:chatId/messages (requiere JWT)',
            deleteChat: 'DELETE /api/chat/:chatId (requiere JWT)'
          }
        },
        services: {
          database: 'PostgreSQL',
          ai: 'Ollama (llama3.2)',
          ollama_host: process.env.OLLAMA_HOST
        },
        security: {
          cors: 'enabled',
          jwt: 'enabled'
        }
    });
});

// Rutas de autenticación
app.use('/api/auth', AuthRoutes);

// Rutas de chat (requieren JWT)
app.use('/api/chat', ChatRoutes);

// ===== MANEJO DE ERRORES =====
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

