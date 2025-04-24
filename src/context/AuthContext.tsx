
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AuthUser, LoginCredentials } from '@/types/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("Existing session found:", session);
        fetchUserProfile(session.user.id);
      } else {
        console.log("No existing session found");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for ID:', userId);
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (user) {
        console.log('Found user profile:', user);
        setUser({
          id: user.id,
          username: user.username,
          role: user.role as AuthUser['role'],
          name: undefined,
          photoUrl: undefined,
        });
        setIsAuthenticated(true);
      } else {
        console.log('No user profile found for ID:', userId);
      }
    } catch (err) {
      console.error('Unexpected error in fetchUserProfile:', err);
    }
  };

  const login = async ({ username, password }: LoginCredentials) => {
    try {
      console.log('Attempting login with username:', username);
      
      // First get the user from our custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
        return;
      }

      if (!userData) {
        console.error('No user found with username:', username);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
        return;
      }

      // Check if password matches
      if (userData.password !== password) {
        console.error('Password does not match');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
        return;
      }

      console.log('User found:', userData);
      
      // Set user data and authentication state
      setUser({
        id: userData.id,
        username: userData.username,
        role: userData.role as AuthUser['role'],
        name: undefined,
        photoUrl: undefined,
      });
      setIsAuthenticated(true);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred",
      });
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An unexpected error occurred",
      });
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
