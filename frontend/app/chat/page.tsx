'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const {
    chats,
    currentChatId,
    messages,
    loading,
    loadChats,
    createChat,
    loadMessages,
    sendMessage
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [chatTitle, setChatTitle] = useState('');

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // Cargar chats al montar
  useEffect(() => {
    if (isLoggedIn) {
      loadChats();
    }
  }, [isLoggedIn]);

  // Crear nuevo chat
  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatTitle.trim()) return;

    try {
      await createChat(chatTitle);
      setChatTitle('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Enviar mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChatId) return;

    try {
      await sendMessage(currentChatId, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Chat con Ollama 🤖</h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Sidebar - Lista de chats */}
        <div className="col-span-1 bg-gray-900 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Tus Chats</h2>

          {/* Crear nuevo chat */}
          <form onSubmit={handleCreateChat} className="mb-4">
            <input
              type="text"
              value={chatTitle}
              onChange={(e) => setChatTitle(e.target.value)}
              placeholder="Título del chat..."
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 mb-2"
            />
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-black font-semibold py-2 rounded"
            >
              + Nuevo Chat
            </button>
          </form>

          {/* Lista de chats */}
          <div className="space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => loadMessages(chat.id)}
                className={`w-full text-left p-3 rounded ${
                  currentChatId === chat.id
                    ? 'bg-red-500 text-black'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <div className="font-semibold">{chat.title}</div>
                <div className="text-xs opacity-70">
                  {chat._count?.messages || 0} mensajes
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Área de chat */}
        <div className="col-span-2 bg-gray-900 rounded-lg p-4 flex flex-col h-[600px]">
          {currentChatId ? (
            <>
              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded ${
                      msg.role === 'user'
                        ? 'bg-blue-900 ml-auto max-w-[80%]'
                        : 'bg-gray-800 mr-auto max-w-[80%]'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">
                      {msg.role === 'user' ? '👤 Tú' : '🤖 Ollama'}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                ))}

                {loading && (
                  <div className="bg-gray-800 p-3 rounded mr-auto max-w-[80%]">
                    <div className="text-xs opacity-70 mb-1">🤖 Ollama</div>
                    <div className="animate-pulse">Pensando...</div>
                  </div>
                )}
              </div>

              {/* Input de mensaje */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-black font-semibold px-6 py-2 rounded disabled:opacity-50"
                >
                  Enviar
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Selecciona o crea un chat para empezar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
