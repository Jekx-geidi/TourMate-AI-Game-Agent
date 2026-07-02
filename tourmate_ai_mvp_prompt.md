# TourMate AI MVP — Full Build Prompt for AI Agent

Copy and paste this full prompt into your AI coding agent.

---

# ROLE

You are a senior full-stack AI application engineer. Build a complete MVP web application called **TourMate AI**.

TourMate AI is a study and learning companion app for **BS Tourism Management students**. The app helps students study their enrolled subjects using lessons, Q&A, note-taking, games, quizzes, flashcards, language learning, maps, flags, and an AI chat tutor.

The app must be beginner-friendly, educational, hospitable, and motivational.

---

# MAIN GOAL

Build an MVP learning app where the student can:

1. Register, log in, and log out.
2. Choose a subject.
3. Choose a learning category.
4. Study lessons and summaries.
5. Take notes.
6. Ask questions through AI chat.
7. Play subject-based games.
8. Practice quizzes and flashcards.
9. Learn maps, flags, countries, capitals, airport codes, and tourism destinations.
10. Learn foreign language basics.
11. Track study progress.
12. See AI/Hermes/OpenRouter status inside the app.

---

# BEST TECH STACK

Use this stack because it is suitable for a clean MVP, scalable backend, and modern UI.

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React
- React Router
- TanStack Query
- Axios

## Backend

Use **NestJS with TypeScript**.

Reason:

- Better structure than plain Express.
- Good for scalable apps.
- Good for authentication.
- Good for AI service integration.
- Easy to organize modules like auth, subjects, notes, quizzes, AI, and progress.

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT authentication
- bcrypt password hashing
- Protected API routes

## AI Integration

- OpenRouter API as the main LLM provider
- Optional Hermes Agent integration
- If Hermes is available, use Hermes first
- If Hermes is not available, fallback to OpenRouter

---

# PROJECT STRUCTURE

Create this structure:

```txt
tourmate-ai/
  frontend/
    src/
      components/
      pages/
      routes/
      services/
      hooks/
      lib/
      types/
      assets/
      App.tsx
      main.tsx
    package.json
    vite.config.ts
    tailwind.config.ts

  backend/
    src/
      auth/
      users/
      subjects/
      lessons/
      notes/
      quizzes/
      flashcards/
      games/
      progress/
      ai/
      agent/
      prisma/
      common/
      app.module.ts
      main.ts
    prisma/
      schema.prisma
      seed.ts
    package.json
    tsconfig.json

  docker-compose.yml
  .env.example
  README.md
```

---

# ENVIRONMENT VARIABLES

Create `.env.example`:

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
```

Important rule:

- Never expose `OPENROUTER_API_KEY` in the frontend.
- AI requests must go through the backend only.

---

# DOCKER COMPOSE

Create PostgreSQL docker compose:

```yaml
services:
  postgres:
    image: postgres:16
    container_name: tourmate-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: tourmate
      POSTGRES_PASSWORD: tourmate_password
      POSTGRES_DB: tourmate_ai
    ports:
      - "5432:5432"
    volumes:
      - tourmate_pg_data:/var/lib/postgresql/data

volumes:
  tourmate_pg_data:
```

---

# SUBJECTS

The app must include these subjects:

## 1. TMEL03 - Tourism Elective 3

General tourism elective. Use sample topics:

- Sustainable tourism
- Ecotourism
- Tourism trends
- Destination development
- Responsible travel

## 2. NMICE - Meetings, Incentives, Conferences, and Exhibitions

Topics:

- What is MICE?
- Meetings
- Incentive travel
- Conferences
- Exhibitions
- Event planning
- Venue selection
- Registration
- Event evaluation

## 3. AIRMGT - Airline Management

Topics:

- Airline operations
- Airport operations
- Ticketing and reservations
- Passenger handling
- Ground services
- Cabin service basics
- Airline departments
- Aviation safety
- Airline marketing

## 4. TMEL04 - Tourism Elective 4

Sample topics:

- Heritage tourism
- Cultural tourism
- Tourism innovation
- Travel technology
- Tourism product development

## 5. FOLA01 - Foreign Language 1

Topics:

- Greetings
- Self-introduction
- Numbers
- Directions
- Hotel phrases
- Airport phrases
- Restaurant phrases
- Tourist assistance phrases
- Basic translation practice

## 6. TMEL02 - Tourism Elective 2

Sample topics:

- Tourism marketing
- Tour operations
- Travel agency basics
- Itinerary planning
- Customer service

