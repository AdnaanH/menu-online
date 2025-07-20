import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import MenuDisplay from './components/MenuDisplay';
import AddMenuItem from './components/AddMenuItem';
import AdminManagement from './components/AdminManagement';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';
import { useSupabaseData } from './hooks/useSupabaseData';

// Popup component for meal preparation times
const PrepTimePopup: React.FC<{
  categories: { key: string; label: string; prepTime?: string }[];
  onClose: () => void;
}> = ({ categories, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.3 }}
      className="fixed top-16 lg:left-1/3 left-0 z-50 -translate-x-1/2 bg-white shadow-2xl rounded-xl px-4 sm:px-6 py-5 border border-amber-200 w-[95vw] max-w-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center lg:justify-between justify-start gap-16 mb-2">
        <h3 className="text-lg font-semibold text-amber-700 flex items-center gap-2">
          <span className=" w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center mr-1">⏱️</span>
          Meal Preparation Times
        </h3>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-gray-400 hover:text-amber-600 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l8 8M14 6l-8 8"/>
          </svg>
        </button>
      </div>
      <ul className="divide-y divide-amber-100">
        {categories.map(cat => (
          <li key={cat.key} className="py-2 flex justify-between items-center">
            <span className="font-medium text-gray-800">{cat.label}</span>
            <span className="text-sm text-amber-600 font-semibold">
              {cat.prepTime || '10-20 min'}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-gray-500 text-center">
        Actual times may vary based on order volume.
      </p>
    </motion.div>
  </AnimatePresence>
);

function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'add' | 'admin'>('menu');
  const [showPrepPopup, setShowPrepPopup] = useState(true);
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth();

  const {
    menuItems,
    categories,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory,
    updateItemOrder,
    updateCategoryOrder
  } = useSupabaseData();

  // Show popup every time user navigates to menu
  React.useEffect(() => {
    if (currentView === 'menu') setShowPrepPopup(true);
  }, [currentView]);

  // Show login form only when trying to access admin features without authentication
  if (!isAuthenticated && (currentView === 'add' || currentView === 'admin')) {
    return <LoginForm onLogin={login} isLoading={authLoading} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Menu</h2>
          <p className="text-gray-600">Please wait while we fetch the latest data...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please make sure Supabase is properly configured and try again.
          </p>
        </motion.div>
      </div>
    );
  }

  const categoriesObject = categories.reduce((acc, cat) => {
    acc[cat.key] = cat.label;
    return acc;
  }, {} as Record<string, string>);

  const categoriesWithPrep = categories.map(cat => ({
    ...cat,
    prepTime: (
      cat.label.toLowerCase().includes('starter') ? '10 min' :
      cat.label.toLowerCase().includes('main') ? '20-30 min' :
      cat.label.toLowerCase().includes('dessert') ? '8-15 min' :
      '10-20 min'
    )
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
    >
      {/* Preparation Time Popup */}
      <AnimatePresence>
        {showPrepPopup && currentView === 'menu' && (
          <PrepTimePopup
            categories={categoriesWithPrep}
            onClose={() => setShowPrepPopup(false)}
          />
        )}
      </AnimatePresence>

      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      
      <main className="min-h-screen">
        {currentView === 'menu' ? (
          <MenuDisplay 
            menuItems={menuItems} 
            categories={categoriesObject}
            categoriesData={categories}
            isAdmin={false}
            onUpdateItemOrder={updateItemOrder}
            onUpdateCategoryOrder={updateCategoryOrder}
          />
        ) : currentView === 'add' && isAuthenticated ? (
          <AddMenuItem 
            onAddItem={addMenuItem} 
            categories={categoriesObject}
            onAddCategory={addCategory}
          />
        ) : currentView === 'admin' && isAuthenticated ? (
          <AdminManagement 
            menuItems={menuItems}
            categories={categoriesObject}
            categoriesData={categories}
            onEditItem={updateMenuItem}
            onDeleteItem={deleteMenuItem}
            onAddCategory={addCategory}
            onEditCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            onUpdateItemOrder={updateItemOrder}
            onUpdateCategoryOrder={updateCategoryOrder}
          />
        ) : (
          // Fallback to menu if trying to access admin features without auth
          <MenuDisplay 
            menuItems={menuItems} 
            categories={categoriesObject}
            categoriesData={categories}
            isAdmin={false}
            onUpdateItemOrder={updateItemOrder}
            onUpdateCategoryOrder={updateCategoryOrder}
          />
        )}
      </main>

      <Footer />
    </motion.div>
  );
}

export default App;