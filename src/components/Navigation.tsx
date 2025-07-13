import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChefHat, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  currentView: 'menu' | 'add' | 'admin';
  onViewChange: (view: 'menu' | 'add' | 'admin') => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, isAuthenticated, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleViewChange = (view: 'menu' | 'add' | 'admin') => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white shadow-lg border-b border-amber-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-3 flex-shrink-0"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg"
            >
              <ChefHat className="w-6 h-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              >
                Rasheeda Recipes
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xs lg:text-sm text-gray-600"
              >
                Authentic Cuisine
              </motion.p>
            </div>
            <div className="sm:hidden">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              >
                Rasheeda Recipes
              </motion.h1>
            </div>
          </motion.div>
          
          {/* Desktop Navigation */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden md:flex items-center space-x-2 lg:space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange('menu')}
              className={`px-4 lg:px-6 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base ${
                currentView === 'menu'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              Menu
            </motion.button>
            {isAuthenticated && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewChange('admin')}
                  className={`px-4 lg:px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm lg:text-base ${
                    currentView === 'admin'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden lg:inline">Manage</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewChange('add')}
                  className={`px-4 lg:px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm lg:text-base ${
                    currentView === 'add'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden lg:inline">Add</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`px-4 lg:px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm lg:text-base ${
                    false ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </motion.button>
              </>
            )}
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange('admin')}
                className="px-4 lg:px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm lg:text-base text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden lg:inline">Admin Login</span>
              </motion.button>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-amber-100 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewChange('menu')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    currentView === 'menu'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  Menu
                </motion.button>
                {isAuthenticated && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewChange('admin')}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                        currentView === 'admin'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Manage</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewChange('add')}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                        currentView === 'add'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </motion.button>
                  </>
                )}
                {!isAuthenticated && (
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewChange('admin')}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin Login</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;