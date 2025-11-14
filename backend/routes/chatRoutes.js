// Rutas para manejo de chats
const express = require('express');
const router = express.Router();

const {
  getUserChats,
  createChat,
  getChatMessages,
  sendMessage,
  sendMessageStream,
  deleteChat,
  deleteAllChats
} = require('../controllers/ChatController');

const verifyToken = require('../middlewares/verifyToken');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Obtener todos los chats del usuario
router.get('/', getUserChats);

// Crear un nuevo chat
router.post('/', createChat);

// Eliminar TODOS los chats (debe ir ANTES de /:chatId para evitar conflicto)
router.delete('/all', deleteAllChats);

// Obtener mensajes de un chat específico
router.get('/:chatId/messages', getChatMessages);

// Enviar mensaje y obtener respuesta de Ollama (sin streaming - legacy)
router.post('/:chatId/messages', sendMessage);

// Enviar mensaje y obtener respuesta con STREAMING
router.post('/:chatId/stream', sendMessageStream);

// Eliminar un chat
router.delete('/:chatId', deleteChat);

module.exports = router;
