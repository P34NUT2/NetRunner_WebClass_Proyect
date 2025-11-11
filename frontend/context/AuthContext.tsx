'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// ===== CONFIGURACIÓN =====
const API_URL = 'http://localhost:3001';

// ===== TIPOS =====
interface User {
  id: number;
  username: string;
  realName: string;
  role: string;
  createdAt?: string;
  profileImg?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, realName: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// ===== CONTEXTO =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== PROVIDER =====
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Al cargar, revisar si hay usuario guardado
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // ===== FUNCIÓN LOGIN =====
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al iniciar sesión');
      }

      const data = await response.json();

      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Actualizar estado
      setUser(data.user);
    } catch (error: any) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  // ===== FUNCIÓN REGISTER =====
  const register = async (username: string, realName: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, realName, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al registrarse');
      }

      const data = await response.json();

      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Actualizar estado
      setUser(data.user);
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  // ===== FUNCIÓN LOGOUT =====
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ===== FUNCIÓN ACTUALIZAR USUARIO =====
  const updateUser = (updatedUser: User) => {
    // Actualizar en localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    // Actualizar en estado
    setUser(updatedUser);
  };

  const value = {
    user,
    isLoggedIn: user !== null,
    loading,
    login,
    register,
    logout,
    setUser: updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ===== HOOK =====
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
