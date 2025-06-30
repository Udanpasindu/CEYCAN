import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';

// Define contact information
const contactInfo = {
  address: "123 Agriculture Way, Toronto, ON, Canada",
  phone: "+1 (416) 555-1234",
  email: "info@ceycanagro.ca",
  social: {
    facebook: "https://facebook.com/ceycanagro",
    instagram: "https://instagram.com/ceycanagro",
    twitter: "https://twitter.com/ceycanagro",
    linkedin: "https://linkedin.com/company/ceycanagro"
  }
};

const AboutUs = () => {
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

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-800">
      {/* Navigation Bar */}
      <NavBar activeSection="about" contactInfo={contactInfo} />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-agro-green-900 via-agro-green-800 to-green-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1569132891042-eb4e8ea513e1?w=1200)`, backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-1">
              Our Story
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About CeyCan Agro</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              From the spice gardens of Ceylon to your kitchen - bringing authentic taste and tradition to your table since 2010.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Dynamic background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-agro-green-50 via-agro-brown-50/50 to-amber-50/30"></div>
        
        {/* Enhanced decorative elements */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-white/50 backdrop-blur-3xl opacity-30 rounded-full scale-75 animate-pulse duration-10s"></div>
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn}>
              <Badge className="mb-4 bg-agro-green-100 text-agro-green-800 border-agro-green-200">
                Our Story
              </Badge>
              <h2 className="text-4xl font-bold text-agro-green-800 mb-6">About CeyCan Agro</h2>
              <p className="text-lg text-agro-brown-600 mb-6 leading-relaxed">
                For centuries, explorers and traders from all over the world have braved 
                oceans and mountains to taste the spices and flavours of Ceylon.
                 Ceycan Agro Ltd now brings these premium tastes to your doorstep,
                  to your kitchen. Ceycan Agro Ltd is a family-owned and operated 
                  business based in Toronto that proudly imports and distributes food 
                  and beverage products from Ceylon and the wider world.
              </p>
              <p className="text-lg text-agro-brown-600 mb-8 leading-relaxed">
                Our commitment to sustainable farming practices and fair trade ensures that our products not only 
                taste great but also support local farming communities across Sri Lanka.
              </p>
              
              <motion.div
                className="grid grid-cols-2 gap-6"
                variants={staggerContainer}
              >
                <motion.div 
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white rounded-xl shadow-sm"
                >
                  <div className="text-3xl font-bold text-agro-green-600 mb-1">25+</div>
                  <div className="text-agro-brown-600">Years Experience</div>
                </motion.div>
                <motion.div 
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white rounded-xl shadow-sm"
                >
                  <div className="text-3xl font-bold text-agro-green-600 mb-1">500+</div>
                  <div className="text-agro-brown-600">Partner Farmers</div>
                </motion.div>
                <motion.div 
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white rounded-xl shadow-sm"
                >
                  <div className="text-3xl font-bold text-agro-green-600 mb-1">50+</div>
                  <div className="text-agro-brown-600">Product Varieties</div>
                </motion.div>
                <motion.div 
                  variants={fadeIn}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white rounded-xl shadow-sm"
                >
                  <div className="text-3xl font-bold text-agro-green-600 mb-1">1000+</div>
                  <div className="text-agro-brown-600">Happy Customers</div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={fadeIn}
            >
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-agro-green-100 rounded-lg z-0"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-agro-brown-100 rounded-lg z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop" 
                alt="Agricultural field"
                className="rounded-xl shadow-2xl relative z-10 hover:transform hover:scale-[1.02] transition-transform duration-500"
              />
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg z-20"
                whileHover={{ 
                  scale: 1.05,
                  rotate: -2,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-2xl font-bold text-agro-green-600">100%</div>
                <div className="text-agro-brown-600">Organic Certified</div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Our Mission */}
          <motion.div 
            variants={fadeIn} 
            className="mt-24 mb-20 bg-gradient-to-r from-agro-green-50 to-agro-green-100/80 backdrop-blur-sm p-8 rounded-xl max-w-4xl mx-auto shadow-[0_15px_30px_-10px_rgba(0,0,0,0.2)] border border-agro-green-200/30"
          >
            <Badge className="mb-4 bg-gradient-to-r from-agro-green-400 to-green-500 text-white border-none px-4 py-1">
              Our Mission
            </Badge>
            <h2 className="text-3xl font-bold text-agro-green-800 mb-4">Bringing Ceylon's Finest to the World</h2>
            <p className="text-lg text-agro-green-700 leading-relaxed">
              Our mission is to deliver high-quality Sri Lankan agricultural products while supporting sustainable farming practices and fair trade with local communities. We strive to preserve traditional farming methods while embracing modern standards for quality and sustainability.
            </p>
          </motion.div>
          
          {/* Our Team */}
          <motion.div
            variants={staggerContainer} 
            className="mt-20"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-agro-brown-100 text-agro-brown-800 border-agro-brown-200">
                Our Team
              </Badge>
              <h2 className="text-3xl font-bold text-agro-green-800 mb-4">The People Behind CeyCan</h2>
              <p className="text-lg text-agro-brown-600 max-w-2xl mx-auto">
                Our dedicated team brings together expertise in agriculture, trade, and quality assurance to deliver the best products to your table.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/*
                {name: "Amal Fernando", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop"},
                {name: "Priya Mendis", role: "Head of Operations", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop"},
                {name: "David Singh", role: "Quality Assurance", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"}
              */}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
                  