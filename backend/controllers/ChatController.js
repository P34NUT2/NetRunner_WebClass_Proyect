// Controlador para manejar los chats
const prisma = require('../config/prisma');
const ollamaService = require('../services/ollamaService');

/**
 * Obtener todos los chats de un usuario
 */
const getUserChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true }
        }
      }
    });

    res.status(200).json({ chats });

  } catch (error) {
    console.error('Error al obtener chats:', error);
    res.status(500).json({
      error: 'Error al obtener chats',
      details: error.message
    });
  }
};

/**
 * Crear un nuevo chat
 */
const createChat = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const newChat = await prisma.chat.create({
      data: {
        title,
        userId
      }
    });

    res.status(201).json({
      message: 'Chat creado exitosamente',
      chat: newChat
    });

  } catch (error) {
    console.error('Error al crear chat:', error);
    res.status(500).json({
      error: 'Error al crear chat',
      details: error.message
    });
  }
};

/**
 * Obtener mensajes de un chat específico
 */
const getChatMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const chatId = parseInt(req.params.chatId);

    // Verificar que el chat pertenezca al usuario
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat no encontrado' });
    }

    // Obtener mensajes
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json({ messages });

  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({
      error: 'Error al obtener mensajes',
      details: error.message
    });
  }
};

/**
 * Enviar un mensaje y obtener respuesta de Ollama CON STREAMING
 */
const sendMessageStream = async (req, res) => {
  try {
    const userId = req.user.userId;
    const chatId = parseInt(req.params.chatId);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    // Verificar que el chat pertenezca al usuario
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat no encontrado' });
    }

    // Guardar el mensaje del usuario
    const userMessage = await prisma.message.create({
      data: {
        chatId,
        role: 'user',
        content
      }
    });

    // Obtener contexto (últimos 10 mensajes)
    const previousMessages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      take: 10,
      select: {
        role: true,
        content: true
      }
    });

    // Construir contexto para Ollama
    const context = previousMessages.slice(0, -1).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Configurar SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    // Enviar a Ollama con streaming
    const response = await ollamaService.sendMessageStream(
      content,
      context,
      (chunk) => {
        // Cada vez que llega un pedazo de texto, enviarlo al frontend
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    );

    // Guardar respuesta completa en la base de datos
    const assistantMessage = await prisma.message.create({
      data: {
        chatId,
        role: 'assistant',
        content: fullResponse
      }
    });

    // Actualizar timestamp del chat
    const messageCount = await prisma.message.count({
      where: { chatId }
    });

    let updatedChat;
    if (messageCount === 2) {
      const newTitle = content.length > 47
        ? content.substring(0, 47) + '...'
        : content;

      updatedChat = await prisma.chat.update({
        where: { id: chatId },
        data: {
          title: newTitle,
          updatedAt: new Date()
        }
      });
    } else {
      updatedChat = await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() }
      });
    }

    // Enviar mensaje final con datos completos
    res.write(`data: ${JSON.stringify({
      done: true,
      userMessage,
      assistantMessage,
      chat: updatedChat
    })}\n\n`);

    res.end();

  } catch (error) {
    console.error('Error al enviar mensaje con streaming:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

/**
 * Enviar un mensaje y obtener respuesta de Ollama (SIN streaming - legacy)
 */
const sendMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const chatId = parseInt(req.params.chatId);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'El mensaje es requerido' });
    }

    // Verificar que el chat pertenezca al usuario
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat no encontrado' });
    }

    // Guardar el mensaje del usuario
    const userMessage = await prisma.message.create({
      data: {
        chatId,
        role: 'user',
        content
      }
    });

    // Obtener contexto (últimos 10 mensajes)
    const previousMessages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      take: 10,
      select: {
        role: true,
        content: true
      }
    });

    // Construir contexto para Ollama
    const context = previousMessages.slice(0, -1).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Enviar a Ollama (el modelo ya tiene el contexto integrado)
    const ollamaResponse = await ollamaService.sendMessage(content, context);

    // Guardar respuesta de Ollama
    const assistantMessage = await prisma.message.create({
      data: {
        chatId,
        role: 'assistant',
        content: ollamaResponse.message
      }
    });

    // Verificar si es el primer mensaje del chat y actualizar el título
    const messageCount = await prisma.message.count({
      where: { chatId }
    });

    let updatedChat;
    if (messageCount === 2) {
      // Es el primer intercambio (1 user + 1 assistant = 2 mensajes)
      // Actualizar título del chat con el primer mensaje del usuario (truncado)
      const newTitle = content.length > 47
        ? content.substring(0, 47) + '...'
        : content;

      updatedChat = await prisma.chat.update({
        where: { id: chatId },
        data: {
          title: newTitle,
          updatedAt: new Date()
        }
      });
    } else {
      // Solo actualizar timestamp
      updatedChat = await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() }
      });
    }

    res.status(200).json({
      userMessage,
      assistantMessage,
      chat: updatedChat  // Devolver el chat actualizado
    });

  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({
      error: 'Error al enviar mensaje',
      details: error.message
    });
  }
};

/**
 * Eliminar un chat
 */
const deleteChat = async (req, res) => {
  try {
    const userId = req.user.userId;
    const chatId = parseInt(req.params.chatId);

    // Verificar que el chat pertenezca al usuario
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat no encontrado' });
    }

    // Eliminar chat (los mensajes se eliminan en cascada)
    await prisma.chat.delete({
      where: { id: chatId }
    });

    res.status(200).json({ message: 'Chat eliminado exitosamente' });

  } catch (error) {
    console.error('Error al eliminar chat:', error);
    res.status(500).json({
      error: 'Error al eliminar chat',
      details: error.message
    });
  }
};

/**
 * Eliminar TODOS los chats de un usuario
 */
const deleteAllChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Eliminar todos los chats del usuario (los mensajes se eliminan en cascada)
    const result = await prisma.chat.deleteMany({
      where: { userId }
    });

    res.status(200).json({
      message: 'Todos los chats eliminados exitosamente',
      count: result.count
    });

  } catch (error) {
    console.error('Error al eliminar todos los chats:', error);
    res.status(500).json({
      error: 'Error al eliminar todos los chats',
      details: error.message
    });
  }
};

module.exports = {
  getUserChats,
  createChat,
  getChatMessages,
  sendMessage,
  sendMessageStream,
  deleteChat,
  deleteAllChats
};
