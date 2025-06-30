import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getAuthToken } from '@/services/api';  // Updated to use getAuthToken instead of getToken

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get token from both context and storage to ensure we have the latest
    const currentToken = token || getAuthToken();
    
    // Console log for debugging
    console.log('Current token in interceptor:', currentToken ? `${currentToken.substring(0, 15)}...` : 'No token');
    
    // Set the token in axios defaults if available
    if (currentToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      console.log('Auth headers set in interceptor:', axios.defaults.headers.common['Authorization']);
    }
    
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Always check storage for token in case it was updated
        const latestToken = token || getAuthToken();
        
        if (latestToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${latestToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Add logging for debugging
        if (error.response) {
          console.error('API error response:', error.response.status, error.response.data);
          
          // Only handle authentication errors that are not from settings endpoints
          if (error.response.status === 401 && 
              !error.config.url.includes('/settings/')) {
            // Unauthorized - log out user
            logout();
            toast({
              variant: "destructive",
              title: "Session Expired",
              description: "Your session has expired. Please log in again.",
            });
            navigate('/admin/login');
          }
        } else {
          console.error('API error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, logout, navigate, toast]);

  return <>{children}</>;
};

export default AxiosInterceptor;
