import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { Flashcard } from '../types/flashcard';

interface CardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string, answer: string) => void;
  initialData?: Flashcard | null;
  mode: 'add' | 'edit';
}

const CardForm: React.FC<CardFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});
  const questionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setQuestion(initialData.question);
        setAnswer(initialData.answer);
      } else {
        setQuestion('');
        setAnswer('');
      }
      setErrors({});
      setTimeout(() => questionRef.current?.focus(), 100);
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const newErrors: { question?: string; answer?: string } = {};
    if (!question.trim()) {
      newErrors.question = 'Question is required';
    }
    if (!answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(question, answer);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 id="modal-title" className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {mode === 'add' ? 'Add New Flashcard' : 'Edit Flashcard'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Question
            </label>
            <textarea
              ref={questionRef}
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.question
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500'
              } bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none`}
              placeholder="Enter your question..."
            />
            {errors.question && (
              <p className="mt-1.5 text-sm text-red-500">{errors.question}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Answer
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.answer
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500'
              } bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none`}
              placeholder="Enter the answer..."
            />
            {errors.answer && (
              <p className="mt-1.5 text-sm text-red-500">{errors.answer}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium shadow-md"
            >
              {mode === 'add' ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{mode === 'add' ? 'Add Card' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardForm;
