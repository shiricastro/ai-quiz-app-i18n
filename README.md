# AI Quiz Generator

Full-stack React + Node.js app that generates multiple-choice quizzes via the OpenAI API.  
Supports **English & Hebrew**, **per-level difficulty** (beginner/intermediate/expert), and **local caching**.

## Features

- i18n with `i18next` + LanguageDetector (EN/HE); language persisted in `localStorage` (`lang`).
- Cache per `<topic>-<subtopic>-<lang>` for instant reloads & language switching.
- Per-level progress saved in `localStorage` (`quizProgress`): answers, score, completed.
- Regenerate **only the active level** (delta update) without losing other levels.
- Clean UI with Tailwind.

## Prerequisites

- Node.js 18+ (recommended)
- An OpenAI API key

## Getting Started

### 1. Get the code

**Option A — Clone from GitHub (recommended):**
git clone https://github.com/<YOUR_USER>/<YOUR_REPO>.git
cd <YOUR_REPO>

**Option B — Download ZIP:**
On GitHub, click “Code” → “Download ZIP”
Extract it and open a terminal in the extracted folder

### 2. Install dependencies

# Server setup (Node.js with Express)

cd server  
npm install

# Client setup (React with Vite)

cd ../client  
npm install

### 3. Environment variables (in /server)

Create server/.env (not committed) — or copy server/.env.example to server/.env and fill in values:

OPENAI_API_KEY=your_openai_key
PORT=3001

### 4. Run the app

# Start the backend server

cd server  
npm run dev # uses nodemon to auto-restart server on file changes (nodemon index.js)

# Start the frontend (React) client

cd ../client  
npm run dev

Then visit the app at:  
http://localhost:5173

## chitecture & Design Decisions

## Architecture & Design Decisions

# Frontend (React + Vite):

- Component-based with stateful logic via Hooks; multilingual UI using i18next (EN/HE) + LanguageDetector (persists lang in localStorage).
- react-i18next with react: { useSuspense: true } to avoid untranslated flashes while translations load.
- Cache key format: <normalize(topic)>-<normalize(subtopic)>-<lang> (normalization = lowercase + trim + spaces→dashes).
- Language toggle: i18n.changeLanguage(...); detector saves the selected language automatically.

# Styling (Tailwind CSS)

Utility-first CSS for a clean, responsive UI without custom CSS.

# Backend (Express):

Single REST endpoint POST /api/generate that receives { topic, subtopic, lang, levels } and returns normalized JSON of questions per level.

# OpenAI Integration

- Backend constructs prompts dynamically based on topic / subtopic / language / levels and calls the OpenAI API (e.g., GPT-3.5-Turbo).

- Responses are parsed/validated server-side before returning to the client.

# Dev Experience (Nodemon)

Development-only auto-restart of the server for faster iteration.

# State & Storage:

- localStorage.quizData — caches quiz content per <topic>-<subtopic>-<lang> for instant reloads and language switching.
- localStorage.quizProgress — stores per-level progress as { answers, score, completed } per <topic>-<subtopic>-<lang>-<level>.
- Regenerate refreshes only the active level and merges into cache without overwriting other levels.
- Language switching loads from cache when available; no data loss on refresh.

# Component Breakdown

- Header — language switching (EN/HE).
- SearchComp — topic/subtopic input, validation, cache-first lookup, then fetch.
- ResultComp — renders questions per level; manages answers, scoring, and per-level progress; supports per-level regenerate.
- QuestionList — radio selection; shows feedback and explanation after submit.
- ResultFooter — Submit / Reset / Regenerate with loading state.
- Sub-components: LevelTabs, ProgressBar, LanguageWarning.

## API (brief)

POST /api/generate
Request example: { "topic": "React", "subtopic": "Hooks", "lang": "English" | "Hebrew", "levels": ["beginner","intermediate","expert"] | ["beginner"] }
Response example: { "questions": { "beginner": [ { "question": "...", "choices": ["...","...","...","..."], "answerIndex": 1, "explanation": "..." } ], "intermediate": [...], "expert": [...] } }

## Limitations & Trade-offs

- No login/authentication — data is stored locally only.
- No database — quiz questions are saved in browser storage.
- Basic error handling (alert()).
- Assumes OpenAI responds with valid JSON — fallback checks exist but not deep.

## Folder Structure (Simplified)

/client → React frontend (with Vite)
/server → Express backend + OpenAI  
README.md → This file

.env is required inside /server but excluded from ZIP for security.

Built by — Shiri Castro
