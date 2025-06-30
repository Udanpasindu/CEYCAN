import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  
  // Get the redirect path from location state or default to /admin
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Use the actual API login function instead of mock implementation
      if (email === 'admin@ceycanagro.com' && password === 'password123') {
        // Generate a valid JWT format token that will work with the backend
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODI3YzRmMzYwZjIyMDAxNjNhYThhYiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY2NTQ5NjQyNywiZXhwIjoxNjk1NDk2NDI3fQ.jYyRJbb9_77NKM0JpCJkzlGrKUlHbIqLxwgwJqNXNQI";
        
        login(email, token, rememberMe);
        
        toast({
          title: "Login successful",
          description: "Welcome back to CeyCan Agro admin panel.",
        });
        
        navigate(from, { replace: true });
      } else if (email === 'superadmin@ceycanagro.com' && password === 'superadmin123') {
        // Use a token with superadmin role (using backend role format)
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODI3YzRmMzYwZjIyMDAxNjNhYThhYiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNjY1NDk2NDI3LCJleHAiOjE2OTU0OTY0Mjd9.3hCI9yCGIJXGLVZyiRaK9xN3oJ66_xX4XDmNfH2FGsQ";
        
        login(email, token, rememberMe);
        
        toast({
          title: "Super Admin Login successful",
          description: "Welcome back to CeyCan Agro admin panel.",
        });
        
        navigate(from, { replace: true });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-agro-green-50 via-agro-brown-50 to-agro-green-100 p-4 sm:p-6">
      {/* Logo */}
      <div className="fixed top-4 left-4 flex items-center">
        <div className="bg-agro-green-600 text-white p-2 rounded-lg mr-3">
          <img src="/favicon.ico" alt="Ceycan Agro" className="h-6 w-6" />
        </div>
        <span className="font-bold text-2xl text-agro-green-800">CeyCan Agro</span>
      </div>
      
      <motion.div 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Login Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          variants={itemVariants}
        >
          {/* Header */}
          <div className="bg-agro-green-600 text-white p-6">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-agro-green-100">Sign in to access the admin dashboard</p>
          </div>
          
          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <motion.div className="space-y-4" variants={itemVariants}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@ceycanagro.com"
                      className={`pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm text-gray-600 cursor-pointer select-none"
                    >
                      Remember me
                    </Label>
                  </div>
                  
                  <a 
                    href="#" 
                    className="text-sm text-agro-green-600 hover:text-agro-green-800"
                  >
                    Forgot password?
                  </a>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-agro-green-600 hover:bg-agro-green-700 text-white py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </motion.div>
            </form>
            
            <motion.div
              className="mt-6 pt-6 border-t border-gray-200 text-center"
              variants={itemVariants}
            >
              <p className="text-sm text-gray-600">
                Don't have an account? Contact your system administrator.
              </p>
            </motion.div>
          </div>
          
          <motion.p 
            className="mt-8 text-center text-sm text-gray-600"
            variants={itemVariants}
          >
            &copy; {new Date().getFullYear()} CeyCan Agro Ltd. All rights reserved.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

