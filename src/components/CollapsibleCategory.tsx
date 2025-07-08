import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface CollapsibleCategoryProps {
  title: string;
  categoryKey: string;
  itemCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isDragDisabled?: boolean;
  index?: number;
  showDragHandle?: boolean;
}

const CollapsibleCategory: React.FC<CollapsibleCategoryProps> = ({
  title,
  categoryKey,
  itemCount,
  isExpanded,
  onToggle,
  children,
  isDragDisabled = false,
  index = 0,
  showDragHandle = false
}) => {
  const categoryContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <motion.button
          onClick={onToggle}
          whileHover={{ backgroundColor: '#fef3c7' }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-4 flex items-center justify-between text-left transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            {showDragHandle && !isDragDisabled && (
              <div className="cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{itemCount} items</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100">
                <Droppable droppableId={categoryKey} type="MENU_ITEM">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 transition-colors duration-200 ${
                        snapshot.isDraggingOver ? 'bg-amber-50' : 'bg-gray-50'
                      }`}
                    >
                      {children}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );

  if (showDragHandle && !isDragDisabled) {
    return (
      <Draggable draggableId={categoryKey} index={index} isDragDisabled={isDragDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`transition-transform duration-200 ${
              snapshot.isDragging ? 'scale-105 shadow-xl' : ''
            }`}
          >
            {categoryContent}
          </div>
        )}
      </Draggable>
    );
  }

  return categoryContent;
};

export default CollapsibleCategory;