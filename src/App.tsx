import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import MenuDisplay from './components/MenuDisplay';
import AddMenuItem from './components/AddMenuItem';
import AdminManagement from './components/AdminManagement';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';
import { useSupabaseData } from './hooks/useSupabaseData';

function App() {
  const [currentView, setCurrentView] = useState<'menu' | 'add' | 'admin'>('menu');
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

  // Convert categories array to object for compatibility
  const categoriesObject = categories.reduce((acc, cat) => {
    acc[cat.key] = cat.label;
    return acc;
  }, {} as Record<string, string>);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
    >
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