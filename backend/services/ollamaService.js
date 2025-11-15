// Servicio para conectar con Ollama
const { Ollama } = require('ollama');

// Configurar la conexión a Ollama
const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434'
});

/**
 * Envía un mensaje a Ollama y obtiene la respuesta (SIN streaming)
 * @param {string} prompt - El mensaje del usuario
 * @param {Array} context - Conversación previa (opcional)
 * @returns {Promise<Object>} - Respuesta de Ollama
 */
const sendMessage = async (prompt, context = []) => {
  try {
    // Construir el historial de mensajes
    const messages = [
      ...context,
      {
        role: 'user',
        content: prompt
      }
    ];

    // Enviar a Ollama con modelo netrunner
    const response = await ollama.chat({
      model: 'netrunner',
      messages: messages,
      stream: false
    });

    return {
      success: true,
      message: response.message.content,
      model: response.model,
      done: response.done
    };

  } catch (error) {
    console.error('Error en Ollama:', error);
    throw new Error('Error al comunicarse con Ollama: ' + error.message);
  }
};

/**
 * Envía un mensaje a Ollama con STREAMING
 * @param {string} prompt - El mensaje del usuario
 * @param {Array} context - Conversación previa (opcional)
 * @param {Function} onChunk - Callback que recibe cada pedazo de texto
 * @returns {Promise<string>} - Texto completo generado
 */
const sendMessageStream = async (prompt, context = [], onChunk) => {
  try {
    // Construir el historial de mensajes
    const messages = [
      ...context,
      {
        role: 'user',
        content: prompt
      }
    ];

    let fullResponse = '';

    // Enviar a Ollama CON streaming
    const stream = await ollama.chat({
      model: 'netrunner',
      messages: messages,
      stream: true // ACTIVAR STREAMING
    });

    // Procesar cada chunk que llega
    for await (const chunk of stream) {
      if (chunk.message && chunk.message.content) {
        const text = chunk.message.content;
        fullResponse += text;

        // Llamar al callback con el nuevo texto
        if (onChunk) {
          onChunk(text);
        }
      }
    }

    return fullResponse;

  } catch (error) {
    console.error('Error en Ollama streaming:', error);
    throw new Error('Error al comunicarse con Ollama: ' + error.message);
  }
};

/**
 * Verifica que Ollama esté funcionando
 * @returns {Promise<boolean>}
 */
const checkHealth = async () => {
  try {
    const models = await ollama.list();
    return models.models.some(m => m.name.includes('netrunner'));
  } catch (error) {
    console.error('Ollama no está disponible:', error);
    return false;
  }
};

module.exports = {
  sendMessage,
  sendMessageStream,
  checkHealth
};
