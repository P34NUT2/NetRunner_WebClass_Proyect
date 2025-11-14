import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

/**
 * ========== COMPONENTE HIJO: InputArea ==========
 *
 * Este es un componente HIJO que recibe props de su PADRE (Home).
 */

// ========== DEFINICIÓN DE PROPS ==========
/**
 * Interface Props define qué datos recibe este componente del PADRE
 *
 * Props que recibe:
 * - onSendMessage: Función callback del padre para enviar mensajes
 * - isTyping: Boolean que indica si el bot está escribiendo
 */
interface Props {
  onSendMessage: (text: string) => void;  // Función callback
  isTyping: boolean;                      // Dato booleano
}

/**
 * El componente recibe las props mediante desestructuración:
 * { onSendMessage, isTyping }
 *
 * Esto es equivalente a:
 * const onSendMessage = props.onSendMessage;
 * const isTyping = props.isTyping;
 */
const InputArea: React.FC<Props> = ({ onSendMessage, isTyping }) => {
  // ========== ESTADO LOCAL ==========
  /**
   * Este componente tiene su propio estado LOCAL:
   * - message: almacena el texto que el usuario está escribiendo
   *
   * ¿Por qué este estado vive AQUÍ y no en el padre?
   * Porque solo este componente necesita saber qué está escribiendo el usuario
   * en tiempo real. El padre solo necesita saber cuando se ENVÍA el mensaje.
   */
  const [message, setMessage] = useState("");

    /*Con esto se interactua con el evento y pdemos atrabes de los atributos del text area y el evento hacer  resize al textarea */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);

    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  // ========== FUNCIÓN QUE USA EL CALLBACK DEL PADRE ==========
  /**
   * handleSubmit se ejecuta cuando el usuario envía el mensaje
   *
   * AQUÍ ES DONDE EL HIJO SE COMUNICA CON EL PADRE:
   * - Llama a onSendMessage() que es la función del PADRE
   * - Le pasa el texto del mensaje
   * - El PADRE recibe esto y actualiza su estado
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTyping) {
      // ⚠️ IMPORTANTE: Aquí llamamos a la función del PADRE
      // Esto es como "avisar" al padre: "Hey, el usuario envió este mensaje"
      onSendMessage(message.trim());

      // Limpiamos el estado LOCAL de este componente
      setMessage("");

      // Reset textarea height
      const textarea = document.getElementById("user-input") as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = "auto";
      }
    }
  };

  // ========== RENDERIZADO ==========
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
      <form id="chat-form" className="flex space-x-3" onSubmit={handleSubmit}>
        <div className="flex-1 relative">
          {/*
            Textarea controlado:
            - value={message} usa el estado LOCAL para controlar el contenido
            - disabled={isTyping} usa la prop del PADRE para deshabilitar cuando el bot escribe
            - placeholder cambia según isTyping
          */}
          <textarea
            id="user-input"
            rows={1}
            placeholder={isTyping ? "NetRunner está escribiendo..." : "Escribe tu mensaje..."}
            value={message}
            onChange={handleInputChange}
            disabled={isTyping}
            className={`w-full border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none textarea-scrollbar ${
              isTyping
                ? "bg-gray-700 border-gray-600 cursor-not-allowed opacity-70"
                : "bg-gray-800 border-gray-700"
            }`}
            style={{ minHeight: "50px", maxHeight: "230px" }}
          />
        </div>
        <button
          type="submit"
          disabled={isTyping || !message.trim()}
          className={`rounded-lg w-12 h-12 flex items-center justify-center transition-all duration-200 ${
            isTyping || !message.trim()
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 active:scale-90 text-black animate-pulse-slow"
          }`}
        >
          <FaPaperPlane className={!isTyping && message.trim() ? "animate-bounce-subtle" : ""} />
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2 px-1">
        NetRunner puede cometer errores. Verifica información importante.
      </p>
    </div>
  );
};

export default InputArea;
