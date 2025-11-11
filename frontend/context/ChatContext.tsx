'use client';

import React, { createContext, useContext, useState } from 'react';

// ===== CONFIGURACIÓN =====
const API_URL = 'http://localhost:3001';

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
  setCurrentChatId: (chatId: number | null) => void;
  resetChat: () => void;
}

// ===== CONTEXTO =====
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ===== PROVIDER =====
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

      // 3. Enviar al backend y esperar respuesta de Ollama
      const response = await fetch(`${API_URL}/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Error al enviar mensaje');
      }

      const data = await response.json();

      // 4. Agregar SOLO el mensaje del asistente (el del usuario ya está)
      setMessages(prev => [
        ...prev,
        data.assistantMessage
      ]);

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
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/chat/${chatId}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar chat');
      }

      // Remover de la lista
      setChats(prev => prev.filter(chat => chat.id !== chatId));

      // Si es el chat actual, limpiar
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }

    } catch (error: any) {
      console.error('Error eliminando chat:', error);
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
