import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Printer, Clock, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContactInfo } from '@/hooks/useContactInfo';

const ContactUs = () => {
  // Fetch contact information using the hook instead of static data
  const { contactInfo, loading, error, refetch, lastUpdate } = useContactInfo();

  // Log updates for debugging
  useEffect(() => {
    if (contactInfo) {
      console.log('Contact page received updated contact info:', contactInfo);
    }
  }, [contactInfo]);

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

  // Fallback data when actual data is loading or has an error
  const fallbackInfo = {
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

  // Use the fetched data if available, otherwise use fallback
  const displayInfo = contactInfo ? {
    ...fallbackInfo,  // Start with fallback data
    ...contactInfo,   // Override with API data
    // Ensure businessHours exists with required properties
    businessHours: {
      ...fallbackInfo.businessHours,
      ...(contactInfo.businessHours || {})
    }
  } : fallbackInfo;

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-800">
      {/* Navigation Bar */}
      <NavBar activeSection="contact" contactInfo={displayInfo} />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-agro-green-900 via-agro-green-800 to-green-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1200)`, backgroundPosition: 'center' }}
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
              Get In Touch
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Have questions about our products or need assistance? We're here to help.
            </p>
            {/* Show loading indicator */}
            {loading && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span className="text-white/80 text-sm">Updating contact information...</span>
              </div>
            )}
            {/* Add manual refresh button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-white/70 hover:text-white"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-agro-green-800 via-agro-green-700 to-green-900"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-yellow-300/30 rounded-full blur-lg animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-green-300/30 rounded-full blur-lg animate-float animation-delay-1000"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="leafPattern" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(45)">
                <path d="M10,10 Q25,0 40,10 T70,10 Q85,0 100,10" stroke="white" fill="none" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leafPattern)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Contact Information</h2>
            <p className="text-xl text-agro-green-100 max-w-2xl mx-auto">
              Feel free to reach out to us using any of the following methods. We'll get back to you as soon as possible.
            </p>
            {lastUpdate && (
              <p className="text-sm text-agro-green-200/60 mt-2">
                Last updated: {new Date(lastUpdate).toLocaleString()}
              </p>
            )}
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
                    <MapPin className="h-6 w-6 text-agro-green-300" />
                  </div>
                  <h3 className="font-semibold mb-2">Our Location</h3>
                  <p className="text-agro-green-100 leading-relaxed">{displayInfo.address}</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
                    <Phone className="h-6 w-6 text-agro-green-300" />
                  </div>
                  <h3 className="font-semibold mb-2">Phone & Fax</h3>
                  <div className="space-y-2">
                    <a href={`tel:${displayInfo.phone}`} className="text-agro-green-100 hover:text-white transition-colors block">
                      Phone: {displayInfo.phone}
                    </a>
                    <p className="text-agro-green-100 flex items-center justify-center gap-1">
                      <Printer className="h-4 w-4" /> Fax: {displayInfo.fax}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
                    <Mail className="h-6 w-6 text-agro-green-300" />
                  </div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-agro-green-200 mb-2">General Inquiries & Partnerships</p>
                  <a href={`mailto:${displayInfo.email}`} className="text-agro-green-100 hover:text-white transition-colors block">
                    {displayInfo.email}
                  </a>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeIn}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 h-full">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex p-3 rounded-full bg-white/10 mb-4">
                    <Clock className="h-6 w-6 text-agro-green-300" />
                  </div>
                  <h3 className="font-semibold mb-3">Business Hours</h3>
                  <p className="text-agro-green-100 mb-2">
                    {displayInfo.businessHours?.weekdays || "Monday – Friday: 9AM – 6PM"}
                  </p>
                  <p className="text-agro-green-100">
                    {displayInfo.businessHours?.weekend || "Saturday - Sunday: 11AM – 3PM"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-8 text-center">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 inline-block p-6">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4 justify-center">
                {Object.entries(displayInfo.social || {}).map(([platform, url]) => {
                  const Icon = { facebook: Facebook, instagram: Instagram, twitter: Twitter, linkedin: Linkedin }[platform];
                  return (
                    <motion.a 
                      key={platform}
                      href={typeof url === 'string' ? url : '#'} 
                      target="_blank" 
                      rel="noreferrer"
                      whileHover={{ scale: 1.2, rotate: platform === 'twitter' || platform === 'facebook' ? 10 : -10 }}
                      className="bg-white/10 p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </motion.a>
                  );
                })}
              </div>
            </Card>
          </motion.div>
          
          {/* Map Section */}
          <motion.div 
            className="mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[16/7]">
                  <iframe
                    title="CeyCan Agro Location"
                    className="w-full h-full"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2878.029759099188!2d-79.2368310232197!3d43.8091656437529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d0f5fb4c152f%3A0x47b47371246ac1bb!2s465%20Milner%20Ave%20Unit%204%2C%20Scarborough%2C%20ON%20M1B%202K4%2C%20Canada!5e0!3m2!1sen!2sus!4v1707846720250!5m2!1sen!2sus"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Business Hours */}
          <motion.div 
            className="mt-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Business Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-medium text-agro-green-300 mb-2">Monday - Friday</h3>
                  <p className="text-white text-xl font-semibold">
                    {displayInfo.businessHours?.weekdays?.split(":")[1]?.trim() || "9:00 AM - 6:00 PM"}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-medium text-agro-green-300 mb-2">Saturday - Sunday</h3>
                  <p className="text-white text-xl font-semibold">
                    {displayInfo.businessHours?.weekend?.split(":")[1]?.trim() || "11:00 AM - 3:00 PM"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-agro-green-100 text-agro-green-800 border-agro-green-200">
              Questions & Answers
            </Badge>
            <h2 className="text-3xl font-bold text-agro-green-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-agro-brown-600 max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, and more.
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              { 
                question: 'How can I place a bulk order?', 
                answer: 'For bulk orders, please contact us directly through email or phone. Our team will provide you with a custom quote and help you through the ordering process.'
              },
              { 
                question: 'Do you ship internationally?', 
                answer: 'Yes, we ship to selected countries worldwide. Shipping costs and delivery times vary by location. Please contact us for specific shipping information to your country.'
              },
              { 
                question: 'Are your products organic?', 
                answer: 'Many of our products are certified organic. Each product page specifies whether the item is organic or conventionally grown. We\'re committed to sustainable and ethical farming practices.'
              },
              { 
                question: 'What payment methods do you accept?', 
                answer: 'We accept credit/debit cards, PayPal, and bank transfers for online orders. For bulk orders, we can also arrange other payment methods.'
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-medium text-agro-green-700 mb-3">{item.question}</h3>
                <p className="text-agro-brown-600">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUs;
