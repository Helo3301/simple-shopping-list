import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../services/database';
import type { ShoppingList, ShoppingItem, Department } from '../types/models';

type View = 'lists' | 'shopping' | 'collections' | 'stores' | 'staples';

interface AppContextType {
  // View management
  currentView: View;
  setCurrentView: (view: View) => void;

  // Lists
  lists: ShoppingList[];
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;
  createList: (name: string) => Promise<void>;
  deleteList: (id: string) => Promise<void>;

  // Items
  items: ShoppingItem[];
  addItem: (name: string, departmentId: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;

  // Departments
  departments: Department[];

  // Loading state
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>('lists');
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load items when active list changes
  useEffect(() => {
    if (activeListId) {
      loadItems(activeListId);
    } else {
      setItems([]);
    }
  }, [activeListId]);

  async function loadData() {
    try {
      const [loadedLists, loadedDepartments] = await Promise.all([
        db.shoppingLists.orderBy('createdAt').reverse().toArray(),
        db.departments.orderBy('sortOrder').toArray(),
      ]);

      setLists(loadedLists);
      setDepartments(loadedDepartments);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadItems(listId: string) {
    try {
      const loadedItems = await db.items
        .where('listId')
        .equals(listId)
        .toArray();
      setItems(loadedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  async function createList(name: string) {
    try {
      const newList: ShoppingList = {
        id: crypto.randomUUID(),
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await db.shoppingLists.add(newList);
      setLists(prev => [newList, ...prev]);
      setActiveListId(newList.id);
      setCurrentView('shopping');
    } catch (error) {
      console.error('Error creating list:', error);
    }
  }

  async function deleteList(id: string) {
    try {
      // Delete all items in the list
      await db.items.where('listId').equals(id).delete();
      // Delete the list
      await db.shoppingLists.delete(id);

      setLists(prev => prev.filter(list => list.id !== id));

      if (activeListId === id) {
        setActiveListId(null);
        setCurrentView('lists');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  }

  async function addItem(name: string, departmentId: string) {
    if (!activeListId) return;

    try {
      const newItem: ShoppingItem = {
        id: crypto.randomUUID(),
        listId: activeListId,
        name,
        departmentId,
        isChecked: false,
        checkedAt: null,
        createdAt: Date.now(),
      };

      await db.items.add(newItem);
      setItems(prev => [...prev, newItem]);

      // Update recent items
      const existing = await db.recentItems.where('name').equals(name).first();
      if (existing) {
        await db.recentItems.update(existing.id, {
          useCount: existing.useCount + 1,
          lastUsedAt: Date.now(),
          departmentId,
        });
      } else {
        await db.recentItems.add({
          id: crypto.randomUUID(),
          name,
          departmentId,
          useCount: 1,
          lastUsedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  async function toggleItem(id: string) {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      const newCheckedState = !item.isChecked;
      await db.items.update(id, {
        isChecked: newCheckedState,
        checkedAt: newCheckedState ? Date.now() : null,
      });

      setItems(prev =>
        prev.map(i =>
          i.id === id
            ? { ...i, isChecked: newCheckedState, checkedAt: newCheckedState ? Date.now() : null }
            : i
        )
      );
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  }

  async function deleteItem(id: string) {
    try {
      await db.items.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  const value: AppContextType = {
    currentView,
    setCurrentView,
    lists,
    activeListId,
    setActiveListId,
    createList,
    deleteList,
    items,
    addItem,
    toggleItem,
    deleteItem,
    departments,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
