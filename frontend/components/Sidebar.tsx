'use client';

import React from 'react';
import { FaPlus, FaComments, FaTrash, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Historial de chats de ejemplo (después lo conectarás con el backend)
  const chats = [
    { id: 1, title: 'Análisis de malware', lastMessage: 'Hace 2 horas', unread: 0 },
    { id: 2, title: 'Exploits de Linux', lastMessage: 'Ayer', unread: 2 },
    { id: 3, title: 'Buffer overflow en C', lastMessage: 'Hace 3 días', unread: 0 },
    { id: 4, title: 'SQL Injection basics', lastMessage: 'Hace 1 semana', unread: 0 },
  ];

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
          <button className="w-full bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 text-black font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
            <FaPlus />
            <span>Nuevo Chat</span>
          </button>
        </div>

        {/* Contenido del Sidebar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
          {isLoggedIn ? (
            // Si está logueado, mostrar historial
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Recientes</p>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className="w-full text-left p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 hover:scale-102 active:scale-98 border border-gray-700/50 hover:border-red-500/30 transition-all duration-200 group cursor-pointer"
                  onClick={() => {
                    // Aquí irá la lógica para abrir el chat
                    console.log('Abrir chat', chat.id);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <FaComments className="text-red-500 text-sm flex-shrink-0" />
                        <h3 className="text-sm font-medium text-white truncate group-hover:text-red-500 transition-colors">
                          {chat.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-red-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                        {chat.unread}
                      </span>
                    )}
                  </div>

                  {/* Botón de eliminar (aparece al hover) */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Aquí irá la lógica para eliminar
                        console.log('Eliminar chat', chat.id);
                      }}
                      className="text-xs text-gray-500 hover:text-red-500 transition-colors flex items-center space-x-1"
                    >
                      <FaTrash size={10} />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
            {isLoggedIn ? `${chats.length} conversaciones` : 'Sin historial guardado'}
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
