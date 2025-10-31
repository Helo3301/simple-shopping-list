import Dexie, { Table } from 'dexie';
import {
  Department,
  ShoppingList,
  ShoppingItem,
  RecentItem,
  ExportData,
} from '../types/models';
import { createDefaultDepartments } from '../utils/defaultDepartments';

// Define the database schema
export class ShoppingListDatabase extends Dexie {
  departments!: Table<Department, string>;
  shoppingLists!: Table<ShoppingList, string>;
  items!: Table<ShoppingItem, string>;
  recentItems!: Table<RecentItem, string>;

  constructor() {
    super('SimpleShoppingListDB');

    this.version(1).stores({
      departments: 'id, sortOrder',
      shoppingLists: 'id, name, createdAt',
      items: 'id, listId, departmentId, isChecked, createdAt',
      recentItems: 'id, name, lastUsedAt, useCount',
    });
  }
}

// Create database instance
export const db = new ShoppingListDatabase();

// Initialize database with default departments if empty
export async function initializeDatabase(): Promise<void> {
  try {
    const departmentCount = await db.departments.count();

    if (departmentCount === 0) {
      const defaultDepartments = createDefaultDepartments();
      await db.departments.bulkAdd(defaultDepartments);
      console.log('✅ Default departments initialized');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Export all data (backup)
export async function exportData(): Promise<ExportData> {
  try {
    const [departments, shoppingLists, items, recentItems] = await Promise.all([
      db.departments.toArray(),
      db.shoppingLists.toArray(),
      db.items.toArray(),
      db.recentItems.toArray(),
    ]);

    const exportData: ExportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      departments,
      shoppingLists,
      items,
      recentItems,
    };

    return exportData;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
}

// Import data (restore) - Replace mode
export async function importDataReplace(data: ExportData): Promise<void> {
  try {
    // Validate version
    if (!data.version || data.version !== '1.0.0') {
      throw new Error('Incompatible data version');
    }

    // Clear existing data
    await Promise.all([
      db.departments.clear(),
      db.shoppingLists.clear(),
      db.items.clear(),
      db.recentItems.clear(),
    ]);

    // Import new data
    await Promise.all([
      db.departments.bulkAdd(data.departments),
      db.shoppingLists.bulkAdd(data.shoppingLists),
      db.items.bulkAdd(data.items),
      db.recentItems.bulkAdd(data.recentItems),
    ]);

    console.log('✅ Data imported successfully (replace mode)');
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  }
}

// Import data (restore) - Merge mode
export async function importDataMerge(data: ExportData): Promise<void> {
  try {
    // Validate version
    if (!data.version || data.version !== '1.0.0') {
      throw new Error('Incompatible data version');
    }

    // Get existing IDs to avoid duplicates
    const existingDeptIds = new Set((await db.departments.toArray()).map(d => d.id));
    const existingListIds = new Set((await db.shoppingLists.toArray()).map(l => l.id));
    const existingItemIds = new Set((await db.items.toArray()).map(i => i.id));
    const existingRecentIds = new Set((await db.recentItems.toArray()).map(r => r.id));

    // Filter out existing items
    const newDepartments = data.departments.filter(d => !existingDeptIds.has(d.id));
    const newLists = data.shoppingLists.filter(l => !existingListIds.has(l.id));
    const newItems = data.items.filter(i => !existingItemIds.has(i.id));
    const newRecent = data.recentItems.filter(r => !existingRecentIds.has(r.id));

    // Add new data
    await Promise.all([
      newDepartments.length > 0 && db.departments.bulkAdd(newDepartments),
      newLists.length > 0 && db.shoppingLists.bulkAdd(newLists),
      newItems.length > 0 && db.items.bulkAdd(newItems),
      newRecent.length > 0 && db.recentItems.bulkAdd(newRecent),
    ]);

    console.log('✅ Data imported successfully (merge mode)');
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  }
}

// Clear all data
export async function clearAllData(): Promise<void> {
  try {
    await Promise.all([
      db.departments.clear(),
      db.shoppingLists.clear(),
      db.items.clear(),
      db.recentItems.clear(),
    ]);

    // Re-initialize default departments
    await initializeDatabase();

    console.log('✅ All data cleared');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

// Helper: Download export as JSON file
export function downloadExportFile(data: ExportData): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `shopping-list-backup-${date}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Helper: Read import file
export function readImportFile(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text) as ExportData;
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}
