'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const {
    chats,
    currentChatId,
    messages,
    loading,
    loadChats,
    createChat,
    loadMessages,
    sendMessage,
    resetChat
  } = useChat();

  // Estado 2: Controla si el sidebar está abierto o cerrado
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Ref para saber si es la primera carga o si acabamos de iniciar sesión
  const prevLoggedIn = useRef<boolean>(false);

  // ==================== DETECTAR LOGIN/LOGOUT ====================
  useEffect(() => {
    const handleAuthChange = async () => {
      // Caso 1: Usuario acaba de hacer LOGOUT (true -> false)
      if (prevLoggedIn.current && !isLoggedIn) {
        console.log('🔴 Logout detectado - Limpiando chats');
        resetChat();
        router.push('/login');
        prevLoggedIn.current = false;
        return;
      }

      // Caso 2: Usuario acaba de hacer LOGIN (false -> true)
      if (!prevLoggedIn.current && isLoggedIn) {
        console.log('🟢 Login detectado - Creando nuevo chat');
        try {
          // Crear un nuevo chat automáticamente
          await createChat('Nueva Conversación');
        } catch (error) {
          console.error('Error al crear chat inicial:', error);
        }
        prevLoggedIn.current = true;
        return;
      }

      // Caso 3: No está logueado (redirigir)
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }

      // Actualizar ref
      prevLoggedIn.current = isLoggedIn;
    };

    handleAuthChange();
  }, [isLoggedIn]);

  // Convertir mensajes del ChatContext al formato que espera MessageBox
  const formattedMessages = messages.map(msg => ({
    text: msg.content,
    sender: msg.role === 'user' ? 'user' as const : 'bot' as const
  }));

  // ==================== FUNCIÓN CALLBACK ====================
  /**
   * handleSendMessage - CONECTADO A OLLAMA
   *
   * ANTES: Usaba respuestas fake (botResponses)
   * AHORA: Envía el mensaje a Ollama (llama3.2) vía backend
   *
   * Flujo:
   * 1. Usuario escribe en InputArea (HIJO)
   * 2. InputArea llama a handleSendMessage
   * 3. Se envía a ChatContext.sendMessage()
   * 4. ChatContext hace fetch al backend
   * 5. Backend envía a Ollama
   * 6. Ollama responde con llama3.2
   * 7. Se actualiza automáticamente en MessageBox
   */
  const handleSendMessage = async (text: string) => {
    if (!currentChatId) {
      console.error('No hay chat seleccionado');
      return;
    }

    try {
      // Enviar mensaje a Ollama (backend hace el trabajo)
      await sendMessage(currentChatId, text);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  // ==================== RENDERIZADO ====================
  // Si no está autenticado, no mostrar nada (se redirige a login)
  if (!isLoggedIn) {
    return null;
  }

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
              MessageBox AHORA recibe mensajes REALES de Ollama:
              - formattedMessages: Mensajes convertidos del ChatContext
              - loading: Indica si Ollama está procesando la respuesta

              Flujo: ChatContext → formattedMessages → MessageBox
            */}
            <MessageBox messages={formattedMessages} isTyping={loading} />
        </main>

        {/* Input fijo en la parte inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-8">
          <div className="container mx-auto px-4 py-4 max-w-4xl">
            {/* ========== COMPONENTE HIJO 3: InputArea ========== */}
            {/*
              InputArea AHORA conectado a Ollama:
              - onSendMessage: Envía a ChatContext → Backend → Ollama
              - loading: Se deshabilita mientras Ollama procesa

              Flujo REAL:
              1. Usuario escribe en InputArea
              2. handleSendMessage() se ejecuta
              3. ChatContext.sendMessage() → Backend
              4. Backend → Ollama (llama3.2)
              5. Ollama responde
              6. Backend guarda en PostgreSQL
              7. Frontend actualiza mensajes automáticamente
            */}
            <InputArea onSendMessage={handleSendMessage} isTyping={loading} />
          </div>
        </div>
    </div>
  );
}
