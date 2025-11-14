import React, { useRef, useEffect } from "react";
import { FaRobot, FaUser } from "react-icons/fa";

interface Props {
  messages: {text: string, sender: 'user' | 'bot'}[];
  isTyping?: boolean;
}

const MessageBox: React.FC<Props> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando cambian los mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      id="chat-messages"
      className="flex-1 overflow-y-auto custom-scrollbar space-y-7 pb-32"
    >
      {/* Mensaje inicial del bot */}
      <div className="message-fade-in flex">
        <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0 flex items-center justify-center mr-3">
          <FaRobot className="text-black" />
        </div>
        <div className="bg-gray-900 rounded-lg p-4 max-w-[85%]">
          <p className="text-sm text-gray-400 mb-1">NetRunner</p>
          <p className="text-white">
            Hola, soy NetRunner. Un modelo de lenguaje avanzado. ¿En qué puedo
            ayudarte hoy?
          </p>
        </div>
      </div>

      {/* Todos los mensajes */}

      {/*Mensajes del usuario y depues de la IA*/}
      {messages.map((message, index) => (
        <div key={index} className={`message-fade-in flex ${message.sender === 'user' ? 'justify-end' : ''}`}>
          {message.sender === 'bot' ? (
            <>
              <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0 flex items-center justify-center mr-3">
                <FaRobot className="text-black" />
              </div>
              <div className="bg-gray-900 rounded-lg p-4 max-w-[85%]">
                <p className="text-sm text-gray-400 mb-1">NetRunner</p>
                <p className="text-white">{message.text}</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-[85%]">
                <p className="text-sm text-red-400 mb-1">Tú</p>
                <p className="text-white">{message.text}</p>
              </div>
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex-shrink-0 flex items-center justify-center ml-3 border border-red-500/30">
                <FaUser className="text-red-500" />
              </div>
            </>
          )}
        </div>
      ))}

      {/* Indicador de "is typing" cuando la IA está procesando */}
      {isTyping && (
        <div className="flex">
          <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0 flex items-center justify-center mr-3">
            <FaRobot className="text-black" />
          </div>
          <div className="bg-gray-900 rounded-lg p-4 max-w-[85%]">
            <p className="text-sm text-gray-400 mb-1">NetRunner</p>
            <p className="text-white typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </p>
          </div>
        </div>
      )}

      {/* Elemento invisible para auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageBox;
