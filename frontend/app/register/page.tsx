'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaRobot, FaUser, FaLock, FaIdCard } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth(); // Obtenemos la función de register del contexto

  // Estado del formulario
  const [formData, setFormData] = useState({
    username: '',
    realName: '',
    password: '',
    confirmPassword: ''
  });

  // Estados para mensajes y loading
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Actualiza los valores del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError('');
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validaciones del frontend
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Llamar a la función register del contexto (hace fetch al backend)
      await register(formData.username, formData.realName, formData.password);

      // Si el registro es exitoso
      setSuccess('¡Cuenta creada exitosamente! Redirigiendo...');

      // Redirigir al chat después de 1 segundo
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (err: any) {
      // Mostrar el error que devuelve el backend
      setError(err.message || 'Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-gray-100 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <FaRobot className="text-black" />
            </div>
            <span className="text-red-500">NetRunner<span className="text-white">AI</span></span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Crear Cuenta</h2>
            <p className="text-gray-400 mt-2">Únete a NetRunner</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mensajes de error y éxito */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Usuario"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                maxLength={20}
                required
              />
            </div>

            <div className="relative">
              <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="realName"
                placeholder="Nombre completo"
                value={formData.realName}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                maxLength={50}
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 text-black font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando cuenta...
                </span>
              ) : 'Crear Cuenta'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?
              <Link href="/login" className="text-red-500 hover:text-red-400 active:text-red-600 ml-2 font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="text-center mt-4">
            <Link href="/" className="text-gray-500 hover:text-gray-400 active:text-gray-300 text-sm transition-colors">
              ← Volver al chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
