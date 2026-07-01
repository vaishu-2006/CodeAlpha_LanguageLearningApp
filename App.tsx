import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/FlashcardContext';
import { FlashcardProvider, useFlashcards } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import Header from './components/Header';
import Flashcard from './components/FlashcardView';
import Navigation from './components/Navigation';
import CardForm from './components/CardForm';
import EmptyState from './components/EmptyState';
import SearchBar from './components/SearchBar';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Flashcard as FlashcardType } from './types/flashcard';

type FeedbackState = {
  type: 'success' | 'error' | 'info';
  message: string;
} | null;

const MainApp: React.FC = () => {
  const {
    cards,
    currentIndex,
    isLoading,
    addCard,
    editCard,
    deleteCard,
    nextCard,
    prevCard,
    goToCard,
    shuffleCards,
    filteredCards,
    searchQuery,
    setSearchQuery,
  } = useFlashcards();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashcardType | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [quizResponses, setQuizResponses] = useState<Record<string, { userAnswer: string; isCorrect: boolean; attempted: boolean }>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    cardId: string | null;
  }>({ isOpen: false, cardId: null });
  const answerInputRef = useRef<HTMLInputElement>(null);

  const currentCard = filteredCards[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === filteredCards.length - 1;

  const attemptedQuestions = Object.values(quizResponses).filter((response) => response.attempted).length;
  const correctAnswers = Object.values(quizResponses).filter((response) => response.attempted && response.isCorrect).length;
  const incorrectAnswers = attemptedQuestions - correctAnswers;
  const unansweredQuestions = filteredCards.length - attemptedQuestions;
  const accuracy = attemptedQuestions > 0 ? Math.round((correctAnswers / attemptedQuestions) * 100) : 0;
  const progressPercent = filteredCards.length > 0 ? ((currentIndex + 1) / filteredCards.length) * 100 : 0;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  useKeyboardShortcuts({
    onPrev: prevCard,
    onNext: nextCard,
    onFlip: handleFlip,
    onAdd: () => {
      setEditingCard(null);
      setIsFormOpen(true);
    },
    isFirst,
    isLast,
    isModalOpen: isFormOpen || deleteConfirm.isOpen,
  });

  const handleAddClick = useCallback(() => {
    setEditingCard(null);
    setIsFormOpen(true);
  }, []);

  const handleEditClick = useCallback(() => {
    if (currentCard) {
      setEditingCard(currentCard);
      setIsFormOpen(true);
    }
  }, [currentCard]);

  const handleDeleteClick = useCallback(() => {
    if (currentCard) {
      setDeleteConfirm({ isOpen: true, cardId: currentCard.id });
    }
  }, [currentCard]);

  const handleConfirmDelete = useCallback(() => {
    if (deleteConfirm.cardId) {
      deleteCard(deleteConfirm.cardId);
      setIsFlipped(false);
      setAnswerInput('');
      setFeedback(null);
    }
    setDeleteConfirm({ isOpen: false, cardId: null });
  }, [deleteConfirm.cardId, deleteCard]);

  const handleFormSubmit = useCallback(
    (question: string, answer: string) => {
      if (editingCard) {
        editCard(editingCard.id, question, answer);
      } else {
        addCard(question, answer);
      }
      setIsFlipped(false);
      setAnswerInput('');
      setFeedback(null);
    },
    [editingCard, editCard, addCard]
  );

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingCard(null);
  }, []);

  const handleNavigation = useCallback(
    (direction: 'prev' | 'next') => {
      if (direction === 'prev') prevCard();
      else nextCard();
      setIsFlipped(false);
      setAnswerInput('');
      setFeedback(null);
    },
    [prevCard, nextCard]
  );

  const handleAnswerSubmit = useCallback(() => {
    if (!currentCard) return;

    const trimmedAnswer = answerInput.trim();
    if (!trimmedAnswer) {
      setFeedback({ type: 'error', message: 'Please enter an answer.' });
      return;
    }

    const isCorrect = trimmedAnswer.toLowerCase() === currentCard.answer.trim().toLowerCase();
    setQuizResponses((prev) => ({
      ...prev,
      [currentCard.id]: {
        userAnswer: trimmedAnswer,
        isCorrect,
        attempted: true,
      },
    }));
    setFeedback({
      type: isCorrect ? 'success' : 'error',
      message: isCorrect ? '✅ Correct!' : '❌ Incorrect!',
    });
  }, [answerInput, currentCard]);

  const handleSkipAnswer = useCallback(() => {
    if (!currentCard) return;

    setQuizResponses((prev) => ({
      ...prev,
      [currentCard.id]: {
        userAnswer: '',
        isCorrect: false,
        attempted: false,
      },
    }));
    setAnswerInput('');
    setFeedback(null);
    setIsFlipped(true);
  }, [currentCard]);

  const handleFinishQuiz = useCallback(() => {
    setQuizCompleted(true);
    setIsFlipped(false);
    setFeedback(null);
  }, []);

  const handleRestartQuiz = useCallback(() => {
    setQuizCompleted(false);
    setQuizResponses({});
    setIsFlipped(false);
    setAnswerInput('');
    setFeedback(null);
    goToCard(0);
  }, [goToCard]);

  useEffect(() => {
    if (quizCompleted || filteredCards.length === 0) {
      return;
    }

    setIsFlipped(false);
    setAnswerInput('');
    setFeedback(null);

    const focusTimer = window.setTimeout(() => {
      answerInputRef.current?.focus();
    }, 80);

    return () => window.clearTimeout(focusTimer);
  }, [currentIndex, currentCard?.id, filteredCards.length, quizCompleted]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (quizCompleted && filteredCards.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <Header totalCards={cards.length} onAddClick={handleAddClick} />

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Quiz Completed</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">🏆 Quiz Completed!</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  You finished your flashcard quiz. Review your results and start again whenever you are ready.
                </p>
              </div>
              <button
                onClick={handleRestartQuiz}
                className="rounded-lg bg-teal-500 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-teal-600"
              >
                Restart Quiz
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500">Total Flashcards</p>
                <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">{filteredCards.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500">Attempted Questions</p>
                <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">{attemptedQuestions}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500">Correct Answers</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-600">{correctAnswers}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500">Incorrect Answers</p>
                <p className="mt-1 text-2xl font-semibold text-red-600">{incorrectAnswers}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-sm text-slate-500">Unanswered Questions</p>
                <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">{unansweredQuestions}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-sm text-slate-500">Final Score</p>
                <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">{correctAnswers}/{filteredCards.length}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 p-5 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-teal-100">Accuracy</p>
              <p className="mt-2 text-3xl font-bold">{accuracy}%</p>
              <p className="mt-2 text-sm text-teal-50">
                {accuracy >= 90
                  ? '🌟 Excellent! Outstanding performance!'
                  : accuracy >= 75
                    ? '🎉 Great Job!'
                    : accuracy >= 50
                      ? '👍 Good Effort! Keep Practicing.'
                      : '📚 Keep Learning! Practice More.'}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Review Answers</h3>
              <div className="mt-4 space-y-3">
                {filteredCards.map((card, index) => {
                  const response = quizResponses[card.id];
                  const status = response?.attempted
                    ? response.isCorrect
                      ? 'Correct'
                      : 'Incorrect'
                    : 'Unanswered';
                  const statusStyles =
                    status === 'Correct'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : status === 'Incorrect'
                        ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400'
                        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300';

                  return (
                    <div key={card.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{index + 1}. {card.question}</p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Answer: {card.answer}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-sm font-medium ${statusStyles}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Header totalCards={cards.length} onAddClick={handleAddClick} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Quiz Mode</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Live Score</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Total: {filteredCards.length}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Attempted: {attemptedQuestions}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">Correct: {correctAnswers}</span>
              <span className="rounded-full bg-red-100 px-3 py-1 text-red-700 dark:bg-red-950/40 dark:text-red-400">Incorrect: {incorrectAnswers}</span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">Accuracy: {accuracy}%</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Card {currentIndex + 1} of {filteredCards.length}</span>
              <span>{Math.round(progressPercent)}% complete</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {filteredCards.length === 0 ? (
          <EmptyState
            hasSearchQuery={!!searchQuery}
            onAddClick={handleAddClick}
            onClearSearch={() => setSearchQuery('')}
          />
        ) : (
          <>
            <Flashcard
              card={currentCard}
              currentIndex={currentIndex}
              totalCards={filteredCards.length}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              isFlipped={isFlipped}
              onFlip={handleFlip}
              answerValue={answerInput}
              onAnswerChange={setAnswerInput}
              onSubmitAnswer={handleAnswerSubmit}
              feedback={feedback}
              onSkip={handleSkipAnswer}
              inputRef={answerInputRef}
            />
            <Navigation
              currentIndex={currentIndex}
              totalCards={filteredCards.length}
              onPrev={() => handleNavigation('prev')}
              onNext={() => handleNavigation('next')}
              onShuffle={shuffleCards}
              onFinishQuiz={isLast ? handleFinishQuiz : undefined}
            />
          </>
        )}
      </main>

      <CardForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingCard}
        mode={editingCard ? 'edit' : 'add'}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Flashcard"
        message="Are you sure you want to delete this flashcard? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, cardId: null })}
      />

      <Toast />

      <div className="fixed bottom-4 left-4 text-xs text-slate-500 dark:text-slate-500 hidden md:block">
        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          Enter: submit | Space: flip | Arrow keys: navigate | N: new card
        </span>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { showToast } = useToast();
  return (
    <FlashcardProvider showToast={showToast}>
      <MainApp />
    </FlashcardProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
