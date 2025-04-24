
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
    const checkUserSession = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('Restored user session from localStorage:', userData);
        } catch (err) {
          console.error('Failed to parse stored user data:', err);
          localStorage.removeItem('user');
        }
      }
    };
    
    checkUserSession();
  }, []);

  const login = async ({ username, password }: LoginCredentials) => {
    try {
      console.log('Attempting login with username:', username);
      
      // Debug: List all users to see if any exist
      const { data: allUsers } = await supabase
        .from('users')
        .select('*');
      
      console.log('All users in database:', allUsers);
      
      // Get the user from our custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username);

      console.log('User query result:', userData);

      if (userError) {
        console.error('User lookup error:', userError);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Error fetching user data. Please try again.",
        });
        return;
      }

      // Check if we got any users back
      if (!userData || userData.length === 0) {
        console.error('No user found with username:', username);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
        return;
      }

      // Use the first matching user
      const user = userData[0];
      
      // Check if password matches
      if (user.password !== password) {
        console.error('Password does not match');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        });
        return;
      }

      console.log('User found and password matched:', user);
      
      // Set user data and authentication state
      const authUser = {
        id: user.id,
        username: user.username,
        role: user.role as AuthUser['role'],
        name: undefined,
        photoUrl: undefined,
      };
      
      // Store in state and localStorage
      setUser(authUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(authUser));
      
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
      localStorage.removeItem('user');
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
