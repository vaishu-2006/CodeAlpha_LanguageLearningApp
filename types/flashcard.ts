export type ThemeMode = 'light' | 'dark';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  createdAt: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface FlashcardContextValue {
  cards: Flashcard[];
  currentIndex: number;
  isLoading: boolean;
  addCard: (question: string, answer: string) => void;
  editCard: (id: string, question: string, answer: string) => void;
  deleteCard: (id: string) => void;
  goToCard: (index: number) => void;
  nextCard: () => void;
  prevCard: () => void;
  shuffleCards: () => void;
  filteredCards: Flashcard[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface QuizResponse {
  userAnswer: string;
  isCorrect: boolean;
  attempted: boolean;
}
