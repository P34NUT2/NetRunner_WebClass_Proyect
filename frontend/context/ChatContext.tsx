'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// ===== CONFIGURACIÓN =====
const API_URL = 'http://localhost:3001';

// ===== HELPERS PARA MODO INVITADO (localStorage) =====
const getGuestChats = (): Chat[] => {
  if (typeof window === 'undefined') return [];
  const chats = localStorage.getItem('guestChats');
  return chats ? JSON.parse(chats) : [];
};

const saveGuestChats = (chats: Chat[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('guestChats', JSON.stringify(chats));
};

const getGuestMessages = (chatId: number): Message[] => {
  if (typeof window === 'undefined') return [];
  const messages = localStorage.getItem(`guestMessages_${chatId}`);
  return messages ? JSON.parse(messages) : [];
};

const saveGuestMessages = (chatId: number, messages: Message[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`guestMessages_${chatId}`, JSON.stringify(messages));
};

// ===== TIPOS =====
interface Message {
  id: number;
  chatId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface Chat {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

interface ChatContextType {
  chats: Chat[];
  currentChatId: number | null;
  messages: Message[];
  loading: boolean;
  // Funciones
  loadChats: () => Promise<void>;
  createChat: (title: string) => Promise<Chat>;
  loadMessages: (chatId: number) => Promise<void>;
  sendMessage: (chatId: number, content: string) => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;
  deleteAllChats: () => Promise<void>;
  setCurrentChatId: (chatId: number | null) => void;
  resetChat: () => void;
}

// ===== CONTEXTO =====
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ===== PROVIDER =====
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatIdState] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Wrapper para setCurrentChatId que también guarda en localStorage
  const setCurrentChatId = (chatId: number | null) => {
    setCurrentChatIdState(chatId);
    if (chatId !== null) {
      localStorage.setItem('currentChatId', chatId.toString());
    } else {
      localStorage.removeItem('currentChatId');
    }
  };

  // Restaurar currentChatId desde localStorage al iniciar
  useEffect(() => {
    const savedChatId = localStorage.getItem('currentChatId');
    if (savedChatId) {
      setCurrentChatIdState(parseInt(savedChatId));
    }
  }, []);

  // Cargar chats de invitado al iniciar si no está logueado
  useEffect(() => {
    if (!isLoggedIn) {
      const guestChats = getGuestChats();
      setChats(guestChats);
    }
  }, [isLoggedIn]);

  // ===== OBTENER TOKEN PARA LAS PETICIONES =====
  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  // ===== CARGAR CHATS DEL USUARIO =====
  const loadChats = async () => {
    try {
      setLoading(true);

      // MODO INVITADO: Cargar desde localStorage
      if (!isLoggedIn) {
        const guestChats = getGuestChats();
        setChats(guestChats);
        return;
      }

      // MODO AUTENTICADO: Cargar desde API
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al cargar chats');
      }

      const data = await response.json();
      setChats(data.chats || []);
    } catch (error: any) {
      console.error('Error cargando chats:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===== CREAR NUEVO CHAT =====
  const createChat = async (title: string): Promise<Chat> => {
    try {
      setLoading(true);

      // MODO INVITADO: Crear en localStorage
      if (!isLoggedIn) {
        const newChat: Chat = {
          id: Date.now(), // ID temporal basado en timestamp
          title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const currentChats = getGuestChats();
        const updatedChats = [newChat, ...currentChats];
        saveGuestChats(updatedChats);
        setChats(updatedChats);

        // Limpiar mensajes y establecer como chat actual
        setMessages([]);
        setCurrentChatId(newChat.id);

        return newChat;
      }

      // MODO AUTENTICADO: Crear en API
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error('Error al crear chat');
      }

      const data = await response.json();
      const newChat = data.chat;

      // Agregar a la lista
      setChats(prev => [newChat, ...prev]);

      // Limpiar mensajes y establecer como chat actual
      setMessages([]);
      setCurrentChatId(newChat.id);

      return newChat;
    } catch (error: any) {
      console.error('Error creando chat:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===== CARGAR MENSAJES DE UN CHAT =====
  const loadMessages = async (chatId: number) => {
    try {
      setLoading(true);

      // MODO INVITADO: Cargar desde localStorage
      if (!isLoggedIn) {
        const guestMessages = getGuestMessages(chatId);
        setMessages(guestMessages);
        setCurrentChatId(chatId);
        return;
      }

      // MODO AUTENTICADO: Cargar desde API
      const response = await fetch(`${API_URL}/api/chat/${chatId}/messages`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al cargar mensajes');
      }

      const data = await response.json();
      setMessages(data.messages || []);
      setCurrentChatId(chatId);
    } catch (error: any) {
      console.error('Error cargando mensajes:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===== ENVIAR MENSAJE Y RECIBIR RESPUESTA DE OLLAMA =====
  const sendMessage = async (chatId: number, content: string) => {
    // Crear mensaje temporal del usuario para mostrar inmediatamente
    const tempUserMessage: Message = {
      id: Date.now(), // ID temporal
      chatId,
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Mostrar el mensaje del usuario INMEDIATAMENTE
      setMessages(prev => [...prev, tempUserMessage]);

      // 2. Activar loading para la respuesta de la IA
      setLoading(true);

      // MODO INVITADO: Guardar en localStorage y llamar al backend (SIN streaming)
      if (!isLoggedIn) {
        // Guardar mensaje del usuario
        const currentMessages = getGuestMessages(chatId);
        const userMsg = { ...tempUserMessage, id: Date.now() };
        const updatedMessagesWithUser = [...currentMessages, userMsg];
        saveGuestMessages(chatId, updatedMessagesWithUser);

        // Llamar al backend (endpoint público sin streaming)
        try {
          const response = await fetch(`${API_URL}/api/chat/guest/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: updatedMessagesWithUser.slice(-10).map(m => ({
                role: m.role,
                content: m.content
              }))
            })
          });

          if (!response.ok) {
            throw new Error('Error al conectar con el servidor');
          }

          const data = await response.json();

          // Guardar respuesta de la IA
          const assistantMessage: Message = {
            id: Date.now() + 1,
            chatId,
            role: 'assistant',
            content: data.message,
            createdAt: new Date().toISOString()
          };

          const finalMessages = [...updatedMessagesWithUser, assistantMessage];
          saveGuestMessages(chatId, finalMessages);
          setMessages(finalMessages);

          // Actualizar título si es el primer mensaje
          const currentChats = getGuestChats();
          const chatIndex = currentChats.findIndex(c => c.id === chatId);
          if (chatIndex !== -1 && finalMessages.length === 2) {
            const newTitle = content.length > 50 ? content.substring(0, 50) + '...' : content;
            currentChats[chatIndex].title = newTitle;
            currentChats[chatIndex].updatedAt = new Date().toISOString();
            saveGuestChats(currentChats);
            setChats(currentChats);
          }

        } catch (error: any) {
          console.error('Error en modo invitado:', error);
          // Si falla, dar una respuesta de error
          const errorMessage: Message = {
            id: Date.now() + 1,
            chatId,
            role: 'assistant',
            content: '⚠️ No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.',
            createdAt: new Date().toISOString()
          };
          const messagesWithError = [...updatedMessagesWithUser, errorMessage];
          saveGuestMessages(chatId, messagesWithError);
          setMessages(messagesWithError);
        } finally {
          // Desactivar loading cuando termine (éxito o error)
          setLoading(false);
        }

        return;
      }

      // MODO AUTENTICADO: Enviar al backend con STREAMING
      const token = localStorage.getItem('token');

      // Crear mensaje temporal de la IA que se irá llenando
      const tempAIMessage: Message = {
        id: Date.now() + 1,
        chatId,
        role: 'assistant',
        content: '', // Se llenará con streaming
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, tempAIMessage]);

      // Usar fetch con streaming
      const response = await fetch(`${API_URL}/api/chat/${chatId}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Error al enviar mensaje');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No se pudo obtener el stream');
      }

      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);

              if (data.chunk) {
                // Actualizar el mensaje de la IA con el nuevo chunk
                fullResponse += data.chunk;
                setMessages(prev => prev.map(msg =>
                  msg.id === tempAIMessage.id
                    ? { ...msg, content: fullResponse }
                    : msg
                ));
              }

              if (data.done) {
                // Streaming terminado, actualizar con datos finales
                if (data.assistantMessage) {
                  setMessages(prev => prev.map(msg =>
                    msg.id === tempAIMessage.id
                      ? { ...msg, id: data.assistantMessage.id, content: data.assistantMessage.content }
                      : msg
                  ));
                }

                // Actualizar el chat en la lista
                if (data.chat) {
                  setChats(prev => prev.map(chat =>
                    chat.id === data.chat.id ? data.chat : chat
                  ));
                }
              }

              if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.error('Error parseando chunk:', parseError);
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Error enviando mensaje:', error);
      // Si hay error, remover el mensaje temporal del usuario
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===== ELIMINAR CHAT =====
  const deleteChat = async (chatId: number) => {
    const wasCurrentChat = currentChatId === chatId;

    try {
      setLoading(true);

      // MODO INVITADO: Eliminar de localStorage
      if (!isLoggedIn) {
        const currentChats = getGuestChats();
        const updatedChats = currentChats.filter(chat => chat.id !== chatId);
        saveGuestChats(updatedChats);
        setChats(updatedChats);

        // Eliminar mensajes del chat
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`guestMessages_${chatId}`);
        }

        // Si es el chat actual, cargar otro o crear uno nuevo
        if (wasCurrentChat) {
          setMessages([]);

          if (updatedChats.length > 0) {
            await loadMessages(updatedChats[0].id);
          } else {
            setCurrentChatId(null);
            await createChat('Nueva Conversación');
          }
        }

        return;
      }

      // MODO AUTENTICADO: Eliminar desde API
      const response = await fetch(`${API_URL}/api/chat/${chatId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar chat');
      }

      // Remover de la lista
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);

      // Si es el chat actual, cargar otro o crear uno nuevo
      if (wasCurrentChat) {
        setMessages([]);

        if (updatedChats.length > 0) {
          // Cargar el primer chat disponible
          await loadMessages(updatedChats[0].id);
        } else {
          // No hay más chats, crear uno nuevo
          setCurrentChatId(null);
          await createChat('Nueva Conversación');
        }
      }

    } catch (error: any) {
      console.error('Error eliminando chat:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===== ELIMINAR TODOS LOS CHATS =====
  const deleteAllChats = async () => {
    try {
      setLoading(true);

      // MODO INVITADO: Eliminar todo de localStorage
      if (!isLoggedIn) {
        const currentChats = getGuestChats();

        // Eliminar mensajes de cada chat
        currentChats.forEach(chat => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(`guestMessages_${chat.id}`);
          }
        });

        // Eliminar lista de chats
        if (typeof window !== 'undefined') {
          localStorage.removeItem('guestChats');
        }

        // Limpiar todo
        setChats([]);
        setCurrentChatId(null);
        setMessages([]);

        // Crear un nuevo chat automáticamente
        await createChat('Nueva Conversación');
        return;
      }

      // MODO AUTENTICADO: Eliminar desde API
      const response = await fetch(`${API_URL}/api/chat/all`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar todos los chats');
      }

      // Limpiar todo
      setChats([]);
      setCurrentChatId(null);
      setMessages([]);

      // Crear un nuevo chat automáticamente
      await createChat('Nueva Conversación');

    } catch (error: any) {
      console.error('Error eliminando todos los chats:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ===== RESETEAR CHAT (Para logout) =====
  const resetChat = () => {
    setChats([]);
    setCurrentChatId(null);
    setMessages([]);
    setLoading(false);
    localStorage.removeItem('currentChatId');
  };

  const value = {
    chats,
    currentChatId,
    messages,
    loading,
    loadChats,
    createChat,
    loadMessages,
    sendMessage,
    deleteChat,
    deleteAllChats,
    setCurrentChatId,
    resetChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// ===== HOOK =====
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat debe usarse dentro de ChatProvider');
  }
  return context;
};
