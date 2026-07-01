# FlashMaster - Flashcard Quiz App

A modern, responsive flashcard quiz application built with React, TypeScript, and Tailwind CSS. Create, edit, and study flashcards with a beautiful UI and smooth animations.

## Features

### Core Functionality
- **Flashcard Display**: View one flashcard at a time with question on front, answer hidden by default
- **Flip Animation**: Click or press Space to reveal the answer with a smooth 3D flip animation
- **Navigation**: Previous/Next buttons to navigate through cards; buttons disabled at start/end
- **Card Counter**: Shows "Card X of Y" position indicator
- **Add Cards**: Create new flashcards via modal form with validation
- **Edit Cards**: Edit currently displayed flashcard in-place
- **Delete Cards**: Delete with confirmation prompt; auto-navigates to appropriate card
- **Local Storage Persistence**: All cards persist in browser under key `flashcards_v1`
- **Sample Data**: Initializes with 5 sample cards on first run

### User Experience
- **Dark/Light Theme Toggle**: Switch between themes; preference persisted in Local Storage
- **Search**: Live search filtering by question or answer text
- **Shuffle**: Randomize card order
- **Toast Notifications**: Success/error feedback for all actions
- **Keyboard Shortcuts**:
  - `Space` - Flip card
  - `Left Arrow` - Previous card
  - `Right Arrow` - Next card
  - `N` - Add new card
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: Semantic HTML, ARIA labels, keyboard focus states

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

4. Build for production:
   ```bash
   npm run build
   ```

## Testing Checklist

- [x] Add several cards -> persist after reload
- [x] Edit a card -> updates immediately and persists
- [x] Delete a card -> confirmation shown; UI updates and persists
- [x] Navigation: Prev/Next buttons disabled properly at ends
- [x] Show Answer works and toggles with animation
- [x] Spacebar triggers show answer
- [x] Arrow keys navigate cards
- [x] Dark mode toggle works and persists
- [x] Search filters cards correctly
- [x] Shuffle randomizes cards
- [x] Responsive layout on mobile/tablet/desktop
- [x] No console errors

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/
│   ├── CardForm.tsx        # Add/Edit modal form
│   ├── ConfirmDialog.tsx   # Delete confirmation dialog
│   ├── EmptyState.tsx      # Empty state UI
│   ├── FlashcardView.tsx   # Main flashcard component
│   ├── Header.tsx          # App header with controls
│   ├── Navigation.tsx      # Prev/Next/Shuffle buttons
│   ├── SearchBar.tsx       # Search input
│   └── Toast.tsx           # Notification toast
├── context/
│   ├── FlashcardContext.tsx  # Flashcard state management
│   ├── ThemeContext.tsx      # Theme provider (actually in FlashcardContext file)
│   └── ToastContext.tsx      # Toast notifications
├── hooks/
│   └── useKeyboardShortcuts.ts  # Keyboard event handling
├── types/
│   └── flashcard.ts        # TypeScript interfaces
├── utils/
│   ├── constants.ts        # App constants and sample data
│   └── storage.ts          # LocalStorage utilities
├── App.tsx                 # Main app component
├── index.css               # Global styles
└── main.tsx                # Entry point
```

## Local Storage Keys

- `flashcards_v1` - Stores the array of flashcard objects
- `flashcards_theme_v1` - Stores the theme preference ('light' or 'dark')
