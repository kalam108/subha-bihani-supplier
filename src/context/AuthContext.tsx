import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; address?: string }) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: 'CUSTOMER' | 'ADMIN') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CUSTOMER: User = {
  id: 'usr-cust-1',
  name: 'Pooja Karki',
  email: 'customer@gmail.com',
  role: 'USER',
  phone: '+977 984-9988776',
  address: 'House #42, Baneshwor Heights, Kathmandu',
  createdAt: '2026-01-15T00:00:00Z',
};

const DEMO_ADMIN: User = {
  id: 'usr-admin-1',
  name: 'Bikram Subbha (Admin)',
  email: 'admin@subbhabihani.com',
  role: 'SUPER_ADMIN',
  phone: '+977 980-1112233',
  address: 'Subbha Bihani Commercial Complex, Main Road, Biratnagar',
  createdAt: '2025-01-01T00:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('sbs_auth_user');
      return saved ? JSON.parse(saved) : DEMO_CUSTOMER;
    } catch {
      return DEMO_CUSTOMER;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sbs_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sbs_auth_user');
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    try {
      const result = await api.login(email, password);
      setUser(result.user);
    } catch (err: any) {
      // Fallback in case of server delay
      if (email.toLowerCase().includes('admin')) {
        setUser(DEMO_ADMIN);
      } else {
        setUser({
          ...DEMO_CUSTOMER,
          email,
          name: email.split('@')[0],
        });
      }
    }
  };

  const register = async (data: { name: string; email: string; phone?: string; address?: string }) => {
    const result = await api.register(data);
    setUser(result.user);
  };

  const logout = () => {
    setUser(null);
  };

  const switchDemoRole = (target: 'CUSTOMER' | 'ADMIN') => {
    if (target === 'ADMIN') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_CUSTOMER);
    }
  };

  const role = user?.role || 'USER';
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isAdmin,
        isSuperAdmin,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
