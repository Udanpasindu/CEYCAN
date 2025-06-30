import axios from 'axios';

// Set API base URL using browser-compatible approach
const API_URL = 
  // For Vite
  (typeof import.meta !== 'undefined' ? import.meta.env.VITE_API_URL : undefined) || 
  // Fallback
  'http://localhost:5000/api';

/**
 * Get the authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  // Try newer format first, then legacy format
  const token = localStorage.getItem('ceycan_token') || 
                localStorage.getItem('token') || 
                sessionStorage.getItem('ceycan_token');
  
  // Debug token retrieval
  console.log('Retrieved token (first 10 chars):', token ? `${token.substring(0, 10)}...` : 'No token found');
  
  return token;
};

/**
 * Set the authentication token in localStorage
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    // Store raw token without modifications
    localStorage.setItem('ceycan_token', token);
    
    // Store in session storage as backup
    sessionStorage.setItem('ceycan_token', token);
    
    console.log('Token stored successfully, length:', token.length);
  } else {
    localStorage.removeItem('ceycan_token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('ceycan_token');
    console.log('Token cleared from storage');
  }
};

// Hard-coded admin token for testing - to be removed in production
export const getTestToken = (): string => {
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQGNleWNhbmFncm8uY29tIiwiaWF0IjoxNjY1NDk2NDI3LCJleHAiOjE2OTU0OTY0Mjd9.dXvYyy-KqHlB7U2c4Iw6n1g1NXOy5k9UpgTnFpvGJGM";
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Simplified admin check - all logged in users are admins
 * This implementation treats any authenticated user as an admin
 */
export const isAdmin = (): boolean => {
  // Simple approach - if you're logged in, you're an admin
  return isAuthenticated();
};

/**
 * Get current user from localStorage 
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user') || localStorage.getItem('ceycan_user');
  if (!userStr) return null;
  
  try {
    const user = JSON.parse(userStr);
    // Ensure admin property is set to true
    user.isAdmin = true;
    return user;
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
};

/**
 * Debug function to show authentication state
 */
export const debugAuth = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  
  console.group('Authentication Debug');
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token value:', token);
  }
  console.log('User object:', user);
  console.log('Is authenticated:', isAuthenticated());
  console.log('Is admin:', isAdmin(), '(simplified: all authenticated users are admins)');
  console.groupEnd();
  
  return {
    hasToken: !!token,
    user,
    isAdmin: isAdmin()
  };
};

export default {
  getAuthToken,
  setAuthToken,
  isAuthenticated,
  isAdmin,
  getCurrentUser,
  debugAuth
};
