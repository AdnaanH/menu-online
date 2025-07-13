import React from 'react';
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
  isAdmin?: boolean;
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
  showDragHandle = false,
  isAdmin = false
}) => {
  const categoryContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-8"
    >
      <motion.div
        whileHover={{ scale: 1.005 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <motion.button
          onClick={onToggle}
          whileHover={{ backgroundColor: '#fef3c7' }}
          whileTap={{ scale: 0.995 }}
          className="w-full px-8 py-6 flex items-center justify-between text-left transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            {showDragHandle && !isDragDisabled && (
              <div className="cursor-grab active:cursor-grabbing opacity-40 hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 font-medium">{itemCount} items</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center space-x-2"
          >
            {isExpanded ? (
              <ChevronDown className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronRight className="w-6 h-6 text-gray-600" />
            )}
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-100">
                {isAdmin ? (
                  <Droppable droppableId={categoryKey} type="MENU_ITEM" isDropDisabled={isDragDisabled}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-6 transition-all duration-300 ${
                          snapshot.isDraggingOver ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="space-y-4">
                          {children}
                        </div>
                        {provided.placeholder}
                        {snapshot.isDraggingOver && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-4 p-4 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50 text-center"
                          >
                            <p className="text-amber-700 font-medium">Drop item here</p>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </Droppable>
                ) : (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {children}
                    </div>
                  </div>
                )}
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
            className={`transition-all duration-300 ${
              snapshot.isDragging ? 'scale-105 shadow-2xl rotate-1 z-50' : ''
            }`}
            style={{
              ...provided.draggableProps.style,
              transform: snapshot.isDragging 
                ? `${provided.draggableProps.style?.transform} rotate(1deg)` 
                : provided.draggableProps.style?.transform
            }}
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