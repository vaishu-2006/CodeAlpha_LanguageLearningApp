import React from 'react';
import { Layers, Sun, Moon, Plus } from 'lucide-react';
import { useTheme } from '../context/FlashcardContext';

interface HeaderProps {
  totalCards: number;
  onAddClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ totalCards, onAddClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              FlashMaster
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalCards} {totalCards === 1 ? 'card' : 'cards'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-sm shadow-md"
            aria-label="Add new flashcard"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Card</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
