import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Edit3, Trash2, Save, X, Plus, Tag } from 'lucide-react';
import { MenuItem } from '../types/menu';
import { Category } from '../hooks/useSupabaseData';
import SearchBar from './SearchBar';
import CollapsibleCategory from './CollapsibleCategory';
import DraggableMenuItem from './DraggableMenuItem';

interface AdminManagementProps {
  menuItems: MenuItem[];
  categories: Record<string, string>;
  categoriesData: Category[];
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onAddCategory: (key: string, label: string) => void;
  onEditCategory: (key: string, newLabel: string) => void;
  onDeleteCategory: (key: string) => void;
  onUpdateItemOrder: (items: MenuItem[]) => void;
  onUpdateCategoryOrder: (categories: Category[]) => void;
}

const AdminManagement: React.FC<AdminManagementProps> = ({ 
  menuItems, 
  categories,
  categoriesData,
  onEditItem, 
  onDeleteItem,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onUpdateItemOrder,
  onUpdateCategoryOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState<MenuItem | null>(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState('');
  const [newCategory, setNewCategory] = useState({ key: '', label: '' });

  // Filter and group items
  const { groupedItems, filteredCategories } = useMemo(() => {
    const filtered = menuItems.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const matchesItem = item.name.toLowerCase().includes(searchLower) ||
                         item.description.toLowerCase().includes(searchLower);
      const matchesCategory = categories[item.category]?.toLowerCase().includes(searchLower);
      return matchesItem || matchesCategory;
    });

    const grouped = filtered.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    // Sort items within each category by order_index
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    });

    const filteredCats = categoriesData
      .filter(cat => grouped[cat.key] && grouped[cat.key].length > 0)
      .sort((a, b) => a.order_index - b.order_index);

    return { groupedItems: grouped, filteredCategories: filteredCats };
  }, [menuItems, categories, categoriesData, searchTerm]);

  // Auto-expand categories when searching
  React.useEffect(() => {
    if (searchTerm) {
      const categoriesToExpand = new Set(filteredCategories.map(cat => cat.key));
      setExpandedCategories(categoriesToExpand);
    } else {
      setExpandedCategories(new Set());
    }
  }, [searchTerm, filteredCategories]);

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
      }
      return newSet;
    });
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setEditForm({ ...item });
  };

  const handleSave = async () => {
    if (editForm) {
      try {
        await onEditItem(editForm);
        setEditingItem(null);
        setEditForm(null);
      } catch (error) {
        console.error('Failed to update item:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditForm(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editForm) return;
    
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm(prev => prev ? { ...prev, [name]: checked } : null);
    } else if (name === 'price') {
      setEditForm(prev => prev ? { ...prev, [name]: parseFloat(value) || 0 } : null);
    } else {
      setEditForm(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await onDeleteItem(itemId);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const handleEditCategory = (key: string) => {
    setEditingCategory(key);
    setCategoryForm(categories[key]);
  };

  const handleSaveCategory = async () => {
    if (editingCategory && categoryForm) {
      try {
        await onEditCategory(editingCategory, categoryForm);
        setEditingCategory(null);
        setCategoryForm('');
      } catch (error) {
        console.error('Failed to update category:', error);
      }
    }
  };

  const handleDeleteCategory = async (key: string) => {
    const itemCount = groupedItems[key]?.length || 0;
    const message = itemCount > 0 
      ? `Are you sure you want to delete this category? ${itemCount} items will be moved to "Mezze & Appetizers".`
      : 'Are you sure you want to delete this category?';
    
    if (window.confirm(message)) {
      try {
        await onDeleteCategory(key);
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleAddNewCategory = async () => {
    if (newCategory.key && newCategory.label) {
      try {
        await onAddCategory(newCategory.key, newCategory.label);
        setNewCategory({ key: '', label: '' });
      } catch (error) {
        console.error('Failed to add category:', error);
      }
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'CATEGORY') {
      const newCategories = Array.from(categoriesData);
      const [reorderedCategory] = newCategories.splice(source.index, 1);
      newCategories.splice(destination.index, 0, reorderedCategory);

      // Update order_index for all categories
      const updatedCategories = newCategories.map((cat, index) => ({
        ...cat,
        order_index: index
      }));

      onUpdateCategoryOrder(updatedCategories);
    } else if (type === 'MENU_ITEM') {
      const sourceCategory = source.droppableId;
      const destCategory = destination.droppableId;

      if (sourceCategory === destCategory) {
        // Reordering within the same category
        const categoryItems = [...groupedItems[sourceCategory]];
        const [reorderedItem] = categoryItems.splice(source.index, 1);
        categoryItems.splice(destination.index, 0, reorderedItem);

        // Update order_index for items in this category
        const updatedItems = categoryItems.map((item, index) => ({
          ...item,
          orderIndex: index
        }));

        // Update all menu items with new order
        const allUpdatedItems = menuItems.map(item => {
          if (item.category === sourceCategory) {
            const updatedItem = updatedItems.find(ui => ui.id === item.id);
            return updatedItem || item;
          }
          return item;
        });

        onUpdateItemOrder(allUpdatedItems);
      } else {
        // Moving between categories
        const sourceItems = [...groupedItems[sourceCategory]];
        const destItems = [...(groupedItems[destCategory] || [])];
        
        const [movedItem] = sourceItems.splice(source.index, 1);
        movedItem.category = destCategory;
        destItems.splice(destination.index, 0, movedItem);

        // Update order_index for both categories
        const updatedSourceItems = sourceItems.map((item, index) => ({
          ...item,
          orderIndex: index
        }));
        const updatedDestItems = destItems.map((item, index) => ({
          ...item,
          orderIndex: index
        }));

        // Update all menu items
        const allUpdatedItems = menuItems.map(item => {
          if (item.category === sourceCategory) {
            const updatedItem = updatedSourceItems.find(ui => ui.id === item.id);
            return updatedItem || item;
          } else if (item.category === destCategory || item.id === movedItem.id) {
            const updatedItem = updatedDestItems.find(ui => ui.id === item.id);
            return updatedItem || item;
          }
          return item;
        });

        onUpdateItemOrder(allUpdatedItems);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-amber-700 to-orange-700 bg-clip-text text-transparent mb-6">
          Menu Management
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Manage your menu items and categories with ease - edit details, update prices, and organize your offerings
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search items and categories..."
            className="max-w-md"
          />
          
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCategoryManager(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
          >
            <Tag className="w-5 h-5" />
            <span>Manage Categories</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Category Management Modal */}
      <AnimatePresence>
        {showCategoryManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCategoryManager(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Category Management</h3>
              
              {/* Add New Category */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={newCategory.key}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, key: e.target.value.toLowerCase().replace(/\s+/g, '') }))}
                    placeholder="Category key (e.g., soups)"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={newCategory.label}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Category label (e.g., Soups & Broths)"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddNewCategory}
                  disabled={!newCategory.key || !newCategory.label}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </motion.button>
              </div>

              {/* Existing Categories */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Existing Categories</h4>
                {categoriesData.map((category) => (
                  <div key={category.key} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {editingCategory === category.key ? (
                          <div className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={categoryForm}
                              onChange={(e) => setCategoryForm(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleSaveCategory}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setEditingCategory(null)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ) : (
                          <div>
                            <h5 className="font-medium text-gray-900">{category.label}</h5>
                            <p className="text-sm text-gray-500">
                              Key: {category.key} • {groupedItems[category.key]?.length || 0} items
                            </p>
                          </div>
                        )}
                      </div>
                      {editingCategory !== category.key && (
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditCategory(category.key)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                          {category.key !== 'mezze' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteCategory(category.key)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCategoryManager(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Items by Category with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories" type="CATEGORY">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {filteredCategories.map((category, index) => {
                const items = groupedItems[category.key] || [];
                const isExpanded = expandedCategories.has(category.key);

                return (
                  <CollapsibleCategory
                    key={category.key}
                    title={category.label}
                    categoryKey={category.key}
                    itemCount={items.length}
                    isExpanded={isExpanded}
                    onToggle={() => toggleCategory(category.key)}
                    index={index}
                    showDragHandle={true}
                  >
                    {editingItem && items.some(item => item.id === editingItem.id) ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-lg border border-gray-200 p-6 mb-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={editForm?.name || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              name="price"
                              value={editForm?.price || 0}
                              onChange={handleInputChange}
                              step="0.01"
                              min="0"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={editForm?.description || ''}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                          />
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Category
                            </label>
                            <select
                              name="category"
                              value={editForm?.category || ''}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                              {Object.entries(categories).map(([key, label]) => (
                                <option key={key} value={key}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center space-x-4 pt-6">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="isVegetarian"
                                checked={editForm?.isVegetarian || false}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                name="isSpicy"
                                checked={editForm?.isSpicy || false}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Spicy</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancel}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center space-x-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      items.map((item, itemIndex) => (
                        <DraggableMenuItem
                          key={item.id}
                          item={item}
                          index={itemIndex}
                          isAdmin={true}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </CollapsibleCategory>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {filteredCategories.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or browse all categories
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminManagement;