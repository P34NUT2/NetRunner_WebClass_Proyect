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
        <div className="bg-gray-900 border border-red-500/30 rounded-xl max-w-lg w-full shadow-2xl shadow-red-500/20 animate-fadeIn">
          {/* Header */}
          <div className="bg-gray-900 border-b border-red-500/30 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <FaRobot className="text-black text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">NetRunner AI</h2>
                <p className="text-sm text-gray-400">Configuración</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-300"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Descripción */}
            <section>
              <h3 className="text-lg font-semibold text-red-500 mb-3 flex items-center space-x-2">
                <FaRobot />
                <span>Acerca de NetRunner AI</span>
              </h3>
              <p className="text-gray-300 leading-relaxed">
                NetRunner AI es un asistente inteligente especializado en ciberseguridad ofensiva,
                pentesting y análisis de vulnerabilidades. Utiliza modelos de lenguaje avanzados
                para proporcionar respuestas técnicas y detalladas sobre hacking ético y CTF.
              </p>
            </section>

            {/* Advertencia */}
            <section className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-red-500 font-semibold mb-2">⚠️ Advertencia Ética</h3>
              <p className="text-gray-300 text-sm">
                NetRunner AI está diseñado exclusivamente para propósitos educativos, investigación
                de seguridad y hacking ético autorizado. El uso de técnicas de pentesting sin
                autorización explícita es ilegal.
              </p>
            </section>

            {/* Botón Eliminar Todos los Chats */}
            {chats.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-red-500 mb-3">Gestión de Chats</h3>
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
              </section>
            )}
          </div>

          {/* Close Button */}
          <div className="bg-gray-900 border-t border-red-500/30 p-4">
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
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
