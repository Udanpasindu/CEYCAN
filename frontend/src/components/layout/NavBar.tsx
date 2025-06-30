import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Mail, Phone, Facebook, Instagram, Twitter, Linkedin, X, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Update the ContactInfo interface if it exists
interface ContactInfo {
  address: string;
  phone: string;
  fax?: string;
  email: string;
  businessHours?: {
    weekdays: string;
    weekend: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

interface NavBarProps {
  activeSection?: string;
  contactInfo?: ContactInfo;
  hideContactInfo?: boolean;
  showLogo?: boolean;
  showSocialLinks?: boolean;
  mobileNavVisible?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ 
  activeSection = 'hero',
  contactInfo: propContactInfo,
  hideContactInfo = false,
  showLogo = true,
  showSocialLinks = true,
  mobileNavVisible = true
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | undefined>(propContactInfo);
  const [loading, setLoading] = useState(!propContactInfo);

  // Handle scroll events for floating navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch contact info if not provided as prop
  useEffect(() => {
    if (!propContactInfo) {
      const fetchContactInfo = async () => {
        try {
          setLoading(true);
          const [contactResponse, socialResponse] = await Promise.all([
            axios.get('/api/settings/contact'),
            axios.get('/api/settings/social')
          ]);
          
          setContactInfo({
            address: contactResponse.data.address || '',
            phone: contactResponse.data.phone || '',
            email: contactResponse.data.email || '',
            social: {
              facebook: socialResponse.data.facebook || '',
              instagram: socialResponse.data.instagram || '',
              twitter: socialResponse.data.twitter || '',
              linkedin: socialResponse.data.linkedin || ''
            }
          });
        } catch (error) {
          console.error('Failed to fetch contact info:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchContactInfo();
    }
  }, [propContactInfo]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navbarVariants = {
    hidden: { 
      y: -100, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3 
      }
    }
  };

  return (
    <header className="relative z-50">
      {/* Main navigation - removed top section entirely */}
      <nav className="bg-white/90 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo using favicon.ico */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/favicon.ico" alt="CeyCan Agro" />
                <span className="ml-2 text-xl font-bold text-agro-green-700">CeyCan Agro</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`font-medium hover:text-agro-green-600 ${activeSection === 'hero' ? 'text-agro-green-600' : 'text-agro-brown-700'}`}>Home</Link>
              <a href="#categories" className={`font-medium hover:text-agro-green-600 ${activeSection === 'categories' ? 'text-agro-green-600' : 'text-agro-brown-700'}`}>Products</a>
              <Link to="/about" className="font-medium text-agro-brown-700 hover:text-agro-green-600">About</Link>
              <Link to="/contact" className="font-medium text-agro-brown-700 hover:text-agro-green-600">Contact</Link>
            </div>
            
            {/* Mobile menu button */}
            {mobileNavVisible && (
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-agro-green-700 hover:text-agro-green-500 hover:bg-agro-green-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-agro-green-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileNavVisible && isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="pt-2 pb-4 space-y-1 px-4">
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md font-medium ${activeSection === 'hero' ? 'bg-agro-green-50 text-agro-green-600' : 'text-agro-brown-700 hover:bg-agro-green-50 hover:text-agro-green-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <a 
                href="#categories" 
                className={`block px-3 py-2 rounded-md font-medium ${activeSection === 'categories' ? 'bg-agro-green-50 text-agro-green-600' : 'text-agro-brown-700 hover:bg-agro-green-50 hover:text-agro-green-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </a>
              <Link 
                to="/about" 
                className="block px-3 py-2 rounded-md text-agro-brown-700 font-medium hover:bg-agro-green-50 hover:text-agro-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block px-3 py-2 rounded-md text-agro-brown-700 font-medium hover:bg-agro-green-50 hover:text-agro-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
