import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Flashcard, Toast, FlashcardContextValue } from '../types/flashcard';
import { loadFlashcardsFromStorage, saveFlashcardsToStorage, generateId } from '../utils/storage';

const FlashcardContext = createContext<FlashcardContextValue | null>(null);

export const useFlashcards = (): FlashcardContextValue => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};

interface FlashcardProviderProps {
  children: ReactNode;
  showToast: (message: string, type: Toast['type']) => void;
}

export const FlashcardProvider: React.FC<FlashcardProviderProps> = ({ children, showToast }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load cards on mount
  useEffect(() => {
    const loadedCards = loadFlashcardsFromStorage();
    setCards(loadedCards);
    setIsLoading(false);
  }, []);

  // Filter cards based on search query
  const filteredCards = React.useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery.toLowerCase();
    return cards.filter(
      (card) =>
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query)
    );
  }, [cards, searchQuery]);

  // Sync current index when filtered cards change
  useEffect(() => {
    if (filteredCards.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filteredCards.length) {
      setCurrentIndex(filteredCards.length - 1);
    }
  }, [filteredCards.length, currentIndex]);

  const persistCards = useCallback(
    (newCards: Flashcard[]): boolean => {
      const saved = saveFlashcardsToStorage(newCards);
      if (!saved) {
        showToast('Storage full or unavailable. Changes saved in memory only.', 'error');
      }
      return saved;
    },
    [showToast]
  );

  const addCard = useCallback(
    (question: string, answer: string) => {
      const newCard: Flashcard = {
        id: generateId(),
        question: question.trim(),
        answer: answer.trim(),
        createdAt: Date.now(),
      };
      const newCards = [...cards, newCard];
      setCards(newCards);
      persistCards(newCards);
      setCurrentIndex(newCards.length - 1);
      setSearchQuery('');
      showToast('Flashcard added successfully!', 'success');
    },
    [cards, persistCards, showToast]
  );

  const editCard = useCallback(
    (id: string, question: string, answer: string) => {
      const newCards = cards.map((card) =>
        card.id === id
          ? { ...card, question: question.trim(), answer: answer.trim() }
          : card
      );
      setCards(newCards);
      persistCards(newCards);
      showToast('Flashcard updated successfully!', 'success');
    },
    [cards, persistCards, showToast]
  );

  const deleteCard = useCallback(
    (id: string) => {
      const newCards = cards.filter((card) => card.id !== id);
      setCards(newCards);
      persistCards(newCards);

      // Adjust index
      const newFilteredCards = newCards.filter(
        (c) => !searchQuery || c.question.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (newFilteredCards.length === 0) {
        setCurrentIndex(0);
      } else if (currentIndex >= newFilteredCards.length) {
        setCurrentIndex(newFilteredCards.length - 1);
      }

      showToast('Flashcard deleted successfully!', 'success');
    },
    [cards, persistCards, showToast, searchQuery, currentIndex]
  );

  const goToCard = useCallback(
    (index: number) => {
      if (index >= 0 && index < filteredCards.length) {
        setCurrentIndex(index);
      }
    },
    [filteredCards.length]
  );

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, filteredCards.length - 1));
  }, [filteredCards.length]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const shuffleCards = useCallback(() => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    persistCards(shuffled);
    setCurrentIndex(0);
    showToast('Cards shuffled!', 'info');
  }, [cards, persistCards, showToast]);

  const value: FlashcardContextValue = {
    cards,
    currentIndex,
    isLoading,
    addCard,
    editCard,
    deleteCard,
    goToCard,
    nextCard,
    prevCard,
    shuffleCards,
    filteredCards,
    searchQuery,
    setSearchQuery,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};
