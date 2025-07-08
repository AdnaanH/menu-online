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
  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3 transition-all duration-200 ${
            snapshot.isDragging ? 'shadow-xl scale-105 rotate-2' : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {isAdmin && !isDragDisabled && (
                <div
                  {...provided.dragHandleProps}
                  className="cursor-grab active:cursor-grabbing pt-1"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                  <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    ${item.price}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex items-center space-x-2">
                  {item.isVegetarian && (
                    <span className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Leaf className="w-3 h-3" />
                      <span>Vegetarian</span>
                    </span>
                  )}
                  {item.isSpicy && (
                    <span className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Flame className="w-3 h-3" />
                      <span>Spicy</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            {isAdmin && onEdit && onDelete && (
              <div className="flex items-center space-x-2 ml-4">
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
      )}
    </Draggable>
  );
};

export default DraggableMenuItem;