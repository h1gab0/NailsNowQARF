import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/auth/admin/verify', { credentials: 'include' });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Session verification error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (username, password, instanceId) => {
    // If an instanceId is provided, it's an instance login. Otherwise, it's a super admin login.
    const url = instanceId ? `/api/auth/${instanceId}/login` : '/api/auth/admin/login';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid credentials');
    }

    const userData = await response.json();
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/admin/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Navigate to home after logout. The router will handle redirecting to login if needed.
      window.location.href = '/';
    }
  };

  const value = { user, isAuthenticated, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
