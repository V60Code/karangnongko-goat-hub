
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '../components/ui/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  username: string;
  name: string;
  photoUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    } else if (location.pathname !== '/login' && !location.pathname.includes('/login')) {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  const login = async (username: string, password: string): Promise<void> => {
    // In a real application, you would validate credentials against an API
    // For this demo, we're just checking for any non-empty input
    if (username && password) {
      // Mock login success
      const mockUser = {
        username,
        name: username === 'admin' ? 'Administrator' : 'Pengelola Farm',
        photoUrl: '/placeholder.svg',
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Show success toast
      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${mockUser.name}!`,
      });
      
      navigate('/');
    } else {
      toast({
        variant: "destructive",
        title: "Login gagal",
        description: "Username atau password salah.",
      });
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
