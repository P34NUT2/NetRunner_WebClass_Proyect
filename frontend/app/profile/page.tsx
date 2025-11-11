'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaShieldAlt, FaArrowLeft, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';

const API_URL = 'http://localhost:3001';

export default function Profile() {
  const router = useRouter();
  const { user, isLoggedIn, loading, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newRealName, setNewRealName] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/login');
    }
  }, [loading, isLoggedIn, router]);

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <div className="bg-black text-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, no mostrar nada (se redirigirá)
  if (!user) {
    return null;
  }

  // Función para activar el modo de edición
  const handleEdit = () => {
    setNewRealName(user.realName);
    setIsEditing(true);
    setError('');
  };

  // Función para guardar los cambios
  const handleSave = async () => {
    // Validaciones
    if (!newRealName.trim()) {
      setError('El nombre completo es requerido');
      return;
    }

    if (newRealName.length > 50) {
      setError('El nombre no puede tener más de 50 caracteres');
      return;
    }

    if (newRealName === user.realName) {
      setIsEditing(false);
      return;
    }

    try {
      setUpdating(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ realName: newRealName })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al actualizar perfil');
      }

      const data = await response.json();

      // Actualizar el usuario en el contexto
      setUser(data.user);

      // Salir del modo de edición
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error al actualizar perfil:', err);
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setUpdating(false);
    }
  };

  // Función para cancelar la edición
  const handleCancel = () => {
    setIsEditing(false);
    setNewRealName('');
    setError('');
  };

  return (
    <div className="bg-black text-gray-100 min-h-screen">
      {/* Header */}
      <Header />

      {/* Contenido del perfil */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Botón de volver */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-red-500 active:text-red-600 transition-all duration-150 mb-6"
          >
            <FaArrowLeft />
            <span>Volver al chat</span>
          </Link>

          {/* Card del perfil */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            {/* Header del perfil */}
            <div className="bg-gradient-to-r from-red-500/20 to-red-900/20 border-b border-gray-800 p-6">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-3xl">
                  {user.profileImg ? (
                    <img
                      src={user.profileImg}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-black" />
                  )}
                </div>

                {/* Info básica */}
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.realName}</h1>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
              </div>
            </div>

            {/* Detalles del perfil */}
            <div className="p-6 space-y-4">
              {/* Username */}
              <div className="flex items-start space-x-3">
                <FaUser className="text-red-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Nombre de usuario</p>
                  <p className="text-white font-medium">{user.username}</p>
                </div>
              </div>

              {/* Nombre real */}
              <div className="flex items-start space-x-3">
                <FaEnvelope className="text-red-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Nombre completo</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={newRealName}
                      onChange={(e) => setNewRealName(e.target.value)}
                      className="mt-1 w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="Ingresa tu nombre completo"
                      maxLength={50}
                    />
                  ) : (
                    <p className="text-white font-medium">{user.realName}</p>
                  )}
                </div>
              </div>

              {/* Rol */}
              <div className="flex items-start space-x-3">
                <FaShieldAlt className="text-red-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Rol</p>
                  <p className="text-white font-medium">
                    {user.role === 'admin' ? (
                      <span className="px-2 py-1 bg-red-500 text-black text-xs font-semibold rounded">
                        Administrador
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-700 text-white text-xs font-semibold rounded">
                        Usuario
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="border-t border-gray-800 p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={updating}
                    className="flex-1 bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-black font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaSave />
                    <span>{updating ? 'Guardando...' : 'Guardar Cambios'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={updating}
                    className="px-6 bg-gray-700 hover:bg-gray-600 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaTimes />
                    <span>Cancelar</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="w-full bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 text-black font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <FaEdit />
                  <span>Editar Perfil</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
