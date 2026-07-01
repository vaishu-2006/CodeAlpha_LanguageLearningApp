import { Flashcard, ThemeMode } from '../types/flashcard';

const FLASHCARDS_KEY = 'flashmaster_flashcards';
const THEME_KEY = 'flashmaster_theme';

export const loadFlashcardsFromStorage = (): Flashcard[] => {
  try {
    const stored = localStorage.getItem(FLASHCARDS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Flashcard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveFlashcardsToStorage = (cards: Flashcard[]): boolean => {
  try {
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(cards));
    return true;
  } catch {
    return false;
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

export const loadThemeFromStorage = (): ThemeMode => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const saveThemeToStorage = (theme: ThemeMode): boolean => {
  try {
    localStorage.setItem(THEME_KEY, theme);
    return true;
  } catch {
    return false;
  }
};
