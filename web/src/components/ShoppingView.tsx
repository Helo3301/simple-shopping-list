import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { ItemEntry } from './ItemEntry';
import { db } from '../services/database';
import { Collection, CollectionItem } from '../types/models';
import { v4 as uuidv4 } from 'uuid';
import { Suggestion, getSuggestions, trackItemPairs, updateStaplePurchased } from '../services/suggestions';

export function ShoppingView() {
  const {
    lists,
    activeListId,
    setCurrentView,
    items,
    departments,
    toggleItem,
    deleteItem,
    addItem,
  } = useApp();

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSaveAsCollection, setShowSaveAsCollection] = useState(false);
  const [showApplyCollection, setShowApplyCollection] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const activeList = lists.find(l => l.id === activeListId);

  // Load collections
  useEffect(() => {
    async function loadCollections() {
      const collectionsData = await db.collections.toArray();
      setCollections(collectionsData);
    }
    loadCollections();
  }, []);

  // Load suggestions when items change
  useEffect(() => {
    async function loadSuggestions() {
      const suggestions = await getSuggestions(items);
      setSuggestions(suggestions);
    }
    loadSuggestions();
  }, [items]);

  // Group items by department
  const itemsByDepartment = useMemo(() => {
    const grouped = new Map<string, typeof items>();

    departments.forEach(dept => {
      const deptItems = items.filter(item => item.departmentId === dept.id);
      if (deptItems.length > 0) {
        grouped.set(dept.id, deptItems);
      }
    });

    return grouped;
  }, [items, departments]);

  const totalItems = items.length;
  const checkedItems = items.filter(i => i.isChecked).length;
  const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  if (!activeList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">List not found</p>
          <button
            onClick={() => setCurrentView('lists')}
            className="btn-primary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('lists')}
              className="text-2xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ←
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate flex-1 mx-4 text-center">
              {activeList.name}
            </h1>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-2xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ⋮
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                  <button
                    onClick={() => {
                      setShowApplyCollection(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    Apply Collection
                  </button>
                  <button
                    onClick={() => {
                      setShowSaveAsCollection(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    Save as Collection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        {totalItems > 0 && (
          <div className="max-w-2xl mx-auto px-4 pb-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {checkedItems} of {totalItems} items
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Smart Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="mb-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Did you forget something?
                </h3>
              </div>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion) => {
                const dept = departments.find(d => d.id === suggestion.departmentId);
                return (
                  <div
                    key={suggestion.id}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3"
                  >
                    {dept && <span className="text-xl">{dept.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {suggestion.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {suggestion.details}
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await addItem(suggestion.name, suggestion.departmentId);
                        await updateStaplePurchased(suggestion.name);
                      }}
                      className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                    >
                      + Add
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {itemsByDepartment.size === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No items yet. Add your first item!
            </p>
            <button
              onClick={() => setIsAddingItem(true)}
              className="btn-primary"
            >
              Add Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(itemsByDepartment.entries()).map(([deptId, deptItems]) => {
              const department = departments.find(d => d.id === deptId);
              if (!department) return null;

              return (
                <div
                  key={deptId}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Department Header */}
                  <div
                    className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-l-4 flex items-center gap-2"
                    style={{ borderLeftColor: department.color }}
                  >
                    <span className="text-2xl">{department.icon}</span>
                    <span className="font-semibold text-gray-900 dark:text-white flex-1">
                      {department.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {deptItems.length} item{deptItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {deptItems.map(item => (
                      <div
                        key={item.id}
                        className={`px-4 py-3 flex items-center gap-3 ${
                          item.isChecked ? 'opacity-60' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                            item.isChecked
                              ? 'bg-secondary border-secondary'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {item.isChecked && (
                            <span className="text-white text-sm font-bold">✓</span>
                          )}
                        </button>

                        {/* Item text */}
                        <div
                          className={`flex-1 text-gray-900 dark:text-white ${
                            item.isChecked ? 'line-through' : ''
                          }`}
                        >
                          {item.name}
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => {
                            if (confirm('Delete this item?')) {
                              deleteItem(item.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium opacity-0 hover:opacity-100 focus:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddingItem(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center text-3xl transition-colors z-20"
      >
        +
      </button>

      {/* Item Entry Modal */}
      {isAddingItem && <ItemEntry onClose={() => setIsAddingItem(false)} />}

      {/* Save as Collection Modal */}
      {showSaveAsCollection && (
        <SaveAsCollectionModal
          items={items}
          listName={activeList.name}
          departments={departments}
          onClose={() => setShowSaveAsCollection(false)}
        />
      )}

      {/* Apply Collection Modal */}
      {showApplyCollection && (
        <ApplyCollectionModal
          collections={collections}
          onApply={async (collectionId) => {
            const collectionItems = await db.collectionItems
              .where('collectionId')
              .equals(collectionId)
              .toArray();

            for (const item of collectionItems) {
              await addItem(item.name, item.departmentId);
            }

            setShowApplyCollection(false);
          }}
          onClose={() => setShowApplyCollection(false)}
        />
      )}
    </div>
  );
}

// Save as Collection Modal
function SaveAsCollectionModal({
  items,
  listName,
  departments,
  onClose,
}: {
  items: typeof import('../types/models').ShoppingItem[];
  listName: string;
  departments: typeof import('../types/models').Department[];
  onClose: () => void;
}) {
  const [name, setName] = useState(listName);
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');

  async function handleSave() {
    if (!name.trim()) {
      alert('Please enter a collection name');
      return;
    }

    if (items.length === 0) {
      alert('Cannot save empty list as collection');
      return;
    }

    try {
      const collectionId = uuidv4();
      const now = Date.now();

      // Create collection
      const collection: Collection = {
        id: collectionId,
        name: name.trim(),
        description: description.trim() || undefined,
        emoji: emoji.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };

      await db.collections.add(collection);

      // Add items
      const collectionItems: CollectionItem[] = items.map((item, index) => ({
        id: uuidv4(),
        collectionId,
        name: item.name,
        departmentId: item.departmentId,
        sortOrder: index,
      }));

      await db.collectionItems.bulkAdd(collectionItems);

      alert(`Collection "${name}" created with ${items.length} items!`);
      onClose();
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Failed to save collection');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Save as Collection
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Save {items.length} items from this list as a reusable template
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Collection Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekly Staples"
              className="input-field w-full"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Emoji (optional)
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              placeholder="🍞"
              className="input-field w-24"
              maxLength={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="input-field w-full"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary px-4 py-2 rounded-lg text-white"
          >
            Save Collection
          </button>
        </div>
      </div>
    </div>
  );
}

// Apply Collection Modal
function ApplyCollectionModal({
  collections,
  onApply,
  onClose,
}: {
  collections: Collection[];
  onApply: (collectionId: string) => void;
  onClose: () => void;
}) {
  const [collectionItems, setCollectionItems] = useState<Record<string, CollectionItem[]>>({});

  useEffect(() => {
    async function loadCollectionItems() {
      const items: Record<string, CollectionItem[]> = {};
      for (const collection of collections) {
        const items_data = await db.collectionItems
          .where('collectionId')
          .equals(collection.id)
          .toArray();
        items[collection.id] = items_data;
      }
      setCollectionItems(items);
    }
    loadCollectionItems();
  }, [collections]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Apply Collection
        </h2>

        {collections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No collections yet
            </p>
            <button
              onClick={onClose}
              className="btn-primary px-4 py-2 rounded-lg text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Select a collection to add its items to this list
            </p>

            <div className="space-y-2 mb-6">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => onApply(collection.id)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {collection.emoji && <span className="text-xl">{collection.emoji}</span>}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {collection.name}
                    </span>
                  </div>
                  {collection.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {collection.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {collectionItems[collection.id]?.length || 0} items
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
