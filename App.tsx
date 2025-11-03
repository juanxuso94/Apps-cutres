import React, { useState } from 'react';
import { AppContextProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import ManageData from './components/ManageData';
import { HomeIcon } from './components/icons/HomeIcon';
import { ListIcon } from './components/icons/ListIcon';
import { CogIcon } from './components/icons/CogIcon';
import { ThemeProvider } from './context/ThemeContext';

type View = 'dashboard' | 'transactions' | 'settings';

const NavButton = ({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center flex-1 py-2 px-1 text-xs sm:text-sm transition-colors duration-200 ${isActive ? 'text-primary font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
        {children}
    </button>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'transactions':
        return <TransactionList />;
      case 'settings':
        return <ManageData />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };
  
  const getTitleForView = (view: View) => {
    switch (view) {
      case 'transactions':
        return 'Movimientos';
      case 'settings':
        return 'Ajustes';
      case 'dashboard':
      default:
        return 'Panel Principal';
    }
  };

  return (
    <ThemeProvider>
        <AppContextProvider userKey="local-user-data">
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 pt-[calc(1rem+env(safe-area-inset-top))]">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
                   {getTitleForView(currentView)}
                </h1>
            </header>

            <main className="flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))]">
                 {renderView()}
            </main>
            
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around z-10 pb-[env(safe-area-inset-bottom)]">
                <NavButton isActive={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')}>
                    <HomeIcon className="h-6 w-6 mb-1" />
                    <span>Panel</span>
                </NavButton>
                <NavButton isActive={currentView === 'transactions'} onClick={() => setCurrentView('transactions')}>
                    <ListIcon className="h-6 w-6 mb-1" />
                    <span>Movimientos</span>
                </NavButton>
                <NavButton isActive={currentView === 'settings'} onClick={() => setCurrentView('settings')}>
                    <CogIcon className="h-6 w-6 mb-1" />
                    <span>Ajustes</span>
                </NavButton>
            </nav>
        </div>
        </AppContextProvider>
    </ThemeProvider>
  );
};

export default App;