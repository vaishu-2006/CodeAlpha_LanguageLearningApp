import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Edit2, Trash2, RotateCcw, Send, SkipForward } from 'lucide-react';
import { Flashcard as FlashcardType } from '../types/flashcard';

interface FlashcardProps {
  card: FlashcardType;
  currentIndex: number;
  totalCards: number;
  onEdit: () => void;
  onDelete: () => void;
  isFlipped: boolean;
  onFlip: () => void;
  answerValue: string;
  onAnswerChange: (value: string) => void;
  onSubmitAnswer: () => void;
  feedback: { type: 'success' | 'error' | 'info'; message: string } | null;
  onSkip: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  currentIndex,
  totalCards,
  onEdit,
  onDelete,
  isFlipped,
  onFlip,
  answerValue,
  onAnswerChange,
  onSubmitAnswer,
  feedback,
  onSkip,
  inputRef,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      onFlip();
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isAnimating, onFlip]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmitAnswer();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div className="mb-4 text-center">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Card {currentIndex + 1} of {totalCards}
        </span>
      </div>

      <div
        className="relative mb-6 aspect-[3/2] w-full cursor-pointer [perspective:1000px]"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-expanded={isFlipped}
        aria-label="Flashcard. Click to flip."
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        <div
          className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <div
              className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-800"
              onClick={(event) => event.stopPropagation()}
            >
              <span className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Question
              </span>
              <p className="text-center text-xl font-medium leading-relaxed text-slate-800 dark:text-slate-100 md:text-2xl">
                {card.question}
              </p>

              {!isFlipped && (
                <div className="mt-6 w-full space-y-3">
                  <label htmlFor="quiz-answer" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Your Answer
                  </label>
                  <input
                    ref={inputRef}
                    id="quiz-answer"
                    value={answerValue}
                    onChange={(event) => onAnswerChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your answer..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-500/30"
                  />

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={onSubmitAnswer}
                      disabled={!answerValue.trim()}
                      className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
                    >
                      <Send className="h-4 w-4" />
                      <span>Submit Answer</span>
                    </button>
                    <button
                      type="button"
                      onClick={onSkip}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <SkipForward className="h-4 w-4" />
                      <span>Skip</span>
                    </button>
                  </div>

                  {feedback && (
                    <p className={`text-sm font-semibold ${feedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {feedback.message}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <Eye className="h-4 w-4" />
                <span className="text-sm">Click to reveal answer</span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-8 shadow-xl">
              <span className="mb-4 text-xs font-semibold uppercase tracking-wider text-teal-100">
                Answer
              </span>
              <p className="text-center text-xl font-medium leading-relaxed text-white md:text-2xl">
                {card.answer}
              </p>
              <div className="mt-6 flex items-center gap-2 text-teal-100">
                <RotateCcw className="h-4 w-4" />
                <span className="text-sm">Click to flip back</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          aria-label="Edit flashcard"
        >
          <Edit2 className="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={onFlip}
          className="flex items-center gap-2 rounded-lg bg-teal-500 px-6 py-2.5 font-medium text-white shadow-md transition hover:bg-teal-600"
          aria-label={isFlipped ? 'Hide answer' : 'Show answer'}
        >
          {isFlipped ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{isFlipped ? 'Hide Answer' : 'Show Answer'}</span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 font-medium text-red-600 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          aria-label="Delete flashcard"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
