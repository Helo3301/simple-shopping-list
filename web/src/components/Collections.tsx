import { useState, useEffect } from 'react';
import { Collection, CollectionItem, Department } from '../types/models';
import { db } from '../services/database';
import { v4 as uuidv4 } from 'uuid';

export function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  // Load collections and departments
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [collectionsData, itemsData, deptsData] = await Promise.all([
        db.collections.orderBy('createdAt').reverse().toArray(),
        db.collectionItems.toArray(),
        db.departments.orderBy('sortOrder').toArray(),
      ]);

      setCollections(collectionsData);
      setCollectionItems(itemsData);
      setDepartments(deptsData);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Get item count for a collection
  function getItemCount(collectionId: string): number {
    return collectionItems.filter(item => item.collectionId === collectionId).length;
  }

  // Get usage count (placeholder - we'll implement this when we add the feature)
  function getUsageCount(_collectionId: string): number {
    // TODO: Track this when collections are applied to lists
    return 0;
  }

  // Delete collection
  async function deleteCollection(id: string) {
    if (!confirm('Delete this collection? This cannot be undone.')) {
      return;
    }

    try {
      // Delete collection items first (foreign key constraint)
      await db.collectionItems.where('collectionId').equals(id).delete();
      // Then delete the collection
      await db.collections.delete(id);
      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading collections...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Collections
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-4 py-2 rounded-lg text-white flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Collections List */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Collections Yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create reusable templates for your shopping lists
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-6 py-3 rounded-lg text-white"
            >
              Create Your First Collection
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {collection.emoji && (
                        <span className="text-2xl">{collection.emoji}</span>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {collection.name}
                      </h3>
                    </div>
                    {collection.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {collection.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{getItemCount(collection.id)} items</span>
                      <span>•</span>
                      <span>Used {getUsageCount(collection.id)} times</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCollection(collection)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCollection(collection.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateModal(false)}
          onSave={async () => {
            await loadData();
            setShowCreateModal(false);
          }}
          departments={departments}
        />
      )}

      {/* Edit Collection Modal */}
      {selectedCollection && (
        <EditCollectionModal
          collection={selectedCollection}
          collectionItems={collectionItems.filter(
            item => item.collectionId === selectedCollection.id
          )}
          departments={departments}
          onClose={() => setSelectedCollection(null)}
          onSave={async () => {
            await loadData();
            setSelectedCollection(null);
          }}
        />
      )}
    </div>
  );
}

// Create Collection Modal Component
function CreateCollectionModal({
  onClose,
  onSave,
  departments,
}: {
  onClose: () => void;
  onSave: () => void;
  departments: Department[];
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('');
  const [items, setItems] = useState<Omit<CollectionItem, 'id' | 'collectionId'>[]>([]);
  const [currentItemName, setCurrentItemName] = useState('');
  const [currentDepartmentId, setCurrentDepartmentId] = useState(departments[0]?.id || '');

  async function handleSave() {
    if (!name.trim()) {
      alert('Please enter a collection name');
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

      // Add items if any
      if (items.length > 0) {
        const collectionItems: CollectionItem[] = items.map((item, index) => ({
          id: uuidv4(),
          collectionId,
          name: item.name,
          departmentId: item.departmentId,
          quantity: item.quantity,
          notes: item.notes,
          sortOrder: index,
        }));

        await db.collectionItems.bulkAdd(collectionItems);
      }

      onSave();
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection');
    }
  }

  function addItem() {
    if (!currentItemName.trim()) return;

    setItems([
      ...items,
      {
        name: currentItemName.trim(),
        departmentId: currentDepartmentId,
        sortOrder: items.length,
      },
    ]);

    setCurrentItemName('');
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Create Collection
          </h2>

          {/* Collection Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
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
                placeholder="Brief description of this collection"
                className="input-field w-full"
                rows={2}
              />
            </div>
          </div>

          {/* Add Items Section */}
          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Items
            </h3>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentItemName}
                onChange={(e) => setCurrentItemName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="Item name"
                className="input-field flex-1"
              />
              <select
                value={currentDepartmentId}
                onChange={(e) => setCurrentDepartmentId(e.target.value)}
                className="input-field"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addItem}
                className="btn-primary px-4 py-2 rounded-lg text-white"
              >
                Add
              </button>
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {items.map((item, index) => {
                  const dept = departments.find(d => d.id === item.departmentId);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span>{dept?.icon}</span>
                        <span className="text-gray-900 dark:text-white">{item.name}</span>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
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
              Create Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Collection Modal Component
function EditCollectionModal({
  collection,
  collectionItems,
  departments,
  onClose,
  onSave,
}: {
  collection: Collection;
  collectionItems: CollectionItem[];
  departments: Department[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description || '');
  const [emoji, setEmoji] = useState(collection.emoji || '');
  const [items, setItems] = useState<CollectionItem[]>(
    [...collectionItems].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [currentItemName, setCurrentItemName] = useState('');
  const [currentDepartmentId, setCurrentDepartmentId] = useState(departments[0]?.id || '');

  async function handleSave() {
    if (!name.trim()) {
      alert('Please enter a collection name');
      return;
    }

    try {
      const now = Date.now();

      // Update collection
      await db.collections.update(collection.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        emoji: emoji.trim() || undefined,
        updatedAt: now,
      });

      // Delete all existing items
      await db.collectionItems.where('collectionId').equals(collection.id).delete();

      // Add updated items
      if (items.length > 0) {
        const updatedItems: CollectionItem[] = items.map((item, index) => ({
          ...item,
          sortOrder: index,
        }));

        await db.collectionItems.bulkAdd(updatedItems);
      }

      onSave();
    } catch (error) {
      console.error('Error updating collection:', error);
      alert('Failed to update collection');
    }
  }

  function addItem() {
    if (!currentItemName.trim()) return;

    const newItem: CollectionItem = {
      id: uuidv4(),
      collectionId: collection.id,
      name: currentItemName.trim(),
      departmentId: currentDepartmentId,
      sortOrder: items.length,
    };

    setItems([...items, newItem]);
    setCurrentItemName('');
  }

  function removeItem(id: string) {
    setItems(items.filter(item => item.id !== id));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Edit Collection
          </h2>

          {/* Collection Details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name *
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
                placeholder="Brief description of this collection"
                className="input-field w-full"
                rows={2}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Items
            </h3>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentItemName}
                onChange={(e) => setCurrentItemName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="Item name"
                className="input-field flex-1"
              />
              <select
                value={currentDepartmentId}
                onChange={(e) => setCurrentDepartmentId(e.target.value)}
                className="input-field"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addItem}
                className="btn-primary px-4 py-2 rounded-lg text-white"
              >
                Add
              </button>
            </div>

            {/* Items List */}
            {items.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {items.map((item) => {
                  const dept = departments.find(d => d.id === item.departmentId);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span>{dept?.icon}</span>
                        <span className="text-gray-900 dark:text-white">{item.name}</span>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No items yet. Add some above!
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
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
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
