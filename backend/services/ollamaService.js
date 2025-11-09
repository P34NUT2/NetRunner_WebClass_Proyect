// Servicio para conectar con Ollama
const { Ollama } = require('ollama');

// Configurar la conexión a Ollama
const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434'
});

/**
 * Envía un mensaje a Ollama y obtiene la respuesta
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

    // Enviar a Ollama
    const response = await ollama.chat({
      model: 'llama3.2',
      messages: messages,
      stream: false // Sin streaming por ahora
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
 * Verifica que Ollama esté funcionando
 * @returns {Promise<boolean>}
 */
const checkHealth = async () => {
  try {
    const models = await ollama.list();
    return models.models.some(m => m.name.includes('llama3.2'));
  } catch (error) {
    console.error('Ollama no está disponible:', error);
    return false;
  }
};

module.exports = {
  sendMessage,
  checkHealth
};
