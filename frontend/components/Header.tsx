'use client';

import { FaRobot, FaCog, FaUser, FaSignOutAlt, FaChevronDown, FaBars } from 'react-icons/fa';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onOpenSidebar?: () => void;
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSidebar, onOpenSettings }) => {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth(); // Obtenemos el estado de autenticación
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para el dropdown

  // Función para cerrar sesión
  const handleLogout = () => {
    logout(); // Llamamos a la función logout del contexto
    setDropdownOpen(false); // Cerramos el dropdown
    router.push('/login'); // Redirigimos al login
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-red-500/20 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Lado izquierdo: Hamburger + Logo */}
        <div className="flex items-center space-x-4">
          {/* Botón Hamburger (3 barritas) */}
          <button
            onClick={onOpenSidebar}
            className="text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <FaBars size={20} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <FaRobot className="text-black" />
            </div>
            <h1 className="text-xl font-bold text-red-500">
              NetRunner<span className="text-white">AI</span>
            </h1>
          </Link>
        </div>

        {/* Botones de la derecha */}
        <div className="flex space-x-4 items-center">
          {/* Botón de configuración */}
          <button
            onClick={onOpenSettings}
            className="text-gray-400 hover:text-red-500 active:text-red-600 transition-colors hover:rotate-90 transition-all duration-300"
          >
            <FaCog />
          </button>

          {/* CONDICIONAL: Si el usuario está logueado o no */}
          {isLoggedIn && user ? (
            // ===== USUARIO LOGUEADO =====
            <div className="relative">
              {/* Botón del usuario con dropdown */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-800 border border-red-500/30 text-red-500 rounded hover:bg-red-500/10 active:scale-95 transition-all duration-150"
              >
                <FaUser className="text-sm" />
                <span>{user.username}</span>
                <FaChevronDown className={`text-xs transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                  {/* Info del usuario */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm text-white font-semibold">{user.realName}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                    <p className="text-xs text-red-500 mt-1">Rol: {user.role}</p>
                  </div>

                  {/* Opciones del menú */}
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-500 hover:scale-105 active:bg-gray-700 active:scale-95 transition-all duration-150"
                  >
                    <FaUser className="transition-transform hover:scale-125" />
                    <span>Mi Perfil</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-500 hover:scale-105 active:bg-gray-700 active:scale-95 transition-all duration-150"
                  >
                    <FaSignOutAlt className="transition-transform hover:rotate-12" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            // ===== USUARIO NO LOGUEADO =====
            <div className="flex space-x-2 ml-2">
              <Link
                href="/login"
                className="px-3 py-1 text-sm bg-transparent border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-black hover:scale-110 hover:shadow-md active:scale-95 transition-all duration-200"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-3 py-1 text-sm bg-red-500 text-black rounded hover:bg-red-600 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 active:scale-95 transition-all duration-200 animate-pulse-slow"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
