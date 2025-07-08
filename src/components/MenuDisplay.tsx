import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { MenuItem } from '../types/menu';
import { Category } from '../hooks/useSupabaseData';
import SearchBar from './SearchBar';
import CollapsibleCategory from './CollapsibleCategory';
import DraggableMenuItem from './DraggableMenuItem';

interface MenuDisplayProps {
  menuItems: MenuItem[];
  categories: Record<string, string>;
  categoriesData: Category[];
  isAdmin?: boolean;
  onUpdateItemOrder?: (items: MenuItem[]) => void;
  onUpdateCategoryOrder?: (categories: Category[]) => void;
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ 
  menuItems, 
  categories, 
  categoriesData,
  isAdmin = false,
  onUpdateItemOrder,
  onUpdateCategoryOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Filter and group items
  const { filteredItems, groupedItems, filteredCategories } = useMemo(() => {
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

    return { filteredItems: filtered, groupedItems: grouped, filteredCategories: filteredCats };
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !isAdmin) return;

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

      onUpdateCategoryOrder?.(updatedCategories);
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

        onUpdateItemOrder?.(allUpdatedItems);
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

        onUpdateItemOrder?.(allUpdatedItems);
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
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-amber-700 to-orange-700 bg-clip-text text-transparent mb-6"
        >
          Our Menu
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
        >
          Discover authentic Levantine flavors prepared with traditional recipes passed down through generations, 
          crafted with the finest ingredients and served with love
        </motion.p>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search menu items and categories..."
          className="max-w-2xl mx-auto"
        />
      </motion.div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories" type="CATEGORY" isDropDisabled={!isAdmin}>
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
                    isDragDisabled={!isAdmin}
                    index={index}
                    showDragHandle={isAdmin}
                  >
                    {items.map((item, itemIndex) => (
                      <DraggableMenuItem
                        key={item.id}
                        item={item}
                        index={itemIndex}
                        isAdmin={isAdmin}
                        isDragDisabled={!isAdmin}
                      />
                    ))}
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

export default MenuDisplay;