import { useEffect, useState } from 'react';
import { initializeDatabase } from './services/database';
import { AppProvider, useApp } from './contexts/AppContext';
import { ListSelection } from './components/ListSelection';
import { ShoppingView } from './components/ShoppingView';
import { Collections } from './components/Collections';
import { Stores } from './components/Stores';
import { Staples } from './components/Staples';

function AppContent() {
  const { currentView, setCurrentView, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="pb-20">
        {currentView === 'lists' && <ListSelection />}
        {currentView === 'shopping' && <ShoppingView />}
        {currentView === 'collections' && <Collections />}
        {currentView === 'stores' && <Stores />}
        {currentView === 'staples' && <Staples />}
      </div>

      {/* Bottom Navigation */}
      {currentView !== 'shopping' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
          <div className="max-w-2xl mx-auto px-4 py-3 flex justify-around items-center">
            <button
              onClick={() => setCurrentView('lists')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'lists'
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <span className="text-2xl">📝</span>
              <span className="text-xs font-medium">Lists</span>
            </button>
            <button
              onClick={() => setCurrentView('collections')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'collections'
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <span className="text-2xl">📦</span>
              <span className="text-xs font-medium">Collections</span>
            </button>
            <button
              onClick={() => setCurrentView('stores')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'stores'
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <span className="text-2xl">🏪</span>
              <span className="text-xs font-medium">Stores</span>
            </button>
            <button
              onClick={() => setCurrentView('staples')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'staples'
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <span className="text-2xl">🔔</span>
              <span className="text-xs font-medium">Staples</span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize');
      }
    };

    init();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
