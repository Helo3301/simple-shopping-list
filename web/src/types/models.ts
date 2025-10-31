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

// Export/Import format
export interface ExportData {
  version: string;
  exportedAt: string; // ISO 8601 date string
  departments: Department[];
  shoppingLists: ShoppingList[];
  items: ShoppingItem[];
  recentItems: RecentItem[];
}
