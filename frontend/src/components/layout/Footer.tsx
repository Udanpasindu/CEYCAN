import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-agro-green-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-agro-green-600 text-white p-3 rounded-lg mr-3">
              <img src="/favicon.ico" alt="Ceycan Agro" className="h-8 w-8" />
            </div>
            <span className="font-bold text-3xl">CeyCan Agro</span>
          </div>
          <p className="text-agro-green-200 mb-6 max-w-2xl mx-auto">
            Your trusted partner for premium agricultural products. From farm to table, we ensure quality and freshness in every product.
          </p>
          
          <div className="flex justify-center space-x-6 mb-8">
            {['#hero', '#categories', '#about', '#contact'].map((link, i) => (
              <a 
                key={i} 
                href={link} 
                className="text-agro-green-300 hover:text-white transition-colors"
              >
                {link.replace('#', '').charAt(0).toUpperCase() + link.replace('#', '').slice(1)}
              </a>
            ))}
          </div>
          
          <div className="border-t border-agro-green-700 pt-6">
            <p className="text-agro-green-300">
              © {currentYear} CeyCan Agro. All rights reserved. | Bringing Sri Lankan agriculture to the world.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
