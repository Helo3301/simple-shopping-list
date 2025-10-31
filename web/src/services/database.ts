import Dexie, { Table } from 'dexie';
import {
  Department,
  ShoppingList,
  ShoppingItem,
  RecentItem,
  Collection,
  CollectionItem,
  Store,
  StoreLayout,
  Staple,
  ItemPair,
  ExportData,
} from '../types/models';
import { createDefaultDepartments } from '../utils/defaultDepartments';

// Define the database schema
export class ShoppingListDatabase extends Dexie {
  departments!: Table<Department, string>;
  shoppingLists!: Table<ShoppingList, string>;
  items!: Table<ShoppingItem, string>;
  recentItems!: Table<RecentItem, string>;
  collections!: Table<Collection, string>;
  collectionItems!: Table<CollectionItem, string>;
  stores!: Table<Store, string>;
  storeLayouts!: Table<StoreLayout, string>;
  staples!: Table<Staple, string>;
  itemPairs!: Table<ItemPair, string>;

  constructor() {
    super('SimpleShoppingListDB');

    // Version 1: Initial schema
    this.version(1).stores({
      departments: 'id, sortOrder',
      shoppingLists: 'id, name, createdAt',
      items: 'id, listId, departmentId, isChecked, createdAt',
      recentItems: 'id, name, lastUsedAt, useCount',
    });

    // Version 2: Add Collections
    this.version(2).stores({
      departments: 'id, sortOrder',
      shoppingLists: 'id, name, createdAt',
      items: 'id, listId, departmentId, isChecked, createdAt',
      recentItems: 'id, name, lastUsedAt, useCount',
      collections: 'id, name, createdAt, updatedAt',
      collectionItems: 'id, collectionId, sortOrder',
    });

    // Version 3: Add Stores
    this.version(3).stores({
      departments: 'id, sortOrder',
      shoppingLists: 'id, name, createdAt',
      items: 'id, listId, departmentId, isChecked, createdAt',
      recentItems: 'id, name, lastUsedAt, useCount',
      collections: 'id, name, createdAt, updatedAt',
      collectionItems: 'id, collectionId, sortOrder',
      stores: 'id, name, isActive, createdAt, updatedAt',
      storeLayouts: 'id, storeId, departmentId, sortOrder',
    });

    // Version 4: Add Smart Suggestions (Staples & Item Pairs)
    this.version(4).stores({
      departments: 'id, sortOrder',
      shoppingLists: 'id, name, createdAt',
      items: 'id, listId, departmentId, isChecked, createdAt',
      recentItems: 'id, name, lastUsedAt, useCount',
      collections: 'id, name, createdAt, updatedAt',
      collectionItems: 'id, collectionId, sortOrder',
      stores: 'id, name, isActive, createdAt, updatedAt',
      storeLayouts: 'id, storeId, departmentId, sortOrder',
      staples: 'id, name, frequency, lastPurchased, createdAt',
      itemPairs: 'id, item1, item2, count, lastSeen',
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
    const [departments, shoppingLists, items, recentItems, collections, collectionItems, stores, storeLayouts, staples, itemPairs] = await Promise.all([
      db.departments.toArray(),
      db.shoppingLists.toArray(),
      db.items.toArray(),
      db.recentItems.toArray(),
      db.collections.toArray(),
      db.collectionItems.toArray(),
      db.stores.toArray(),
      db.storeLayouts.toArray(),
      db.staples.toArray(),
      db.itemPairs.toArray(),
    ]);

    const exportData: ExportData = {
      version: '4.0.0',
      exportedAt: new Date().toISOString(),
      departments,
      shoppingLists,
      items,
      recentItems,
      collections,
      collectionItems,
      stores,
      storeLayouts,
      staples,
      itemPairs,
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
    // Validate version (support 1.0.0, 2.0.0, 3.0.0, and 4.0.0)
    if (!data.version || !['1.0.0', '2.0.0', '3.0.0', '4.0.0'].includes(data.version)) {
      throw new Error('Incompatible data version');
    }

    // Clear existing data
    await Promise.all([
      db.departments.clear(),
      db.shoppingLists.clear(),
      db.items.clear(),
      db.recentItems.clear(),
      db.collections.clear(),
      db.collectionItems.clear(),
      db.stores.clear(),
      db.storeLayouts.clear(),
      db.staples.clear(),
      db.itemPairs.clear(),
    ]);

    // Import new data
    const imports = [
      db.departments.bulkAdd(data.departments),
      db.shoppingLists.bulkAdd(data.shoppingLists),
      db.items.bulkAdd(data.items),
      db.recentItems.bulkAdd(data.recentItems),
    ];

    // Add collections if present (v2.0.0+)
    if (data.collections && data.collections.length > 0) {
      imports.push(db.collections.bulkAdd(data.collections));
    }
    if (data.collectionItems && data.collectionItems.length > 0) {
      imports.push(db.collectionItems.bulkAdd(data.collectionItems));
    }

    // Add stores if present (v3.0.0+)
    if (data.stores && data.stores.length > 0) {
      imports.push(db.stores.bulkAdd(data.stores));
    }
    if (data.storeLayouts && data.storeLayouts.length > 0) {
      imports.push(db.storeLayouts.bulkAdd(data.storeLayouts));
    }

    // Add smart suggestions if present (v4.0.0+)
    if (data.staples && data.staples.length > 0) {
      imports.push(db.staples.bulkAdd(data.staples));
    }
    if (data.itemPairs && data.itemPairs.length > 0) {
      imports.push(db.itemPairs.bulkAdd(data.itemPairs));
    }

    await Promise.all(imports);

    console.log('✅ Data imported successfully (replace mode)');
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  }
}

// Import data (restore) - Merge mode
export async function importDataMerge(data: ExportData): Promise<void> {
  try {
    // Validate version (support 1.0.0, 2.0.0, 3.0.0, and 4.0.0)
    if (!data.version || !['1.0.0', '2.0.0', '3.0.0', '4.0.0'].includes(data.version)) {
      throw new Error('Incompatible data version');
    }

    // Get existing IDs to avoid duplicates
    const existingDeptIds = new Set((await db.departments.toArray()).map(d => d.id));
    const existingListIds = new Set((await db.shoppingLists.toArray()).map(l => l.id));
    const existingItemIds = new Set((await db.items.toArray()).map(i => i.id));
    const existingRecentIds = new Set((await db.recentItems.toArray()).map(r => r.id));
    const existingCollectionIds = new Set((await db.collections.toArray()).map(c => c.id));
    const existingCollectionItemIds = new Set((await db.collectionItems.toArray()).map(ci => ci.id));
    const existingStoreIds = new Set((await db.stores.toArray()).map(s => s.id));
    const existingStoreLayoutIds = new Set((await db.storeLayouts.toArray()).map(sl => sl.id));
    const existingStapleIds = new Set((await db.staples.toArray()).map(st => st.id));
    const existingItemPairIds = new Set((await db.itemPairs.toArray()).map(ip => ip.id));

    // Filter out existing items
    const newDepartments = data.departments.filter(d => !existingDeptIds.has(d.id));
    const newLists = data.shoppingLists.filter(l => !existingListIds.has(l.id));
    const newItems = data.items.filter(i => !existingItemIds.has(i.id));
    const newRecent = data.recentItems.filter(r => !existingRecentIds.has(r.id));
    const newCollections = data.collections?.filter(c => !existingCollectionIds.has(c.id)) || [];
    const newCollectionItems = data.collectionItems?.filter(ci => !existingCollectionItemIds.has(ci.id)) || [];
    const newStores = data.stores?.filter(s => !existingStoreIds.has(s.id)) || [];
    const newStoreLayouts = data.storeLayouts?.filter(sl => !existingStoreLayoutIds.has(sl.id)) || [];
    const newStaples = data.staples?.filter(st => !existingStapleIds.has(st.id)) || [];
    const newItemPairs = data.itemPairs?.filter(ip => !existingItemPairIds.has(ip.id)) || [];

    // Add new data
    const imports = [];
    if (newDepartments.length > 0) imports.push(db.departments.bulkAdd(newDepartments));
    if (newLists.length > 0) imports.push(db.shoppingLists.bulkAdd(newLists));
    if (newItems.length > 0) imports.push(db.items.bulkAdd(newItems));
    if (newRecent.length > 0) imports.push(db.recentItems.bulkAdd(newRecent));
    if (newCollections.length > 0) imports.push(db.collections.bulkAdd(newCollections));
    if (newCollectionItems.length > 0) imports.push(db.collectionItems.bulkAdd(newCollectionItems));
    if (newStores.length > 0) imports.push(db.stores.bulkAdd(newStores));
    if (newStoreLayouts.length > 0) imports.push(db.storeLayouts.bulkAdd(newStoreLayouts));
    if (newStaples.length > 0) imports.push(db.staples.bulkAdd(newStaples));
    if (newItemPairs.length > 0) imports.push(db.itemPairs.bulkAdd(newItemPairs));

    await Promise.all(imports);

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
      db.collections.clear(),
      db.collectionItems.clear(),
      db.stores.clear(),
      db.storeLayouts.clear(),
      db.staples.clear(),
      db.itemPairs.clear(),
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
