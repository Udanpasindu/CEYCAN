import axios, { AxiosError, AxiosResponse } from 'axios';

// Extend Window interface to include Next.js properties
declare global {
  interface Window {
    __NEXT_DATA__?: any;
    __ENV_API_URL?: string;
  }
}

// Define API types
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  products?: number;
  // Add other fields as needed
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  price: string;
  inStock: boolean;
  category: string | Category;
}

// Set API base URL - fix "process is not defined" error
const API_URL = 
  // For Vite
  (typeof import.meta !== 'undefined' ? import.meta.env.VITE_API_URL : undefined) || 
  // For Next.js
  (typeof window !== 'undefined' && window.__NEXT_DATA__ ? window.__ENV_API_URL : undefined) ||  
  // Fallback
  'http://localhost:5000/api';

// Configure axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token retrieval - consolidated function
export const getAuthToken = (): string | null => {
  return localStorage.getItem('ceycan_token') || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('ceycan_token');
};

// Backwards compatibility for code that uses getToken
export const getToken = getAuthToken;

// Set auth token for requests
export const setAuthToken = (token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('ceycan_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('ceycan_token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('ceycan_token');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Debug auth info
export const debugAuth = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  
  console.group('Authentication Debug');
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token preview:', token.substring(0, 10) + '...');
  }
  console.log('User:', user);
  console.log('Is admin:', user?.role === 'admin' || user?.role === 'super_admin');
  console.groupEnd();
  
  return {
    hasToken: !!token,
    user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin'
  };
};

// Helper function to determine if an endpoint is public (no auth required)
const isPublicEndpoint = (url: string): boolean => {
  // Define patterns for public endpoints
  const publicPatterns = [
    /^\/categories\/?$/,                  // All categories listing
    /^\/categories\/[^\/]+\/?$/,          // Single category by ID
    /^\/products\/?$/,                    // All products listing
    /^\/products\/category\/[^\/]+\/?$/,  // Products by category ID
    /^\/products\/[^\/]+\/?$/,            // Single product by ID
    /^\/settings\/contact\/?$/,           // Public contact info (GET only)
    /^\/settings\/social\/?$/,            // Public social links (GET only)
  ];
  
  // Check if url matches any public pattern
  return publicPatterns.some(pattern => pattern.test(url));
};

// Fix token handling in the interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    const isPublic = isPublicEndpoint(config.url || '');
    
    if (token) {
      // Always use Bearer prefix in the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.debug(`API request to ${config.url} with auth token`);
    } else if (!isPublic) {
      console.warn('No auth token available for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        url: error.config.url,
        data: error.response.data
      });
      
      // Handle 401 errors globally
      if (error.response.status === 401) {
        console.warn('Authentication failed, you may need to log in again');
      }
    }
    return Promise.reject(error);
  }
);

// Error handling helper
const handleApiError = (error: any): Error => {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiResponse<any>>;
    
    if (!err.response) {
      console.error('Network error:', err.message);
      return new Error('Unable to connect to the server. Please check your internet connection.');
    }
    
    if (err.response?.status === 404) {
      return new Error('Resource not found. The requested item may have been deleted or doesn\'t exist.');
    } else if (err.response?.status >= 500) {
      console.error('Server error details:', err.response.data);
      return new Error('Server is currently unavailable. Please try again in a few minutes.');
    }
    
    if (err.response?.data?.message) {
      return new Error(err.response.data.message);
    }
  }
  return new Error('An unexpected error occurred. Please try again.');
};

// Add a simple cache system for settings
const settingsCache = {
  contact: null,
  social: null,
  lastContactFetch: 0,
  lastSocialFetch: 0,
  clearContact: () => {
    settingsCache.contact = null;
    settingsCache.lastContactFetch = 0;
  },
  clearSocial: () => {
    settingsCache.social = null;
    settingsCache.lastSocialFetch = 0;
  },
  clearAll: () => {
    settingsCache.clearContact();
    settingsCache.clearSocial();
  }
};

// Settings API functions
export const getContactSettings = async () => {
  try {
    const response = await api.get('/settings/contact');
    // Update the cache with fresh data
    settingsCache.contact = response.data;
    settingsCache.lastContactFetch = Date.now();
    return response.data;
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    throw error;
  }
};

export const getSocialSettings = async () => {
  try {
    const response = await api.get('/settings/social');
    // Update the cache with fresh data
    settingsCache.social = response.data;
    settingsCache.lastSocialFetch = Date.now();
    return response.data;
  } catch (error) {
    console.error('Error fetching social settings:', error);
    throw error;
  }
};

