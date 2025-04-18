
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
        fetchUserProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      setUser({
        id: user.id,
        username: user.username,
        role: user.role as AuthUser['role'],
      });
      setIsAuthenticated(true);
    }
  };

  const login = async ({ username, password }: LoginCredentials) => {
    try {
      const { data: user, error } = await supabase
        .rpc('get_user_by_username', { username })
        .single();

      if (error || !user) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
        return;
      }

      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: `${username}@karangnongkofarm.com`,
        password,
      });

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: signInError.message,
        });
        return;
      }

      if (session) {
        await fetchUserProfile(session.user.id);
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
        });
        navigate('/');
      }
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
      await supabase.auth.signOut();
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
