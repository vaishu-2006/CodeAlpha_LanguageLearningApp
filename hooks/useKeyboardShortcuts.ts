import { useEffect } from 'react';

interface KeyboardShortcuts {
  onPrev: () => void;
  onNext: () => void;
  onFlip: () => void;
  onAdd: () => void;
  isFirst: boolean;
  isLast: boolean;
  isModalOpen: boolean;
}

export const useKeyboardShortcuts = ({
  onPrev,
  onNext,
  onFlip,
  onAdd,
  isFirst,
  isLast,
  isModalOpen,
}: KeyboardShortcuts): void => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when modal is open or when typing in inputs
      if (
        isModalOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (!isFirst) onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (!isLast) onNext();
          break;
        case ' ':
          e.preventDefault();
          onFlip();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          onAdd();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrev, onNext, onFlip, onAdd, isFirst, isLast, isModalOpen]);
};
