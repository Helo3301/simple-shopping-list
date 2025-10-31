import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { db } from '../services/database';
import type { RecentItem } from '../types/models';

interface ItemEntryProps {
  onClose: () => void;
}

export function ItemEntry({ onClose }: ItemEntryProps) {
  const { departments, addItem } = useApp();
  const [itemName, setItemName] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    loadRecentItems();
  }, []);

  async function loadRecentItems() {
    const recent = await db.recentItems
      .orderBy('lastUsedAt')
      .reverse()
      .limit(10)
      .toArray();
    setRecentItems(recent);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !selectedDeptId) return;

    await addItem(itemName.trim(), selectedDeptId);
    onClose();
  };

  const handleRecentItemClick = (item: RecentItem) => {
    setItemName(item.name);
    setSelectedDeptId(item.departmentId);
  };

  // Set default department if not selected
  useEffect(() => {
    if (!selectedDeptId && departments.length > 0) {
      setSelectedDeptId(departments[0].id);
    }
  }, [departments, selectedDeptId]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-40 animate-slide-up">
        <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Item
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Item Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Bananas"
                className="input-field"
                autoFocus
              />
            </div>

            {/* Recent Items */}
            {recentItems.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Recent Items:
                </label>
                <div className="flex flex-wrap gap-2">
                  {recentItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleRecentItemClick(item)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-full text-sm transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Department */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="input-field"
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!itemName.trim() || !selectedDeptId}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
