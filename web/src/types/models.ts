// Type definitions for Simple Shopping List

export interface Department {
  id: string;
  name: string;
  icon: string; // emoji
  color: string; // hex color
  sortOrder: number;
  isDefault: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface ShoppingItem {
  id: string;
  listId: string; // foreign key to ShoppingList
  name: string;
  departmentId: string; // foreign key to Department
  isChecked: boolean;
  checkedAt: number | null; // timestamp
  createdAt: number; // timestamp
}

export interface RecentItem {
  id: string;
  name: string;
  departmentId: string; // foreign key to Department
  useCount: number;
  lastUsedAt: number; // timestamp
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  emoji?: string; // Visual identifier (🍞, 🌮, etc.)
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface CollectionItem {
  id: string;
  collectionId: string; // foreign key to Collection
  name: string;
  departmentId: string; // foreign key to Department
  quantity?: string;
  notes?: string;
  sortOrder: number;
}

export interface Store {
  id: string;
  name: string; // "Kroger - Main Street"
  chain?: string; // "Kroger"
  address?: string;
  emoji?: string; // 🏪
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  isActive: boolean; // User's primary store
}

export interface StoreLayout {
  id: string;
  storeId: string; // foreign key to Store
  departmentId: string; // foreign key to Department
  aisleNumber?: string; // "Aisle 3", "Aisle 12", etc.
  section?: string; // "Left side", "End cap", etc.
  sortOrder: number; // Order you encounter while shopping
}

// Smart Suggestions - Staples (manually flagged items)
export interface Staple {
  id: string;
  name: string;
  departmentId: string; // foreign key to Department
  frequency: 'always' | 'weekly' | 'biweekly' | 'monthly'; // How often to remind
  lastPurchased?: number; // timestamp of last purchase
  createdAt: number; // timestamp
}

// Smart Suggestions - Item Pairs (co-occurrence tracking)
export interface ItemPair {
  id: string;
  item1: string; // Item name (normalized/lowercase)
  item2: string; // Item name (normalized/lowercase)
  count: number; // How many times bought together
  lastSeen: number; // timestamp
}

// Export/Import format
export interface ExportData {
  version: string;
  exportedAt: string; // ISO 8601 date string
  departments: Department[];
  shoppingLists: ShoppingList[];
  items: ShoppingItem[];
  recentItems: RecentItem[];
  collections?: Collection[];
  collectionItems?: CollectionItem[];
  stores?: Store[];
  storeLayouts?: StoreLayout[];
  staples?: Staple[];
  itemPairs?: ItemPair[];
}
