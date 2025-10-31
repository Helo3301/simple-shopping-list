import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { ItemEntry } from './ItemEntry';

export function ShoppingView() {
  const {
    lists,
    activeListId,
    setCurrentView,
    items,
    departments,
    toggleItem,
    deleteItem,
  } = useApp();

  const [isAddingItem, setIsAddingItem] = useState(false);

  const activeList = lists.find(l => l.id === activeListId);

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
            <div className="w-8"></div> {/* Spacer for centering */}
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
    </div>
  );
}
