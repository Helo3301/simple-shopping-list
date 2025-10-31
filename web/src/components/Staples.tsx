import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { db } from '../services/database';
import { Staple, Department } from '../types/models';
import { addStaple, removeStaple, updateStaple } from '../services/suggestions';

export function Staples() {
  const { departments } = useApp();
  const [staples, setStaples] = useState<Staple[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStaple, setEditingStaple] = useState<Staple | null>(null);

  useEffect(() => {
    loadStaples();
  }, []);

  async function loadStaples() {
    const staplesData = await db.staples.orderBy('name').toArray();
    setStaples(staplesData);
  }

  async function handleDelete(staple: Staple) {
    if (!confirm(`Remove "${staple.name}" from staples?`)) return;

    try {
      await removeStaple(staple.id);
      await loadStaples();
    } catch (error) {
      alert('Failed to remove staple');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Staples
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Items you buy regularly
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-4 py-2 rounded-lg text-white"
            >
              + Add Staple
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {staples.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              No staples yet. Mark items you buy regularly for smart reminders!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-6 py-3 rounded-lg text-white"
            >
              Add Your First Staple
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {staples.map((staple) => {
              const dept = departments.find(d => d.id === staple.departmentId);
              const daysSince = staple.lastPurchased
                ? Math.floor((Date.now() - staple.lastPurchased) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <div
                  key={staple.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {/* Department icon */}
                    {dept && (
                      <div className="text-2xl flex-shrink-0">
                        {dept.icon}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                        {staple.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                          {staple.frequency}
                        </span>
                        {daysSince !== null && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Last bought {daysSince} days ago
                          </span>
                        )}
                        {daysSince === null && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Never purchased
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setEditingStaple(staple)}
                        className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(staple)}
                        className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <StapleModal
          departments={departments}
          onClose={() => setShowCreateModal(false)}
          onSave={loadStaples}
        />
      )}

      {/* Edit Modal */}
      {editingStaple && (
        <StapleModal
          staple={editingStaple}
          departments={departments}
          onClose={() => setEditingStaple(null)}
          onSave={loadStaples}
        />
      )}
    </div>
  );
}

// Staple Modal (Create/Edit)
function StapleModal({
  staple,
  departments,
  onClose,
  onSave,
}: {
  staple?: Staple;
  departments: Department[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(staple?.name || '');
  const [departmentId, setDepartmentId] = useState(staple?.departmentId || departments[0]?.id || '');
  const [frequency, setFrequency] = useState<Staple['frequency']>(staple?.frequency || 'weekly');

  async function handleSave() {
    if (!name.trim()) {
      alert('Please enter an item name');
      return;
    }

    if (!departmentId) {
      alert('Please select a department');
      return;
    }

    try {
      if (staple) {
        // Update existing
        await updateStaple(staple.id, {
          name: name.trim(),
          departmentId,
          frequency,
        });
      } else {
        // Create new
        await addStaple(name.trim(), departmentId, frequency);
      }

      onSave();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save staple');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {staple ? 'Edit Staple' : 'Add Staple'}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Staples are items you buy regularly. We'll remind you when it's time to add them again.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Item Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Milk"
              className="input-field w-full"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department *
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="input-field w-full"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.icon} {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency *
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Staple['frequency'])}
              className="input-field w-full"
            >
              <option value="always">Always remind me</option>
              <option value="weekly">Weekly (every 7 days)</option>
              <option value="biweekly">Bi-weekly (every 14 days)</option>
              <option value="monthly">Monthly (every 30 days)</option>
            </select>
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
            {staple ? 'Save Changes' : 'Add Staple'}
          </button>
        </div>
      </div>
    </div>
  );
}
