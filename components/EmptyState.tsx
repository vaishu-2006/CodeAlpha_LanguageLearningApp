import React from 'react';
import { Layers, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
  onAddClick: () => void;
  onClearSearch: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  hasSearchQuery,
  onAddClick,
  onClearSearch,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
        {hasSearchQuery ? (
          <Search className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        ) : (
          <Layers className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
        {hasSearchQuery ? 'No cards found' : 'No flashcards yet'}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-6">
        {hasSearchQuery
          ? 'Try a different search term or clear your search to see all cards.'
          : 'Create your first flashcard to start learning!'}
      </p>
      {hasSearchQuery ? (
        <button
          onClick={onClearSearch}
          className="px-6 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
        >
          Clear Search
        </button>
      ) : (
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Your First Card</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
