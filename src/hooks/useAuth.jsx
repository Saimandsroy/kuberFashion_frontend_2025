import { useState, useEffect, createContext, useContext, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(null);


  // Initialize session and user data
  const initializeAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setSession({ token });
        setUser(user);
        setIsAuthenticated(true);
      } else {
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth();
  }, [initializeAuth]);

  const login = async ({ email, password }) => {
    try {
      console.log('🔐 Attempting backend login for:', email);
      
      // Call backend directly
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error('❌ Login failed:', result.message);
        return { success: false, error: result.message || 'Login failed' };
      }

      // Store token and user data
      const { token, user } = result.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setSession({ token });
      setUser(user);
      setIsAuthenticated(true);
      
      console.log('✅ Login successful');
      return { success: true, user, session: { token } };
    } catch (error) {
      console.error('❌ Login exception:', error);
      return { success: false, error: error.message };
    }
  };

  const adminLogin = async ({ email, password }) => {
    try {
      console.log('🔐 Attempting admin login for:', email);
      
      // Call admin backend endpoint
      const response = await fetch('http://localhost:8080/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error('❌ Admin login failed:', result.message);
        return { success: false, error: result.message || 'Admin login failed' };
      }

      // Store token and user data
      const { token, user } = result.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setSession({ token });
      setUser(user);
      setIsAuthenticated(true);
      
      console.log('✅ Admin login successful');
      return { success: true, user, session: { token } };
    } catch (error) {
      console.error('❌ Admin login exception:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async ({ email, password, firstName, lastName, phone }) => {
    try {
      console.log('📝 Starting backend registration for:', email);
      
      // Call backend directly
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          confirmPassword: password,
          firstName,
          lastName,
          phone
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error('❌ Registration failed:', result.message);
        return { success: false, error: result.message || 'Registration failed' };
      }

      console.log('✅ Registration successful');
      
      // Auto-login after registration
      return await login({ email, password });
    } catch (error) {
      console.error('❌ Registration exception:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Helper to check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role?.toUpperCase() === role.toUpperCase();
  }, [user]);

  // Helper to refresh user profile
  const refreshUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setUser(result.data);
            localStorage.setItem('user', JSON.stringify(result.data));
          }
        }
      } catch (error) {
        console.error('Failed to refresh profile:', error);
      }
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    session,
    login,
    adminLogin,
    register,
    logout,
    hasRole,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default export for consistency
export default AuthProvider;