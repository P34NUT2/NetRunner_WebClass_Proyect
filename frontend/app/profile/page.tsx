'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaCalendar, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';

export default function Profile() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();

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

  // Formatear fecha de creación
  const createdDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'No disponible';

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
                <div>
                  <p className="text-sm text-gray-400">Nombre completo</p>
                  <p className="text-white font-medium">{user.realName}</p>
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

              {/* Fecha de registro */}
              <div className="flex items-start space-x-3">
                <FaCalendar className="text-red-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Miembro desde</p>
                  <p className="text-white font-medium">{createdDate}</p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="border-t border-gray-800 p-6">
              <button className="w-full bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 text-black font-semibold py-3 rounded-lg transition-all duration-200">
                Editar Perfil (Próximamente)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
