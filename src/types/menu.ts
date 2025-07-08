export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  orderIndex?: number;
}

export type MenuCategory = 'mezze' | 'mains' | 'salads' | 'desserts' | 'beverages' | 'bread';

export const categoryLabels: Record<MenuCategory, string> = {
  mezze: 'Mezze & Appetizers',
  mains: 'Main Courses',
  salads: 'Fresh Salads',
  desserts: 'Traditional Desserts',
  beverages: 'Beverages',
  bread: 'Bread & Flatbreads'
};

export interface CategoryManagement {
  categories: Record<MenuCategory, string>;
  onAddCategory: (key: string, label: string) => void;
  onEditCategory: (key: MenuCategory, newLabel: string) => void;
  onDeleteCategory: (key: MenuCategory) => void;
}