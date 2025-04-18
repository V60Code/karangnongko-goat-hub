
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with:', username);
      await login({ username, password });
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-farmblue mb-2">Sistem Informasi Peternakan</h1>
          <p className="text-gray-600">KarangnongkoFarm Management System</p>
        </div>
        
        <Card className="w-full animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">LOGIN</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-farmblue hover:bg-farmblue-dark"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </CardContent>
          </form>
        </Card>
        
        <div className="mt-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription className="text-center text-sm text-gray-600">
              Available logins: username <strong>admin</strong>, <strong>barat</strong>, or <strong>timur</strong> with password <strong>password</strong>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
