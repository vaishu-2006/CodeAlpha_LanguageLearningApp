import React from 'react';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

interface NavigationProps {
  currentIndex: number;
  totalCards: number;
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onFinishQuiz?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentIndex,
  totalCards,
  onPrev,
  onNext,
  onShuffle,
  onFinishQuiz,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCards - 1;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      <button
        onClick={onPrev}
        disabled={isFirst || totalCards === 0}
        className={`flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium transition-all ${
          isFirst || totalCards === 0
            ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
            : 'border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
        }`}
        aria-label="Previous card"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Previous</span>
      </button>

      <button
        onClick={onShuffle}
        className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2.5 font-medium text-amber-700 transition hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
        aria-label="Shuffle cards"
      >
        <Shuffle className="h-4 w-4" />
      </button>

      {onFinishQuiz && (
        <button
          onClick={onFinishQuiz}
          className="rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:from-teal-600 hover:to-cyan-700"
        >
          Finish Quiz
        </button>
      )}

      <button
        onClick={onNext}
        disabled={isLast || totalCards === 0}
        className={`flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium transition-all ${
          isLast || totalCards === 0
            ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
            : 'border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
        }`}
        aria-label="Next card"
      >
        <span>Next</span>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Navigation;
