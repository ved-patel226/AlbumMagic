import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const checkAuthentication = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/check');
      const data = await response.json();
      return data.authenticated === true;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const performAuthCheck = async () => {
      const authenticated = await checkAuthentication();
      setIsAuthenticated(authenticated);
      
      // If user is on /auth routes and is authenticated, redirect to /
      const currentPath = window.location.pathname;
      if (authenticated && currentPath.startsWith('/auth')) {
        navigate('/');
      }
    };

    performAuthCheck();
  }, [navigate]);

  return { isAuthenticated, checkAuthentication };
};
