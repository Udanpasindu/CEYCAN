import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Define user type with role
type User = {
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, token: string, rememberMe: boolean) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for authentication token and user info
    const storedToken = localStorage.getItem('ceycan_token') || sessionStorage.getItem('ceycan_token');
    const userDataString = localStorage.getItem('ceycan_user') || sessionStorage.getItem('ceycan_user');
    
    if (storedToken && userDataString) {
      // Log token format for debugging
      console.log('Retrieved token:', storedToken ? `${storedToken.substring(0, 15)}...` : 'No token');
      
      try {
        const userData = JSON.parse(userDataString);
        
        // Set token and auth state
        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Set the token for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        console.log('Auth headers set in context:', axios.defaults.headers.common['Authorization']);
      } catch (e) {
        console.error('Failed to parse user data', e);
        // Clear invalid data
        localStorage.removeItem('ceycan_token');
        localStorage.removeItem('ceycan_user');
        sessionStorage.removeItem('ceycan_token');
        sessionStorage.removeItem('ceycan_user');
      }
    } else {
      // Log the absence of token for debugging
      console.log('No token found in storage during context initialization');
    }
    
    setIsLoading(false);
  }, []);

  const login = (email: string, authToken: string, rememberMe: boolean) => {
    // Determine user role based on email (for demo purposes)
    const isSuperAdmin = email === 'superadmin@ceycanagro.com';
    
    const userData: User = {
      email,
      name: isSuperAdmin ? 'Super Admin' : 'Admin User',
      role: isSuperAdmin ? 'super_admin' : 'admin' // Use backend 'superadmin' format
    };
    
    // Store auth state and user data
    const storage = rememberMe ? localStorage : sessionStorage;
    // Store token properly with Bearer prefix
    storage.setItem('ceycan_token', authToken);
    storage.setItem('ceycan_user', JSON.stringify(userData));
    
    // Set the axios auth header immediately after login
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    console.log('Auth headers set on login:', axios.defaults.headers.common['Authorization']);
    
    setToken(authToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ceycan_token');
    localStorage.removeItem('ceycan_user');
    sessionStorage.removeItem('ceycan_token');
    sessionStorage.removeItem('ceycan_user');
    
    // Remove the token from axios headers
    delete axios.defaults.headers.common['Authorization'];
    
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
