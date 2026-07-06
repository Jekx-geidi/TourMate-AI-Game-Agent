# TourMate AI

TourMate AI is a tourism-focused study companion for BS Tourism Management students. It combines lessons, quizzes, flashcards, note-taking, mini-games, progress tracking, maps and flags practice, language learning, and a backend AI tutor with Hermes-first and TOURMATE AGENT-fallback support.

## Features

- JWT authentication with register, login, logout, and protected profile access
- Seeded tourism subjects, lessons, quizzes, and flashcards
- Dashboard with study stats, recent activity, and recommended learning prompts
- Subject pages with study, practice, game, tourism-special, and language learning paths
- Notes CRUD with search plus AI-powered summary, flashcard, and quiz helpers
- Quiz submission with score saving, explanations, and encouraging feedback
- Flashcard review plus four working study mini-games
- Maps, flags, capitals, destinations, and airport-code practice
- AI tutor chat with backend-only provider calls
- Agent status page showing Hermes and TOURMATE AGENT readiness

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, React Router, TanStack Query, Axios
- Backend: NestJS, TypeScript, Prisma, PostgreSQL, JWT, bcrypt
- AI: Hermes Agent when available, TOURMATE AGENT fallback, local educational fallback when neither is configured

## Folder Structure

```txt
TOURMATE AI/
  frontend/
  backend/
  docker-compose.yml
  .env.example
  README.md
  tourmate_ai_mvp_prompt.md
```

## Environment Variables

Copy the root `.env.example` into `backend/.env` and update values as needed.

```env
DATABASE_URL="postgresql://tourmate:tourmate_password@localhost:5432/tourmate_ai"
JWT_SECRET="change_this_secret"
JWT_EXPIRES_IN="7d"
OPENROUTER_API_KEY=""
OPENROUTER_MODEL="openai/gpt-4o-mini"
OPENROUTER_SITE_URL="http://localhost:5173"
OPENROUTER_APP_NAME="TourMate AI"
HERMES_AGENT_URL=""
PORT=4000
FRONTEND_URL="http://localhost:5173"
CORS_ORIGINS=""
```

## Database Setup

1. Start PostgreSQL:

```bash
docker compose up -d
```

2. Create `backend/.env` from the root `.env.example`.

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Apply the schema and seed data:

```bash
npx prisma migrate dev
npx prisma db seed
```

## Local Run Without Docker

If Docker or PostgreSQL is not installed, use the local SQLite dev schema:

```bash
cd backend
set DATABASE_URL=file:./dev.db
npx prisma generate --schema prisma/schema.local.prisma
npx prisma db push --schema prisma/schema.local.prisma
npx prisma db seed
npm run start:dev
```

This is only for local preview. The main schema remains PostgreSQL.

## Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

Backend runs at `http://localhost:4000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## How To Run The Full App

1. `docker compose up -d`
2. `cd backend && npm install`
3. `cd backend && npx prisma migrate dev`
4. `cd backend && npx prisma db seed`
5. `cd backend && npm run start:dev`
6. In another terminal: `cd frontend && npm install`
7. `cd frontend && npm run dev`

## Demo Login

The seed creates this demo account:

- Email: `student@tourmate.ai`
- Password: `Tourmate123!`

You can also register a new user from the app.

## How To Test Login

1. Open `http://localhost:5173`.
2. Click `Get Started`.
3. Log in using the demo account above or register a new account.
4. Confirm redirect to `/dashboard`.

## How To Test Quiz

1. Open any subject.
2. Choose `Practice Mode` or go to `/subjects/:id/quiz`.
3. Answer the quiz.
4. Submit and confirm the score, explanations, and saved result.

## How To Test Notes

1. Open a subject notes page.
2. Create a note.
3. Edit it, search for it, and delete it.
4. Use the AI helper buttons to summarize or turn the note into study prompts.

## How To Test AI Chat

1. Add `GEMMA_API_KEY` to `backend/.env` for live AI responses.
2. Optionally set `GEMMA_MODEL` to a Gemini-compatible model.
3. Open `/ai-tutor`.
4. Ask a subject question.
5. Confirm the response includes the active provider name.

If no AI provider is configured, the backend uses a safe educational local fallback so the tutor UI still works.

## How To Connect Gemma / TOURMATE AGENT

1. Set `GEMMA_API_KEY` in `backend/.env`.
2. Optionally change `GEMMA_MODEL` for Gemini or keep `google/gemini-1.5-mini`.
3. Restart the backend.
4. Open `/agent-status` and confirm Gemma shows ready when configured.

## How To Connect Hermes Agent

1. Set `HERMES_AGENT_URL` in `backend/.env`.
2. Restart the backend.
3. Open `/agent-status`.
4. If Hermes responds, TourMate AI uses Hermes first and TOURMATE AGENT as fallback.

## Database Schema Summary

- `User`: account details, quiz results, notes, progress, and chat logs
- `Subject`: seeded tourism subjects with lessons, quizzes, and flashcards
- `Lesson`: lesson content and summaries
- `Note`: user-owned notes linked to subjects
- `Quiz` and `QuizQuestion`: quiz collections and answer explanations
- `QuizResult`: saved scores for progress tracking
- `Flashcard`: review cards by subject and category
- `Progress`: per-user learning progress by subject and category
- `ChatLog`: stored tutor conversations and provider source

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Subjects

- `GET /api/subjects`
- `GET /api/subjects/:id`
- `GET /api/subjects/code/:code`
- `GET /api/subjects/:id/lessons`

### Lessons

- `GET /api/lessons/:id`

### Notes

- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`

### Quizzes

- `GET /api/quizzes/subject/:subjectId`
- `GET /api/quizzes/:quizId`
- `POST /api/quizzes/:quizId/submit`

### Flashcards

- `GET /api/flashcards/subject/:subjectId`
- `POST /api/flashcards`
- `PUT /api/flashcards/:id`
- `DELETE /api/flashcards/:id`

### Progress

- `GET /api/progress`
- `POST /api/progress/update`
- `GET /api/progress/summary`

### AI

- `POST /api/ai/chat`
- `POST /api/ai/generate-quiz`
- `POST /api/ai/generate-notes`
- `POST /api/ai/generate-flashcards`
- `POST /api/ai/study-plan`

### Agent

- `GET /api/agent/status`
- `POST /api/agent/chat`
- `POST /api/agent/study-review`

## Frontend Pages

- `/`
- `/login`
- `/register`
- `/dashboard`
- `/subjects`
- `/subjects/:id`
- `/subjects/:id/lessons`
- `/subjects/:id/notes`
- `/subjects/:id/quiz`
- `/subjects/:id/flashcards`
- `/subjects/:id/games`
- `/language`
- `/maps-flags`
- `/ai-tutor`
- `/agent-status`
- `/profile`
- `/progress`
- `/terms`
- `/privacy`

## Known MVP Limitations

This is an MVP. It includes basic learning content, games, quizzes, AI chat, and progress tracking.
Some content is seeded sample data and should be updated by teachers or school admins later.
AI answers should be verified with official school materials.

## Next Improvements

- Add teacher/admin content management
- Add richer analytics and study streak tracking
- Add multiplayer classroom challenges
- Add image-based flag and map datasets
- Add speech practice for language learning
- Add persistent refresh-token sessions
