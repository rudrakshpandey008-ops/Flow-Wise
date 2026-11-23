import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('flowwise_token'));
  const [loading, setLoading] = useState(true);

  const createDemoUser = useCallback(() => {
    const demoUser = {
      id: 'demo-001',
      name: 'Demo User',
      email: 'demo@flowwise.app',
      avatar: null,
      memberSince: '2024-01-15T00:00:00Z',
      preferences: {
        navigationMode: 'balanced',
        transportMode: 'car',
        alertsEnabled: true,
      },
      stats: {
        totalJourneys: 47,
        totalDistance: 342.5,
        avgComfortScore: 4.2,
        reportsSubmitted: 23,
      },
    };
    setUser(demoUser);
    return demoUser;
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user || response.data);
      } catch (error) {
        console.warn('Token validation failed, entering demo mode:', error.message);
        // Demo mode fallback
        const savedUser = localStorage.getItem('flowwise_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            createDemoUser();
          }
        } else {
          createDemoUser();
        }
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, createDemoUser]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('flowwise_token', newToken);
      localStorage.setItem('flowwise_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      // Demo mode fallback
      if (email === 'demo@flowwise.app' && password === 'demo1234') {
        const demoToken = 'demo-token-flowwise-' + Date.now();
        localStorage.setItem('flowwise_token', demoToken);
        setToken(demoToken);
        const demoUser = createDemoUser();
        localStorage.setItem('flowwise_user', JSON.stringify(demoUser));
        return { success: true };
      }

      // If API is completely down, allow any login as demo
      if (!error.response) {
        const demoToken = 'demo-token-flowwise-' + Date.now();
        localStorage.setItem('flowwise_token', demoToken);
        setToken(demoToken);
        const demoUser = {
          id: 'demo-001',
          name: email.split('@')[0] || 'Demo User',
          email: email,
          avatar: null,
          memberSince: new Date().toISOString(),
          preferences: { navigationMode: 'balanced', transportMode: 'car', alertsEnabled: true },
          stats: { totalJourneys: 47, totalDistance: 342.5, avgComfortScore: 4.2, reportsSubmitted: 23 },
        };
        setUser(demoUser);
        localStorage.setItem('flowwise_user', JSON.stringify(demoUser));
        return { success: true };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('flowwise_token', newToken);
      localStorage.setItem('flowwise_user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      // Demo mode fallback if API is down
      if (!error.response) {
        const demoToken = 'demo-token-flowwise-' + Date.now();
        localStorage.setItem('flowwise_token', demoToken);
        setToken(demoToken);
        const demoUser = {
          id: 'demo-' + Date.now(),
          name: name,
          email: email,
          avatar: null,
          memberSince: new Date().toISOString(),
          preferences: { navigationMode: 'balanced', transportMode: 'car', alertsEnabled: true },
          stats: { totalJourneys: 0, totalDistance: 0, avgComfortScore: 0, reportsSubmitted: 0 },
        };
        setUser(demoUser);
        localStorage.setItem('flowwise_user', JSON.stringify(demoUser));
        return { success: true };
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('flowwise_token');
    localStorage.removeItem('flowwise_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
