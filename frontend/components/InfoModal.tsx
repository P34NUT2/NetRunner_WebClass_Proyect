'use client';

import React from 'react';
import { FaTimes, FaRobot, FaTrash } from 'react-icons/fa';
import { useChat } from '@/context/ChatContext';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const { chats, deleteAllChats, loading } = useChat();

  const handleDeleteAll = async () => {
    if (!confirm(`¿Eliminar TODOS los chats (${chats.length})?\n\n⚠️ Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await deleteAllChats();
      onClose(); // Cerrar modal después de eliminar
    } catch (error) {
      console.error('Error al eliminar todos los chats:', error);
      alert('Error al eliminar los chats. Intenta de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-red-500/30 rounded-xl max-w-md w-full shadow-2xl shadow-red-500/20 animate-fadeIn">
          {/* Header */}
          <div className="bg-gray-900 border-b border-red-500/30 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Configuración</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-300"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {chats.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Gestión de Chats</h3>
                <button
                  onClick={handleDeleteAll}
                  disabled={loading}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500 text-red-500 font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                >
                  <FaTrash size={16} />
                  <span>{loading ? 'Eliminando...' : `Eliminar Todos los Chats (${chats.length})`}</span>
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Esta acción eliminará todos tus chats permanentemente
                </p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400">No hay chats para gestionar</p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="bg-gray-900 border-t border-red-500/30 p-3">
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoModal;
