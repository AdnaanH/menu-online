import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types/menu';

export interface Category {
  id: string;
  key: string;
  label: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useSupabaseData = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      const items: MenuItem[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category_key,
        isVegetarian: item.is_vegetarian,
        isSpicy: item.is_spicy,
        orderIndex: item.order_index
      }));
      
      setMenuItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const maxOrder = Math.max(...menuItems.filter(i => i.category === item.category).map(i => i.orderIndex || 0), 0);
      
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          name: item.name,
          description: item.description,
          price: item.price,
          category_key: item.category,
          is_vegetarian: item.isVegetarian || false,
          is_spicy: item.isSpicy || false,
          order_index: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;
      
      const newItem: MenuItem = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category_key,
        isVegetarian: data.is_vegetarian,
        isSpicy: data.is_spicy,
        orderIndex: data.order_index
      };
      
      setMenuItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add menu item');
      throw err;
    }
  };

  const updateMenuItem = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: item.name,
          description: item.description,
          price: item.price,
          category_key: item.category,
          is_vegetarian: item.isVegetarian || false,
          is_spicy: item.isSpicy || false,
          order_index: item.orderIndex || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) throw error;
      
      setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu item');
      throw err;
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu item');
      throw err;
    }
  };

  const addCategory = async (key: string, label: string) => {
    try {
      const maxOrder = Math.max(...categories.map(c => c.order_index), 0);
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          key,
          label,
          order_index: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
      throw err;
    }
  };

  const updateCategory = async (key: string, newLabel: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          label: newLabel,
          updated_at: new Date().toISOString()
        })
        .eq('key', key);

      if (error) throw error;
      
      setCategories(prev => prev.map(c => c.key === key ? { ...c, label: newLabel } : c));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (key: string) => {
    try {
      // Move items to default category
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ category_key: 'mezze' })
        .eq('category_key', key);

      if (updateError) throw updateError;

      // Delete category
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('key', key);

      if (deleteError) throw deleteError;
      
      setCategories(prev => prev.filter(c => c.key !== key));
      setMenuItems(prev => prev.map(item => 
        item.category === key ? { ...item, category: 'mezze' } : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  };

  const updateItemOrder = async (items: MenuItem[]) => {
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        order_index: index
      }));

      for (const update of updates) {
        await supabase
          .from('menu_items')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      setMenuItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item order');
      throw err;
    }
  };

  const updateCategoryOrder = async (categories: Category[]) => {
    try {
      const updates = categories.map((category, index) => ({
        key: category.key,
        order_index: index
      }));

      for (const update of updates) {
        await supabase
          .from('categories')
          .update({ order_index: update.order_index })
          .eq('key', update.key);
      }

      setCategories(categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category order');
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchMenuItems()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
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
    updateCategoryOrder,
    refetch: () => Promise.all([fetchCategories(), fetchMenuItems()])
  };
};