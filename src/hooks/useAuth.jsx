import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

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

  // Load user profile from database
  const loadUserProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile not found in database:', error.message);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }, []);

  // Initialize session and user data
  const initializeAuth = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        return;
      }

      if (session?.user) {
        setSession(session);
        
        // Load user profile from database
        const profile = await loadUserProfile(session.user.id);
        
        const userData = {
          id: session.user.id,
          email: session.user.email,
          profile: profile || {
            id: session.user.id,
            email: session.user.email,
            first_name: session.user.user_metadata?.first_name || '',
            last_name: session.user.user_metadata?.last_name || '',
            role: 'user',
            phone: session.user.user_metadata?.phone || ''
          }
        };

        setUser(userData);
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
  }, [loadUserProfile]);

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session);
          
          // Load user profile
          const profile = await loadUserProfile(session.user.id);
          
          const userData = {
            id: session.user.id,
            email: session.user.email,
            profile: profile || {
              id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              role: 'user',
              phone: session.user.user_metadata?.phone || ''
            }
          };

          setUser(userData);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setSession(session);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [initializeAuth, loadUserProfile]);

  const login = async ({ email, password }) => {
    try {
      console.log('🔐 Attempting Supabase login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('❌ Supabase login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        console.log('✅ Supabase login successful');
        console.log('📝 Session:', { user: data.user.email, expires: data.session.expires_at });
        
        // Immediately update local state
        setSession(data.session);
        
        // Load user profile from database
        const profile = await loadUserProfile(data.user.id);
        
        const userData = {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
          created_at: data.user.created_at,
          profile: profile || {
            id: data.user.id,
            email: data.user.email,
            first_name: data.user.user_metadata?.first_name || '',
            last_name: data.user.user_metadata?.last_name || '',
            role: 'user',
            phone: data.user.user_metadata?.phone || ''
          }
        };

        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('✅ Auth state updated successfully');
        return { success: true, user: userData, session: data.session };
      }
      
      return { success: false, error: 'Login failed - no user data received' };
    } catch (error) {
      console.error('❌ Login exception:', error);
      return { success: false, error: error.message };
    }
  };

  const adminLogin = async ({ email, password }) => {
    const result = await login({ email, password });
    
    if (result.success) {
      // Check if user has admin role
      const profile = await loadUserProfile(result.user.id);
      
      if (profile?.role !== 'admin') {
        console.error('❌ Access denied - not an admin');
        await logout();
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }
      
      console.log('✅ Admin login successful');
    }
    
    return result;
  };

  const register = async ({ email, password, firstName, lastName, phone }) => {
    try {
      console.log('📝 Starting Supabase registration for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      });

      if (error) {
        console.error('❌ Supabase signup error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Supabase user created:', data.user?.email);

      // Sync user to backend database
      if (data.user) {
        try {
          const syncResponse = await fetch('http://localhost:8080/api/auth/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              firstName: firstName,
              lastName: lastName,
              phone: phone,
              supabaseId: data.user.id
            })
          });
          
          if (syncResponse.ok) {
            console.log('✅ User synced to backend successfully');
          } else {
            const errorText = await syncResponse.text();
            console.warn('⚠️ Failed to sync user to backend:', errorText);
          }
        } catch (syncError) {
          console.warn('⚠️ Backend sync failed:', syncError.message);
        }
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log('📧 Email verification required');
        return { 
          success: true, 
          message: 'Registration successful! Please check your email to verify your account.',
          requiresVerification: true
        };
      } else if (data.user && data.session) {
        console.log('✅ Registration successful - auto-confirmed');
        return { 
          success: true, 
          message: 'Registration successful! You can now sign in.',
          requiresVerification: false
        };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('❌ Registration exception:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Helper to check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.profile?.role === role;
  }, [user]);

  // Helper to refresh user profile
  const refreshUserProfile = useCallback(async () => {
    if (user?.id) {
      const profile = await loadUserProfile(user.id);
      if (profile) {
        setUser(prev => ({ ...prev, profile }));
      }
    }
  }, [user?.id, loadUserProfile]);

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