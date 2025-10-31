import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

export function ListSelection() {
  const { lists, setActiveListId, setCurrentView, createList, deleteList } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    await createList(newListName.trim());
    setNewListName('');
    setIsCreating(false);
  };

  const handleSelectList = (listId: string) => {
    setActiveListId(listId);
    setCurrentView('shopping');
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="text-5xl mb-2">📝</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Simple Shopping List
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Privacy-first shopping organizer
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          My Lists
        </h2>

        {/* List Cards */}
        <div className="space-y-3">
          {lists.map(list => (
            <div
              key={list.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
              onClick={() => handleSelectList(list.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">📝</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {list.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Updated {formatTimestamp(list.updatedAt)}
                  </p>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete "${list.name}"?`)) {
                    deleteList(list.id);
                  }
                }}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}

          {lists.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                No shopping lists yet
              </p>
            </div>
          )}
        </div>

        {/* New List Button/Form */}
        {isCreating ? (
          <form onSubmit={handleCreateList} className="mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name (e.g., Weekly Groceries)"
                className="input-field mb-3"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewListName('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Create List
                </button>
              </div>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-2xl">+</span>
            <span>New List</span>
          </button>
        )}
      </div>
    </div>
  );
}
