
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  reputation: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('token');
    if (token) {
      // Mock user data for now
      setUser({
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        reputation: 1250,
        createdAt: '2024-01-15T10:00:00Z'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = {
      id: '1',
      username: 'john_doe',
      email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      reputation: 1250,
      createdAt: '2024-01-15T10:00:00Z'
    };
    localStorage.setItem('token', 'mock-jwt-token');
    setUser(mockUser);
    setLoading(false);
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = {
      id: '1',
      username,
      email,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
      reputation: 0,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('token', 'mock-jwt-token');
    setUser(mockUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
