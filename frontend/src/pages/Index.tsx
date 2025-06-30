import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChefHat, Wheat, Apple, Droplets, ArrowRight,
  Sparkles, Leaf, Star
} from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getCategories } from '@/services/api';
import { Spinner } from '@/components/ui/spinner';
import { categoryToRoute } from '@/utils/categoryRoutes';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { useContactInfo } from '@/hooks/useContactInfo';

// Define custom query keys
const queryKeys = {
  categories: 'categories',
  products: 'products',
  productsByCategory: (id: string) => ['products', id],
  categoryById: (id: string) => ['category', id],
};

function Index() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  // Add slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0);
  const itemsPerSlide = 3;
  const navigate = useNavigate();
  
  // Define hero slider images
  const heroImages = [
    '/Spices-Banner.jpg',
    '/sri-lankan-spices.jpg',
    '/Sri-Lankan-Spices-1200x540.jpg'
  ];

  // Auto-rotate slides
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(slideTimer);
  }, [heroImages.length]);

  // Handle scroll events for section tracking
  useEffect(() => {
    const handleScroll = () => {
      // Track active section for navigation highlighting
      // Note: removed "contact" from the sections array as it's now a separate page
      const sections = ['hero', 'categories'];
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { 
    data: categoriesData = [], 
    isLoading: loadingCategories,
    refetch: refetchCategories
  } = useQuery({
    queryKey: [queryKeys.categories],
    queryFn: () => getCategories(),
    staleTime: 30000, // 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  // Use effect to handle page refresh and ensure categories are fetched
  useEffect(() => {
    // Refetch when component mounts - this handles page refresh
    refetchCategories();
  }, [refetchCategories]);

  // Fix: Move this state update to a separate useEffect with correct dependencies
  useEffect(() => {
    if (categoriesData && categoriesData.length !== categories.length) {
      setCategories(categoriesData);
    }
    if (loadingCategories !== loading) {
      setLoading(loadingCategories);
    }
  }, [categoriesData, loadingCategories, categories.length, loading]);

  const getIconComponent = (iconName: string) => {
    const iconMap = { ChefHat, Wheat, Apple, Droplets };
    return iconMap[iconName] || ChefHat;
  };

  // Animation variants for framer-motion
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardHoverAnimation = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.03, 
      y: -8,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  };
  
  const iconAnimation = {
    rest: { rotate: 0 },
    hover: { rotate: 10, scale: 1.1, transition: { duration: 0.3 } }
  };
  
  const buttonAnimation = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  // Add slider animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  // Add these new animation variants below your existing animation definitions
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as "reverse" | "loop" | "mirror",
      duration: 3,
      ease: "easeInOut"
    }
  };

  // Add this helper function before the return statement
  const categorySlides = useMemo(() => {
    return Array.from({ length: Math.ceil(categories.length / itemsPerSlide) }, (_, i) =>
      categories.slice(i * itemsPerSlide, (i + 1) * itemsPerSlide)
    );
  }, [categories]);

  // Helper function to get product count
  const getProductCount = (category: any): number => {
    // If products is a number, return it
    if (typeof category.products === 'number') {
      return category.products;
    }
    // If products is an array, return its length
    else if (Array.isArray(category.products)) {
      return category.products.length;
    }
    // Default to 0 if no products data
    return 0;
  };

  const { contactInfo: fetchedContactInfo, loading: loadingContactInfo } = useContactInfo();
  
  // Define contact information with fallback
  const contactInfo = fetchedContactInfo || {
    address: "Unit 4, 465 Milner Avenue, Toronto, ON, M1B 2K4, Canada",
    phone: "(416) 459-7519",
    fax: "(416) 292-3121",
    email: "ceycanltd@gmail.com",
    businessHours: {
      weekdays: "Monday – Friday: 9AM – 6PM",
      weekend: "Saturday - Sunday: 11AM – 3PM"
    },
    social: {
      facebook: "https://facebook.com/ceycanagro",
      instagram: "https://instagram.com/ceycanagro",
      twitter: "https://twitter.com/ceycanagro",
      linkedin: "https://linkedin.com/company/ceycanagro"
    }
  };

  // Helper function to get category-specific color schemes
  function getCategoryColor(name: string) {
    // Convert to lowercase and normalize for consistent matching
    const category = name.toLowerCase().trim();
    
    // Define color schemes for different category types
    if (category.includes('spice') || category.includes('curry')) {
      return {
        icon: 'bg-gradient-to-br from-orange-500 to-red-600',
        badge: 'bg-orange-100 text-orange-800 border-orange-200',
        accent: 'from-orange-400 to-red-500'
      };
    } else if (category.includes('rice') || category.includes('grain')) {
      return {
        icon: 'bg-gradient-to-br from-amber-500 to-yellow-600',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        accent: 'from-amber-400 to-yellow-500'
      };
    } else if (category.includes('tea') || category.includes('drink')) {
      return {
        icon: 'bg-gradient-to-br from-green-500 to-emerald-600',
        badge: 'bg-green-100 text-green-800 border-green-200',
        accent: 'from-green-400 to-emerald-500'
      };
    } else if (category.includes('oil') || category.includes('ghee')) {
      return {
        icon: 'bg-gradient-to-br from-yellow-400 to-amber-600',
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        accent: 'from-yellow-400 to-amber-500'
      };
    } else if (category.includes('cookware') || category.includes('tools')) {
      return {
        icon: 'bg-gradient-to-br from-slate-500 to-gray-600',
        badge: 'bg-slate-100 text-slate-800 border-slate-200',
        accent: 'from-slate-400 to-gray-500'
      };
    } else if (category.includes('fruit') || category.includes('vegetable')) {
      return {
        icon: 'bg-gradient-to-br from-lime-500 to-green-600',
        badge: 'bg-lime-100 text-lime-800 border-lime-200',
        accent: 'from-lime-400 to-green-500'
      };
    } else if (category.includes('pickle') || category.includes('preserve')) {
      return {
        icon: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        accent: 'from-emerald-400 to-teal-500'
      };
    }
    
    // Default color scheme
    return {
      icon: 'bg-gradient-to-br from-agro-green-500 to-green-600',
      badge: 'bg-agro-green-100 text-agro-green-800 border-agro-green-200',
      accent: 'from-agro-green-400 to-green-500'
    };
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-100 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] animate-gradient-x"></div>
      
      {/* Navigation Bar - simplified props since we removed the top section */}
      <NavBar activeSection={activeSection} contactInfo={contactInfo} />

      {/* Hero Section with Image Slider */}
      <section id="hero" className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Image slider container */}
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((img, index) => (
            <div 
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${img})`, backgroundPosition: 'center' }}
              >
                {/* Neutral dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
            </div>
          ))}
          
          {/* Slider navigation dots */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Slider navigation arrows */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1))}
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Enhanced decorative elements - keep existing elements */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white/30 rounded-full blur-lg animate-ping opacity-30"></div>
        
        {/* Add floating spice graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-[10%] text-white/20"
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <Leaf size={40} />
          </motion.div>
          <motion.div 
            className="absolute bottom-20 right-[15%] text-white/20"
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Wheat size={50} />
          </motion.div>
          <motion.div 
            className="absolute top-[40%] right-[25%] text-white/20"
            animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          >
            <Droplets size={35} />
          </motion.div>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative max-w-7xl mx-auto text-center z-20"
        >
          <motion.div variants={fadeIn} className="mb-6">
            <Badge className="mb-6 bg-gradient-to-r from-amber-300 to-orange-400 text-white border-amber-300 hover:from-amber-400 hover:to-orange-500 px-4 py-1 text-sm animate-pulse">
              <Sparkles className="w-4 h-4 mr-1" /> Premium Agricultural Products
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
          >
            <span className="inline-block animate-float bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-100">
              CeyCan
            </span>{" "}
            <span className="inline-block animate-float animation-delay-300 bg-clip-text text-transparent bg-gradient-to-r from-orange-200 to-red-100">
              Agro
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeIn}
            className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
          >
            Bringing you the finest agricultural products from Sri Lankan farms to your table. 
            Quality, freshness, and tradition in every product.
          </motion.p>
          
          <motion.div 
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="agro-gradient hover:agro-gradient-hover text-white px-8 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 group"
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Our Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-green text-black hover:bg-red hover:text-agro-green-800 px-8 py-4 text-lg rounded-xl group"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="hidden md:flex justify-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <a 
              href="#categories"
              className="animate-bounce bg-white/20 backdrop-blur-sm p-2 w-10 h-10 ring-1 ring-white/20 shadow-lg rounded-full flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Welcome Section */}
      <section id="welcome" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-agro-brown-50/10 to-white"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-200 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-amber-100 blur-3xl"></div>
          <motion.div 
            className="absolute bottom-0 right-0 text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 0.2, 
              y: [0, -10, 0], 
              rotate: [0, 5, 0] 
            }}
            transition={{ repeat: Infinity, duration: 8 }}
            style={{ fontSize: '200px' }}
          >
            ✽
          </motion.div>
        </div>
        
        <motion.div 
          className="max-w-6xl mx-auto relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="text-center mb-12">
            <motion.div 
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none px-4 py-1">
                <Sparkles className="w-4 h-4 mr-1" /> Since 2010
              </Badge>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-agro-green-800 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
               Welcome to the Home of Exotic Foods
            </motion.h2>
          </div>
          
            <motion.div 
            className="bg-white shadow-[0_20px_50px_-12px_rgba(51,51,51,0.6)] rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{
              boxShadow: "0 25px 60px -12px rgba(51,51,51,0.8)"
            }}
            >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 md:p-10 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <motion.p 
                className="text-lg text-agro-brown-600 mb-6 leading-relaxed text-justify"
                variants={fadeIn}
                >
                Welcome to Ceycan, your home for exotic foods and drinks right here in Canada, serving markets from Newfoundland in the east to British Colombia in the west. We offer a range of over 100 food products from countries all over the world.
                </motion.p>
                <motion.p 
                className="text-lg text-agro-brown-600 mb-6 leading-relaxed text-justify"
                variants={fadeIn}
                >
                Our products include Basmati rice, red rice, ethnic rice, ancient grains, coconut oil, coconut cream milk, ghee, Ceylon tea, Ceylon spices, pickles, ethnic cook ware and specialty items.
                </motion.p>
                <motion.p 
                className="text-xl font-medium text-agro-green-700 italic text-justify"
                variants={fadeIn}
                >
                Explore and discover our world of spices and treats.
                </motion.p>
              </motion.div>

              <motion.div 
                className="mt-8 flex flex-wrap gap-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {['Spices', 'Rice', 'Tea', 'Oil', 'Cookware'].map((item, i) => (
                <motion.span 
                  key={i}
                  variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: i * 0.1 }
                  }
                  }}
                  className="px-4 py-2 bg-agro-brown-50 text-agro-brown-600 rounded-full text-sm font-medium"
                >
                  {item}
                </motion.span>
                ))}
              </motion.div>
              </div>
              <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-red-500/10 z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              ></motion.div>
              <motion.img 
                src="/sri-lankan-spices.jpg"
                alt="Exotic spices and ingredients"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
              />
              <motion.div 
                className="absolute bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg z-20"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl font-bold text-agro-green-600">100+</div>
                <div className="text-agro-brown-600">Products Worldwide</div>
              </motion.div>
              </div>
            </div>
            <div className="bg-agro-green-50 p-6 flex flex-wrap gap-8 justify-center items-center">
              <motion.div 
              className="flex items-center gap-2"
              whileInView={{ scale: [0.9, 1.1, 1] }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              >
              <div className="text-agro-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Premium Quality</span>
              </motion.div>
              <motion.div 
              className="flex items-center gap-2"
              whileInView={{ scale: [0.9, 1.1, 1] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              >
              <div className="text-agro-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Authentic Flavors</span>
              </motion.div>
              <motion.div 
              className="flex items-center gap-2"
              whileInView={{ scale: [0.9, 1.1, 1] }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              >
              <div className="text-agro-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Nationwide Delivery</span>
              </motion.div>
            </div>
            </motion.div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-xl"
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Discover Our Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Product Categories with enhanced colors and animations */}
      <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Background elements with enhanced glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white"></div>
        
        {/* Enhanced decorative elements with more glow and animation */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-agro-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 10, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 left-0 w-full h-full bg-agro-green-100/20 backdrop-blur-3xl opacity-30 rounded-full"
          ></motion.div>
        </div>
        
        {/* Floating spice icons in the background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-[15%] left-[5%] text-agro-green-500/10"
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <Wheat size={80} />
          </motion.div>
          <motion.div 
            className="absolute bottom-[10%] right-[8%] text-amber-500/10"
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          >
            <Apple size={100} />
          </motion.div>
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Enhanced header card with 3D effect */}
          <motion.div 
            variants={fadeIn} 
            className="text-center mb-12 bg-gradient-to-r from-agro-green-50 to-agro-green-100/80 backdrop-blur-sm p-8 md:p-10 rounded-xl max-w-4xl mx-auto shadow-[0_20px_50px_-12px_rgba(0,128,0,0.2)] border border-agro-green-200/30 transform hover:-translate-y-1 transition-all duration-300"
            whileHover={{
              boxShadow: "0 25px 60px -15px rgba(0,128,0,0.3)",
            }}
          >
            <motion.div animate={floatingAnimation}>
              <Badge className="mb-4 bg-gradient-to-r from-agro-green-400 to-green-500 text-white border-none px-4 py-1 shadow-lg">
                <Star className="w-4 h-4 mr-1 text-yellow-200" /> Our Products
              </Badge>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-agro-green-800 mb-4 drop-shadow-sm">
              Explore Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500">Flavorful</span> Collection
            </h2>
            <p className="text-xl text-agro-green-700 max-w-2xl mx-auto">
              Discover our wide range of premium agricultural treasures from Sri Lanka's finest farms
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner size="lg" className="text-agro-green-600" />
            </div>
          ) : (
            <div className="relative">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                variants={containerAnimation}
              >
                {categorySlides[currentCategorySlide]?.map((category, index) => {
                  const IconComponent = getIconComponent(category.icon);
                  const colorScheme = getCategoryColor(category.name);
                  const productCount = getProductCount(category);
                  
                  return (
                    <motion.div 
                      key={category._id}
                      variants={itemAnimation}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      className="h-full"
                    >
                      <Link to={categoryToRoute(category.name)}>
                        <motion.div
                          variants={cardHoverAnimation}
                          className="h-full rounded-xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] transition-all duration-500 bg-white border border-gray-200/50 group"
                        >
                          <div className="relative overflow-hidden">
                            <motion.img 
                              src={category.image} 
                              alt={category.name}
                              className="w-full h-64 object-cover"
                              whileHover={{ scale: 1.08 }}
                              transition={{ duration: 0.5 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-70 transition-all duration-300"></div>
                            <motion.div 
                              className={`absolute top-4 left-4 ${colorScheme.icon} text-white p-3 rounded-lg backdrop-blur-sm shadow-lg`}
                              variants={iconAnimation}
                              whileHover={{ 
                                scale: 1.1, 
                                rotate: 5,
                                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)"
                              }}
                            >
                              <IconComponent className="h-6 w-6" />
                            </motion.div>

                            {/* Category name overlay on image */}
                            <div className="absolute bottom-0 inset-x-0 p-6">
                              <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
                                {category.name}
                              </h3>
                              <motion.div 
                                className="h-1 w-16 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full mb-3"
                                initial={{ width: 0 }}
                                whileInView={{ width: '4rem' }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                              />
                              <div className="flex items-center mt-3">
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/10">
                                  {productCount} Products
                                </Badge>
                              </div>
                            </div>
                            
                            {/* View details button on hover */}
                            <motion.div 
                              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                            >
                              <Button className="bg-white text-agro-green-700 hover:bg-agro-green-50 group">
                                <span>View Collection</span>
                                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </motion.div>
                          </div>
                          
                          <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50">
                            <p className="text-agro-brown-600 leading-relaxed mb-4 line-clamp-3">
                              {category.description}
                            </p>
                            <motion.div
                              variants={buttonAnimation}
                              className="flex items-center justify-between"
                            >
                              <div className="w-2/3 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-agro-green-400 to-green-500"
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${Math.random() * 30 + 70}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.4 }}
                                />
                              </div>
                              <span className={`inline-flex items-center text-sm font-medium text-agro-green-600 gap-1`}>
                                Explore
                                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                              </span>
                            </motion.div>
                          </CardContent>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Enhanced Slider Navigation */}
              <div className="flex justify-center items-center mt-10 gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white text-agro-green-700 hover:bg-agro-green-100 border-agro-green-200 shadow-md hover:shadow-lg transition-all w-12 h-12"
                    onClick={() => setCurrentCategorySlide(prev => prev === 0 ? categorySlides.length - 1 : prev - 1)}
                    disabled={categorySlides.length <= 1}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </motion.div>

                <div className="flex gap-3">
                  {categorySlides.map((_, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.9 }}
                      className={`transition-all duration-300 ${
                        index === currentCategorySlide 
                          ? 'w-8 h-3 bg-agro-green-600 rounded-full shadow-lg' 
                          : 'w-3 h-3 bg-agro-green-200 rounded-full hover:bg-agro-green-400'
                      }`}
                      onClick={() => setCurrentCategorySlide(index)}
                    />
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white text-agro-green-700 hover:bg-agro-green-100 border-agro-green-200 shadow-md hover:shadow-lg transition-all w-12 h-12"
                    onClick={() => setCurrentCategorySlide(prev => (prev + 1) % categorySlides.length)}
                    disabled={categorySlides.length <= 1}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
          
          {!loading && categories.length > 0 && (
            <motion.div 
              variants={fadeIn}
              className="mt-12 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-agro-green-500 to-green-600 hover:from-agro-green-600 hover:to-green-700 text-white gap-2 group px-8 py-6 text-lg rounded-full shadow-[0_10px_30px_-10px_rgba(0,128,0,0.5)] hover:shadow-[0_15px_35px_-10px_rgba(0,128,0,0.6)]"
                  onClick={() => navigate('/categories')}
                >
                  <span>Explore All Categories</span>
                  <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};



export default Index;
