import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { db } from '../services/database';
import { Store, StoreLayout, Department } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

export function Stores() {
  const { departments } = useApp();
  const [stores, setStores] = useState<Store[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  // Load stores
  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores() {
    const storesData = await db.stores.orderBy('name').toArray();
    setStores(storesData);
  }

  async function deleteStore(storeId: string, storeName: string) {
    if (!confirm(`Delete "${storeName}"? This will also remove its custom department layout.`)) {
      return;
    }

    try {
      // Delete store layouts first
      await db.storeLayouts.where('storeId').equals(storeId).delete();
      // Delete store
      await db.stores.delete(storeId);
      await loadStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('Failed to delete store');
    }
  }

  async function setActiveStore(storeId: string) {
    try {
      // Deactivate all stores
      const allStores = await db.stores.toArray();
      for (const store of allStores) {
        if (store.isActive) {
          await db.stores.update(store.id, { isActive: false });
        }
      }

      // Activate selected store
      await db.stores.update(storeId, { isActive: true });
      await loadStores();
    } catch (error) {
      console.error('Error setting active store:', error);
      alert('Failed to set active store');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Stores
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-4 py-2 rounded-lg text-white"
            >
              + Add Store
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {stores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No stores yet. Add your favorite grocery stores!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-6 py-3 rounded-lg text-white"
            >
              Add Your First Store
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 transition-colors ${
                  store.isActive
                    ? 'border-primary-500'
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Emoji */}
                  <div className="text-3xl flex-shrink-0">
                    {store.emoji || '🏪'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {store.name}
                      </h3>
                      {store.isActive && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    {store.chain && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {store.chain}
                      </p>
                    )}
                    {store.address && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {store.address}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!store.isActive && (
                      <button
                        onClick={() => setActiveStore(store.id)}
                        className="text-xs px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-200 dark:hover:bg-primary-900/50"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => setEditingStore(store)}
                      className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStore(store.id, store.name)}
                      className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50"
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

      {/* Create Modal */}
      {showCreateModal && (
        <CreateStoreModal
          departments={departments}
          onClose={() => setShowCreateModal(false)}
          onSave={loadStores}
        />
      )}

      {/* Edit Modal */}
      {editingStore && (
        <EditStoreModal
          store={editingStore}
          departments={departments}
          onClose={() => setEditingStore(null)}
          onSave={loadStores}
        />
      )}
    </div>
  );
}

// Create Store Modal
function CreateStoreModal({
  departments,
  onClose,
  onSave,
}: {
  departments: Department[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState('');
  const [chain, setChain] = useState('');
  const [address, setAddress] = useState('');
  const [emoji, setEmoji] = useState('🏪');
  const [isActive, setIsActive] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      alert('Please enter a store name');
      return;
    }

    try {
      const storeId = uuidv4();
      const now = Date.now();

      const store: Store = {
        id: storeId,
        name: name.trim(),
        chain: chain.trim() || undefined,
        address: address.trim() || undefined,
        emoji: emoji.trim() || '🏪',
        createdAt: now,
        updatedAt: now,
        isActive,
      };

      // If this is set as active, deactivate all other stores
      if (isActive) {
        const allStores = await db.stores.toArray();
        for (const s of allStores) {
          if (s.isActive) {
            await db.stores.update(s.id, { isActive: false });
          }
        }
      }

      await db.stores.add(store);

      // Create default store layout (same order as departments)
      const layouts: StoreLayout[] = departments.map((dept, index) => ({
        id: uuidv4(),
        storeId,
        departmentId: dept.id,
        sortOrder: index,
      }));

      if (layouts.length > 0) {
        await db.storeLayouts.bulkAdd(layouts);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating store:', error);
      alert('Failed to create store');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Add Store
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Store Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Kroger - Main Street"
              className="input-field w-full"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Chain (optional)
            </label>
            <input
              type="text"
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              placeholder="e.g., Kroger"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address (optional)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., 123 Main St"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Emoji
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              placeholder="🏪"
              className="input-field w-24"
              maxLength={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
              Set as my active store
            </label>
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
            Add Store
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit Store Modal
function EditStoreModal({
  store,
  departments,
  onClose,
  onSave,
}: {
  store: Store;
  departments: Department[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(store.name);
  const [chain, setChain] = useState(store.chain || '');
  const [address, setAddress] = useState(store.address || '');
  const [emoji, setEmoji] = useState(store.emoji || '🏪');
  const [isActive, setIsActive] = useState(store.isActive);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [storeLayouts, setStoreLayouts] = useState<StoreLayout[]>([]);

  useEffect(() => {
    loadStoreLayouts();
  }, []);

  async function loadStoreLayouts() {
    const layouts = await db.storeLayouts
      .where('storeId')
      .equals(store.id)
      .sortBy('sortOrder');
    setStoreLayouts(layouts);
  }

  async function handleSave() {
    if (!name.trim()) {
      alert('Please enter a store name');
      return;
    }

    try {
      const now = Date.now();

      // If this is set as active, deactivate all other stores
      if (isActive && !store.isActive) {
        const allStores = await db.stores.toArray();
        for (const s of allStores) {
          if (s.isActive && s.id !== store.id) {
            await db.stores.update(s.id, { isActive: false });
          }
        }
      }

      await db.stores.update(store.id, {
        name: name.trim(),
        chain: chain.trim() || undefined,
        address: address.trim() || undefined,
        emoji: emoji.trim() || '🏪',
        updatedAt: now,
        isActive,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating store:', error);
      alert('Failed to update store');
    }
  }

  async function moveLayoutUp(index: number) {
    if (index === 0) return;

    const newLayouts = [...storeLayouts];
    [newLayouts[index - 1], newLayouts[index]] = [newLayouts[index], newLayouts[index - 1]];

    // Update sort orders
    for (let i = 0; i < newLayouts.length; i++) {
      await db.storeLayouts.update(newLayouts[i].id, { sortOrder: i });
    }

    setStoreLayouts(newLayouts);
  }

  async function moveLayoutDown(index: number) {
    if (index === storeLayouts.length - 1) return;

    const newLayouts = [...storeLayouts];
    [newLayouts[index], newLayouts[index + 1]] = [newLayouts[index + 1], newLayouts[index]];

    // Update sort orders
    for (let i = 0; i < newLayouts.length; i++) {
      await db.storeLayouts.update(newLayouts[i].id, { sortOrder: i });
    }

    setStoreLayouts(newLayouts);
  }

  async function updateAisleNumber(layoutId: string, aisleNumber: string) {
    await db.storeLayouts.update(layoutId, { aisleNumber: aisleNumber.trim() || undefined });
    await loadStoreLayouts();
  }

  async function updateSection(layoutId: string, section: string) {
    await db.storeLayouts.update(layoutId, { section: section.trim() || undefined });
    await loadStoreLayouts();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Store
        </h2>

        {!showLayoutEditor ? (
          <>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Kroger - Main Street"
                  className="input-field w-full"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Chain (optional)
                </label>
                <input
                  type="text"
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  placeholder="e.g., Kroger"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address (optional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 123 Main St"
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emoji
                </label>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
                  placeholder="🏪"
                  className="input-field w-24"
                  maxLength={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveEdit"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActiveEdit" className="text-sm text-gray-700 dark:text-gray-300">
                  Set as my active store
                </label>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowLayoutEditor(true)}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-left flex items-center justify-between"
                >
                  <span>
                    <span className="font-medium">Customize Department Order</span>
                    <span className="block text-sm text-gray-600 dark:text-gray-400">
                      Arrange departments in the order you find them in-store
                    </span>
                  </span>
                  <span className="text-2xl">→</span>
                </button>
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
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowLayoutEditor(false)}
              className="mb-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-2"
            >
              ← Back to Store Details
            </button>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Department Layout
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Arrange departments in the order you encounter them while shopping.
              Add aisle numbers and sections for easier navigation.
            </p>

            <div className="space-y-2">
              {storeLayouts.map((layout, index) => {
                const dept = departments.find(d => d.id === layout.departmentId);
                if (!dept) return null;

                return (
                  <div
                    key={layout.id}
                    className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 flex items-center gap-3"
                  >
                    {/* Order controls */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveLayoutUp(index)}
                        disabled={index === 0}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveLayoutDown(index)}
                        disabled={index === storeLayouts.length - 1}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Department info */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-2xl">{dept.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {dept.name}
                      </span>
                    </div>

                    {/* Aisle input */}
                    <input
                      type="text"
                      value={layout.aisleNumber || ''}
                      onChange={(e) => updateAisleNumber(layout.id, e.target.value)}
                      placeholder="Aisle"
                      className="input-field w-20 text-sm"
                    />

                    {/* Section input */}
                    <input
                      type="text"
                      value={layout.section || ''}
                      onChange={(e) => updateSection(layout.id, e.target.value)}
                      placeholder="Section"
                      className="input-field w-24 text-sm"
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowLayoutEditor(false)}
                className="btn-primary px-4 py-2 rounded-lg text-white"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
