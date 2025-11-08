'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import MessageBox from '@/components/MessagesBox';
import InputArea from '@/components/InputArea';
import Sidebar from '@/components/Sidebar';

/**
 * ═══════════════════════════════════════════════════════════════════════
 *                     COMPONENTE PADRE: Home
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Este es el componente PADRE principal de la página home (/).
 * Un componente PADRE es el que contiene y controla otros componentes (HIJOS).
 *
 * ═══════════════════════════════════════════════════════════════════════
 *                     ARQUITECTURA DE COMPONENTES
 * ═══════════════════════════════════════════════════════════════════════
 *
 *                        ┌─────────────────┐
 *                        │   Home (PADRE)  │
 *                        │                 │
 *                        │  Estado:        │
 *                        │  - messages[]   │
 *                        │  - isTyping     │
 *                        └────────┬────────┘
 *                                 │
 *                 ┌───────────────┼───────────────┐
 *                 │               │               │
 *          ┌──────▼──────┐ ┌──────▼──────┐ ┌────▼─────┐
 *          │   Header    │ │ MessageBox  │ │InputArea │
 *          │   (HIJO)    │ │   (HIJO)    │ │  (HIJO)  │
 *          │             │ │             │ │          │
 *          │ Props: ∅    │ │Props:       │ │Props:    │
 *          │             │ │- messages   │ │- onSend  │
 *          │             │ │- isTyping   │ │- isTyping│
 *          └─────────────┘ └─────────────┘ └────┬─────┘
 *                                                │
 *                          Usuario escribe  ─────┘
 *                          y envía mensaje
 *
 * ═══════════════════════════════════════════════════════════════════════
 *                     FLUJO DE DATOS (Data Flow)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * 1. PADRE → HIJO (Props):
 *    - Los datos fluyen del PADRE a los HIJOS mediante PROPS
 *    - Los HIJOS NO pueden modificar las props (son de solo lectura)
 *
 * 2. HIJO → PADRE (Callbacks):
 *    - Los HIJOS se comunican con el PADRE mediante funciones CALLBACK
 *    - El HIJO ejecuta la función, pero la lógica vive en el PADRE
 *
 * 3. HERMANO → HERMANO:
 *    - Los componentes hermanos NO se comunican directamente
 *    - Deben hacerlo a través del PADRE común
 *    - Ejemplo: InputArea → Home → MessageBox
 *
 * ═══════════════════════════════════════════════════════════════════════
 */
export default function Home() {
  // ==================== ESTADO (STATE) ====================
  // El ESTADO vive en el componente PADRE porque:
  // 1. Varios componentes hijos necesitan acceder a los mismos datos
  // 2. El padre es quien coordina la comunicación entre hermanos

  // Estado 1: Almacena todos los mensajes del chat
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'bot'}[]>([]);

  // Estado 2: Indica si el bot está escribiendo
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Estado 3: Controla si el sidebar está abierto o cerrado
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // ==================== DATOS ESTÁTICOS ====================
  // Respuestas predefinidas del bot (simulación)
  const botResponses = [
    "Interesante perspectiva sobre ese tema...",
    "Entiendo tu punto de vista perfectamente.",
    "¿Podrías contarme más detalles sobre eso?",
    "Es una buena pregunta, déjame pensar...",
    "Fascinante. Nunca lo había visto desde ese ángulo.",
    "Eso me recuerda a algo que leí recientemente...",
    "¡Qué curioso! Es un tema muy complejo.",
    "Me parece una observación muy acertada.",
    "Entiendo. ¿Y cómo te sientes al respecto?",
    "Es un punto muy válido el que mencionas."
  ];

  // ==================== FUNCIONES AUXILIARES ====================
  // Función para obtener una respuesta aleatoria del bot
  const getRandomBotResponse = (): string => {
    const randomIndex = Math.floor(Math.random() * botResponses.length);
    return botResponses[randomIndex];
  };

  // Función para agregar un mensaje al array de mensajes
  const addMessage = (text: string, sender: 'user' | 'bot') => {
    console.log("Mensaje agregado en Home:", text, "de:", sender);
    // setMessages actualiza el estado agregando el nuevo mensaje
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
  };

  // ==================== FUNCIÓN CALLBACK ====================
  /**
   * handleSendMessage - Esta es una función CALLBACK
   *
   * ¿Qué es un callback?
   * - Es una función que se pasa de PADRE a HIJO como prop
   * - Permite que el HIJO le "avise" al PADRE cuando algo sucede
   * - El HIJO ejecuta esta función, pero la lógica vive en el PADRE
   *
   * Flujo:
   * 1. Usuario escribe en InputArea (HIJO)
   * 2. InputArea llama a handleSendMessage (función del PADRE)
   * 3. El PADRE actualiza el estado (messages)
   * 4. El cambio en el estado hace que MessageBox (HIJO) se actualice automáticamente
   */
  const handleSendMessage = (text: string) => {
    // Agregar mensaje del usuario
    addMessage(text, 'user');

    // Activar indicador de typing
    setIsTyping(true);

    // Simular respuesta del bot después de un delay
    setTimeout(() => {
      setIsTyping(false); // Desactivar indicador
      const botResponse = getRandomBotResponse();
      addMessage(botResponse, 'bot');
    }, 1000 + Math.random() * 1500); // Entre 1 y 2.5 segundos
  };

  // ==================== RENDERIZADO ====================
  return (
    <div className="bg-black text-gray-100 min-h-screen flex flex-col">
        {/* ========== COMPONENTE HIJO: Sidebar ========== */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ========== COMPONENTE HIJO 1: Header ========== */}
        {/*
          Header recibe la función para abrir el sidebar.
        */}
        <Header onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl pt-24">
            {/* ========== COMPONENTE HIJO 2: MessageBox ========== */}
            {/*
              MessageBox recibe PROPS del padre:
              - messages: Array de mensajes (viene del estado del padre)
              - isTyping: Boolean que indica si el bot está escribiendo

              ¿Qué son las PROPS?
              - Son datos que el PADRE envía al HIJO
              - Son de solo lectura (el hijo NO puede modificarlas)
              - Si el padre actualiza las props, el hijo se re-renderiza automáticamente

              Flujo de datos: PADRE (Home) → HIJO (MessageBox)
            */}
            <MessageBox messages={messages} isTyping={isTyping} />
        </main>

        {/* Input fijo en la parte inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-8">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            {/* ========== COMPONENTE HIJO 3: InputArea ========== */}
            {/*
              InputArea recibe PROPS del padre:
              - onSendMessage: Función callback para enviar mensajes al padre
              - isTyping: Boolean para deshabilitar el input cuando el bot escribe

              ¿Cómo funciona el callback?
              1. Usuario escribe y presiona enviar en InputArea (HIJO)
              2. InputArea ejecuta onSendMessage(texto)
              3. Esto ejecuta handleSendMessage en el PADRE
              4. El PADRE actualiza el estado (messages)
              5. MessageBox (otro HIJO) recibe el nuevo estado automáticamente

              Este patrón se llama "Levantar el estado" (Lifting State Up):
              - El estado vive en el PADRE
              - Los HIJOS se comunican a través del PADRE
              - Los HIJOS nunca se comunican directamente entre sí
            */}
            <InputArea onSendMessage={handleSendMessage} isTyping={isTyping} />
          </div>
        </div>
    </div>
  );
}
