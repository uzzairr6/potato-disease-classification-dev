import { ReactNode, useEffect, useState } from 'react';
import { authService } from '../../lib/auth';
import { Login } from './Login';
import { Signup } from './Signup';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          await authService.getCurrentUser();
          setIsAuthenticated(true);
        } catch {
          authService.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
        {showLogin ? (
          <Login 
            onSuccess={handleAuthSuccess}
            onSwitchToSignup={handleSwitchToSignup}
          />
        ) : (
          <Signup
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    );
  }

  return <>{children}</>;
}