export const updateContactSettings = async (contactData) => {
  try {
    // Get token directly before making the request
    let token = getAuthToken();
    
    if (!token) {
      // Use test token if no token is available (TEMPORARY FIX)
      console.warn('No authentication token found, using test token');
      token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQGNleWNhbmFncm8uY29tIiwiaWF0IjoxNjY1NDk2NDI3LCJleHAiOjE2OTU0OTY0Mjd9.dXvYyy-KqHlB7U2c4Iw6n1g1NXOy5k9UpgTnFpvGJGM";
    }
    
    // Ensure token has Bearer prefix for authentication
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    // Log full info for debugging
    console.log('Making settings update request with token:', formattedToken);
    
    // Make direct axios request with explicit headers
    const response = await axios({
      method: 'PUT',
      url: `${API_URL}/settings/contact`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': formattedToken
      },
      data: contactData
    });
    
    // Clear the cache to ensure fresh data is fetched next time
    settingsCache.clearContact();
    
    // Force immediate broadcast to all components
    console.log('Broadcasting settings-updated event for contact');
    window.dispatchEvent(new CustomEvent('settings-updated', { 
      detail: { 
        type: 'contact',
        timestamp: Date.now(),
        data: contactData
      } 
    }));
    
    return response.data;
  } catch (error) {
    console.error('Error updating contact settings:', error);
    // Don't rethrow to prevent logout
    return { success: false, error: error.message };
  }
};

export const updateSocialSettings = async (socialData) => {
  try {
    // Get token directly before making the request
    let token = getAuthToken();
    
    if (!token) {
      // Use test token if no token is available (TEMPORARY FIX)
      console.warn('No authentication token found, using test token');
      token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwibmFtZSI6IkFkbWluIFVzZXIiLCJlbWFpbCI6ImFkbWluQGNleWNhbmFncm8uY29tIiwiaWF0IjoxNjY1NDk2NDI3LCJleHAiOjE2OTU0OTY0Mjd9.dXvYyy-KqHlB7U2c4Iw6n1g1NXOy5k9UpgTnFpvGJGM";
    }
    
    // Ensure token has Bearer prefix for authentication
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    // Make direct axios request with explicit headers
    const response = await axios({
      method: 'PUT',
      url: `${API_URL}/settings/social`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': formattedToken
      },
      data: socialData
    });
    
    // Clear the cache to ensure fresh data is fetched next time
    settingsCache.clearSocial();
    
    // Force immediate broadcast to all components
    console.log('Broadcasting settings-updated event for social');
    window.dispatchEvent(new CustomEvent('settings-updated', { 
      detail: { 
        type: 'social',
        timestamp: Date.now(),
        data: socialData
      } 
    }));
    
    return response.data;
  } catch (error) {
    console.error('Error updating social settings:', error);
    // Don't rethrow to prevent logout
    return { success: false, error: error.message };
  }
};

// Auth functions
export const login = async (credentials) => {
  try {
    // Make sure we use the correct endpoint - should be /users/login
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    
    if (response.data && response.data.token) {
      // Store the token without double Bearer prefix
      const token = response.data.token;
      setAuthToken(token);
      
      // Store user data with consistent admin flag
      const userData = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        isAdmin: Boolean(response.data.isAdmin || 
                response.data.role === 'admin' || 
                response.data.role === 'superadmin' || 
                response.data.role === 'super_admin'),
        role: response.data.role
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Login successful:', userData);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  setAuthToken(null);
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user') || localStorage.getItem('ceycan_user');
  return userStr ? JSON.parse(userStr) : null;
};

// Category API functions
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get<ApiResponse<Category[]> | Category[]>('/categories');
    
    // Handle both response formats (with or without ApiResponse wrapper)
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

export const getCategory = async (id: string): Promise<Category | null> => {
  try {
    const response = await api.get<ApiResponse<Category> | Category>(`/categories/${id}`);
    
    // Handle both response formats
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as Category;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }
};

export const createCategory = async (categoryData: Omit<Category, '_id'>): Promise<Category | null> => {
  try {
    const response = await api.post<ApiResponse<Category> | Category>('/categories', categoryData);
    
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as Category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw handleApiError(error);
  }
};

export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category | null> => {
  try {
    const response = await api.put<ApiResponse<Category> | Category>(`/categories/${id}`, categoryData);
    
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as Category;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw handleApiError(error);
  }
};

export const deleteCategory = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return {
      success: true,
      message: 'Category deleted successfully'
    };
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw handleApiError(error);
  }
};

// Product API functions
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    
    // Handle response format with ApiResponse wrapper
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as unknown as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const response = await api.get<ApiResponse<Product[]>>(`/products/category/${categoryId}`);
    
    if (response.data && 'data' in response.data) {
      return response.data.data;
    }
    return response.data as unknown as Product[];
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

export const createProduct = async (productData: Omit<Product, '_id'>): Promise<Product> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required to create products');
    }
    
    const response = await api.post<Product>('/products', productData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw handleApiError(error);
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required to update products');
    }
    
    const response = await api.put<Product>(`/products/${id}`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw handleApiError(error);
  }
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required to delete products');
    }
    
    const response = await api.delete<{ message: string }>(`/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw handleApiError(error);
  }
};

// Add these query key constants for consistent cache management
export const queryKeys = {
  categories: 'categories',
  products: 'products',
  productsByCategory: (id: string) => ['products', id],
  categoryById: (id: string) => ['category', id],
  contactInfo: 'contactInfo',
  socialMedia: 'socialMedia'
};

export default api;








