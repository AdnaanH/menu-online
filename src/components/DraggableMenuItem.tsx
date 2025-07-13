import React from 'react';
import { motion } from 'framer-motion';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Edit3, Trash2, Leaf, Flame } from 'lucide-react';
import { MenuItem } from '../types/menu';

interface DraggableMenuItemProps {
  item: MenuItem;
  index: number;
  isAdmin?: boolean;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (itemId: string) => void;
  isDragDisabled?: boolean;
}

const DraggableMenuItem: React.FC<DraggableMenuItemProps> = ({
  item,
  index,
  isAdmin = false,
  onEdit,
  onDelete,
  isDragDisabled = false
}) => {
  const menuItemContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md ${
        isAdmin && !isDragDisabled ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {isAdmin && !isDragDisabled && (
            <div className="cursor-grab active:cursor-grabbing pt-1 opacity-40 hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900 leading-tight">{item.name}</h4>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent ml-4 flex-shrink-0">
                KES{item.price.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
            <div className="flex items-center space-x-2">
              {item.isVegetarian && (
                <span className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  <Leaf className="w-3 h-3" />
                  <span>Vegetarian</span>
                </span>
              )}
              {item.isSpicy && (
                <span className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                  <Flame className="w-3 h-3" />
                  <span>Spicy</span>
                </span>
              )}
            </div>
          </div>
        </div>
        {isAdmin && onEdit && onDelete && (
          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit item"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (isAdmin && !isDragDisabled) {
    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`transition-all duration-200 ${
              snapshot.isDragging ? 'scale-105 shadow-2xl rotate-2 z-50' : ''
            }`}
            style={{
              ...provided.draggableProps.style,
              transform: snapshot.isDragging 
                ? `${provided.draggableProps.style?.transform} rotate(2deg)` 
                : provided.draggableProps.style?.transform
            }}
          >
            {menuItemContent}
          </div>
        )}
      </Draggable>
    );
  }

  return menuItemContent;
};

export default DraggableMenuItem;