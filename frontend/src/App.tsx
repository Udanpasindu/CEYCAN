import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Categories from "./pages/admin/Categories";
import Products from "./pages/admin/Products";
import ProductsByCategory from "./pages/admin/ProductsByCategory";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import Login from "./pages/admin/Login"; // Import the Login component
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import { AuthProvider } from "./contexts/AuthContext"; // Import the AuthProvider
import { lazy, Suspense } from 'react';
import { Spinner } from "@/components/ui/spinner";
import ErrorBoundary from "./components/ErrorBoundary";
import AxiosInterceptor from './components/AxiosInterceptor';

// Pages
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AllCategories from '@/pages/AllCategories';

// Product Category Pages
import SpicesPage from "./pages/products/SpicesPage";
import RiceGrainsPage from "./pages/products/RiceGrainsPage";
import PicklesSnacksPage from "./pages/products/PicklesSnacksPage";
import OilGheePage from "./pages/products/OilGheePage";
import SeafoodPage from "./pages/products/SeafoodPage";
import CoconutProductsPage from "./pages/products/CoconutProductsPage";
import SugarsSweetenersPage from "./pages/products/SugarsSweetenersPage";
import SoyProductsPage from "./pages/products/SoyProductsPage";
import SpecialtyProductsPage from "./pages/products/SpecialtyProductsPage";

// Create a dynamic category page component
const DynamicCategoryPage = lazy(() => import('./pages/products/DynamicCategoryPage'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AxiosInterceptor>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutUs />} /> 
                <Route path="/contact" element={<ContactUs />} />
                
                {/* Admin Login Route - Outside of protected routes */}
                <Route path="/admin/login" element={<Login />} />
                
                {/* Product Category Routes - Specific routes with consistent slug format */}
                <Route path="/products/rice-grains" element={<RiceGrainsPage />} />
                <Route path="/products/spices" element={<SpicesPage />} />
                <Route path="/products/pickles-snacks" element={<PicklesSnacksPage />} />
                <Route path="/products/oil-ghee" element={<OilGheePage />} />
                <Route path="/products/seafood" element={<SeafoodPage />} />
                <Route path="/products/coconut-products" element={<CoconutProductsPage />} />
                <Route path="/products/sugars-sweeteners" element={<SugarsSweetenersPage />} />
                <Route path="/products/soy-products" element={<SoyProductsPage />} />
                <Route path="/products/specialty-products" element={<SpecialtyProductsPage />} />
                
                {/* Dynamic catch-all route for categories */}
                <Route path="/products/:slug" element={
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>}>
                    <DynamicCategoryPage />
                  </Suspense>
                } />
                
                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/category/:categoryId" element={<ProductsByCategory />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Route>

                {/* New route for all categories */}
                <Route path="/categories" element={<AllCategories />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </AxiosInterceptor>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
