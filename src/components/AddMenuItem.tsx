import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, ChefHat, Tag, Save, X } from 'lucide-react';
import { MenuItem } from '../types/menu';

interface AddMenuItemProps {
  onAddItem: (item: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
  categories: Record<string, string>;
  onAddCategory: (key: string, label: string) => Promise<any>;
}

const AddMenuItem: React.FC<AddMenuItemProps> = ({ onAddItem, categories, onAddCategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: Object.keys(categories)[0] || 'mezze',
    isVegetarian: false,
    isSpicy: false
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ key: '', label: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newItem: Omit<MenuItem, 'id'> = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await onAddItem(newItem);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: Object.keys(categories)[0] || 'mezze',
          isVegetarian: false,
          isSpicy: false
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddNewCategory = async () => {
    if (newCategory.key && newCategory.label) {
      try {
        await onAddCategory(newCategory.key, newCategory.label);
        setFormData(prev => ({ ...prev, category: newCategory.key }));
        setNewCategory({ key: '', label: '' });
        setShowAddCategory(false);
      } catch (error) {
        console.error('Failed to add category:', error);
      }
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-12 text-center shadow-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-green-800 mb-3"
            >
              Item Added Successfully!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-green-700 text-lg"
            >
              Your new menu item has been added to the menu.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <ChefHat className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Add New Menu Item
              </h2>
              <p className="text-gray-600 text-lg">Create a new delicious addition to our menu</p>
            </motion.div>

            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10"
            >
              <div className="space-y-8">
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                    Dish Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-900 disabled:opacity-50"
                    placeholder="Enter dish name"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-900 resize-none disabled:opacity-50"
                    placeholder="Describe the dish and its ingredients"
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-3">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      step="0.01"
                      min="0"
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-900 disabled:opacity-50"
                      placeholder="0.00"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
                      Category
                    </label>
                    <div className="flex space-x-2">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-900 disabled:opacity-50"
                      >
                        {Object.entries(categories).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddCategory(true)}
                        disabled={isSubmitting}
                        className="px-4 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                        title="Add new category"
                      >
                        <Tag className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>

                {/* Add Category Modal */}
                <AnimatePresence>
                  {showAddCategory && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                      onClick={() => setShowAddCategory(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category Key (lowercase, no spaces)
                            </label>
                            <input
                              type="text"
                              value={newCategory.key}
                              onChange={(e) => setNewCategory(prev => ({ ...prev, key: e.target.value.toLowerCase().replace(/\s+/g, '') }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              placeholder="e.g., soups"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category Label
                            </label>
                            <input
                              type="text"
                              value={newCategory.label}
                              onChange={(e) => setNewCategory(prev => ({ ...prev, label: e.target.value }))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              placeholder="e.g., Soups & Broths"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowAddCategory(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </motion.button>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddNewCategory}
                            disabled={!newCategory.key || !newCategory.label}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Save className="w-4 h-4" />
                            <span>Add Category</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="isVegetarian"
                      checked={formData.isVegetarian}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 transition-all duration-200 disabled:opacity-50"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">Vegetarian</span>
                  </motion.label>

                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="isSpicy"
                      checked={formData.isSpicy}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500 transition-all duration-200 disabled:opacity-50"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">Spicy</span>
                  </motion.label>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Adding Item...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add Menu Item</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddMenuItem;