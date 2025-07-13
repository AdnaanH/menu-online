import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Send } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Restaurant Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                Rasheeda Recipes
              </h3>
              <p className="text-gray-300 text-sm">Authentic Indian Cuisine</p>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Experience the rich flavors of the Levant with our traditional recipes passed down through generations, crafted with love and authentic ingredients.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' }
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center hover:from-amber-400 hover:to-orange-500 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xl font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Bogani Road</p>
                  <p className="text-gray-300 text-sm">Rasheeda Recipes</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-gray-300 text-sm">info@rasheedarecipes.com</p>
              </div>
            </div>
          </motion.div>

          {/* Opening Hours */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xl font-semibold text-white mb-4">Opening Hours</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Monday - Thursday</span>
                <span className="text-gray-300 text-sm">11:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Friday - Saturday</span>
                <span className="text-gray-300 text-sm">11:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Sunday</span>
                <span className="text-gray-300 text-sm">12:00 PM - 9:00 PM</span>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="text-xl font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for special offers and new menu items.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubscribed ? 'Subscribed!' : 'Subscribe'}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Google Maps */}
        <motion.div
          variants={itemVariants}
          className="mt-16 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="bg-gray-800 p-4">
            <h4 className="text-lg font-semibold text-white mb-2">Find Us</h4>
            <p className="text-gray-400 text-sm">Visit us at our location in the heart of the Heritage District</p>
          </div>
          <div className="h-64 bg-gray-700 relative overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4!2d-74.0059!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuMiJX!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
            />
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-gray-400 text-sm">
            © 2025 Rasheeda Recipes. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;