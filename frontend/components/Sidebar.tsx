'use client';

import React from 'react';
import { FaPlus, FaComments, FaTrash, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const {
    chats,
    currentChatId,
    createChat,
    loadMessages,
    deleteChat,
    loading
  } = useChat();

  // Función para crear un nuevo chat
  const handleCreateNewChat = async () => {
    try {
      const newChat = await createChat('Nueva Conversación');
      console.log('✅ Nuevo chat creado:', newChat.title);
      onClose(); // Cerrar sidebar después de crear
    } catch (error) {
      console.error('❌ Error al crear chat:', error);
      alert('Error al crear el chat. Intenta de nuevo.');
    }
  };

  // Función para cambiar de chat
  const handleSelectChat = async (chatId: number) => {
    try {
      await loadMessages(chatId);
      onClose(); // Cerrar sidebar al seleccionar chat
      console.log('✅ Chat seleccionado:', chatId);
    } catch (error) {
      console.error('❌ Error al cargar chat:', error);
    }
  };

  // Función para eliminar un chat
  const handleDeleteChat = async (chatId: number, e: React.MouseEvent, chatTitle: string) => {
    e.stopPropagation(); // Evitar que se seleccione el chat al eliminar

    const isCurrentChat = chatId === currentChatId;
    const confirmMessage = isCurrentChat
      ? `¿Eliminar "${chatTitle}"?\n\nEste es tu chat actual. Se cargará otro automáticamente.`
      : `¿Eliminar "${chatTitle}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteChat(chatId);
      console.log('✅ Chat eliminado:', chatId);
    } catch (error) {
      console.error('❌ Error al eliminar chat:', error);
      alert('Error al eliminar el chat. Intenta de nuevo.');
    }
  };

  // Formatear fecha relativa
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const chatDate = new Date(date);
    const diffInMs = now.getTime() - chatDate.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Ahora';
    if (diffInMins < 60) return `Hace ${diffInMins} min`;
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    return chatDate.toLocaleDateString();
  };

  return (
    <>
      {/* Overlay oscuro cuando el sidebar está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Historial de Chats</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-300"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Botón Nuevo Chat */}
        <div className="p-4">
          <button
            onClick={handleCreateNewChat}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-black font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FaPlus />
            <span>{loading ? 'Creando...' : 'Nuevo Chat'}</span>
          </button>
        </div>

        {/* Contenido del Sidebar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
          {isLoggedIn ? (
            // Si está logueado, mostrar historial
            chats.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-3">
                  Recientes ({chats.length})
                </p>
                {chats.map((chat) => {
                  const isActive = chat.id === currentChatId;
                  return (
                    <div
                      key={chat.id}
                      className={`w-full text-left p-3 rounded-lg hover:scale-102 active:scale-98 border transition-all duration-200 group cursor-pointer ${
                        isActive
                          ? 'bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/20'
                          : 'bg-gray-800/50 hover:bg-gray-800 border-gray-700/50 hover:border-red-500/30'
                      }`}
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <FaComments
                              className={`text-sm flex-shrink-0 ${
                                isActive ? 'text-red-500' : 'text-red-500/70'
                              }`}
                            />
                            <h3
                              className={`text-sm font-medium truncate transition-colors ${
                                isActive
                                  ? 'text-red-400'
                                  : 'text-white group-hover:text-red-500'
                              }`}
                            >
                              {chat.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {getRelativeTime(chat.updatedAt)}
                            {chat._count && chat._count.messages > 0 && (
                              <> · {chat._count.messages} mensajes</>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Botón de eliminar (aparece al hover) */}
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e, chat.title)}
                          disabled={loading}
                          className="text-xs text-gray-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                        >
                          <FaTrash size={10} />
                          <span>{loading ? 'Eliminando...' : 'Eliminar'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Si no hay chats, mostrar mensaje
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <FaComments className="text-gray-600 text-5xl mb-4" />
                <h3 className="text-white font-semibold mb-2">Sin conversaciones</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Crea un nuevo chat para comenzar a conversar con NetRunner AI
                </p>
              </div>
            )
          ) : (
            // Si NO está logueado, mostrar mensaje
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <FaComments className="text-gray-600 text-5xl mb-4" />
              <h3 className="text-white font-semibold mb-2">Historial de Chats</h3>
              <p className="text-gray-400 text-sm mb-4">
                Inicia sesión para guardar y acceder a tu historial de conversaciones
              </p>
              <button
                onClick={() => {
                  onClose();
                  router.push('/login');
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 hover:scale-105 active:scale-95 text-black font-medium rounded-lg transition-all duration-200"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            {isLoggedIn
              ? chats.length === 0
                ? 'Sin conversaciones guardadas'
                : `${chats.length} conversación${chats.length === 1 ? '' : 'es'}`
              : 'Sin historial guardado'}
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
