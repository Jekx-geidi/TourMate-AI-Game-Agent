# TourMate AI MVP — Full Build Prompt for AI Agent

Copy and paste this full prompt into your AI coding agent.

**Updated version:** This prompt now strongly requires real interactive JavaScript/TypeScript behavior, not static UI only.

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

## 7. PAFIT3 - Physical Activities Toward Health and Fitness 3

Topics:

- Physical fitness
- Wellness
- Exercise safety
- Sportsmanship
- Health habits
- Warm-up and cool-down
- Basic fitness planning

---

# LEARNING CATEGORIES

When the user chooses a subject, show category cards.

## Study Mode

Includes:

- Lessons
- Short summaries
- Key terms
- Review notes
- Q&A

## Practice Mode

Includes:

- Multiple choice quiz
- True or false
- Fill in the blanks
- Flashcards
- Mock exam

## Game Mode

Includes:

- Term matching
- Timed quiz
- Memory cards
- Scenario game
- Guess the term

## Tourism Special Mode

Includes:

- Map learning
- Country flags
- Capitals
- Tourist destinations
- Airport codes
- Airline terms
- Event planning scenarios

## Language Mode

Mostly for FOLA01, but can also be accessed globally.

Includes:

- Greetings
- Basic vocabulary
- Translation practice
- Tourist conversations
- Hotel conversation
- Airport conversation
- Direction phrases

---

# CORE FEATURES

## Authentication

Create:

- Register page
- Login page
- Logout function
- Protected dashboard
- User profile

Register fields:

- Name
- Email
- Password
- Confirm password

Login fields:

- Email
- Password

Rules:

- Hash passwords with bcrypt.
- Use JWT.
- Validate inputs.
- Show friendly error messages.

---

# AI TUTOR

Create an AI chat feature called **TourMate AI Tutor**.

The AI tutor must be inside the app and available from:

- Dashboard
- Subject detail page
- AI Tutor page
- Floating chat button

## AI Tutor Behavior

The AI must speak in a warm, hospitable, encouraging tone.

It should often ask:

- “How are your studies today?”
- “What did you achieve today?”
- “Do you want a quick review or a challenge quiz?”

The AI can generate:

- Simple explanations
- Study notes
- Flashcards
- Quiz questions
- Mock exams
- Review summaries
- Study plans
- Memory tips
- Subject-based Q&A
- Language practice
- Tourism scenarios

## AI Tutor System Prompt

Use this exact system prompt in the backend AI service:

```txt
You are TourMate AI, a warm and hospitable study companion for BS Tourism Management students.
Speak in simple, friendly, encouraging English.
Help the student understand Tourism, Airline Management, MICE, Foreign Language, PE, and Tourism Elective subjects.
Always support the student emotionally and academically.
Ask how their studies are going, what they achieved today, and what they want to improve.
Never shame the student.
Never encourage cheating or academic dishonesty.
Explain difficult concepts using examples from tourism, hotels, airlines, events, maps, countries, destinations, customer service, and real-life travel situations.
When the student asks for answers, explain the reasoning so they can learn.
When useful, offer a short quiz or flashcard review.
Keep explanations clear and beginner-friendly.
```

---

# AI PROVIDER LOGIC

Create backend service logic:

```txt
If HERMES_AGENT_URL exists and Hermes responds successfully:
  send chat request to Hermes Agent
else:
  send chat request to OpenRouter
```

## OpenRouter API

Create backend endpoint:

```txt
POST /api/ai/chat
```

Request:

```json
{
  "message": "Explain MICE in simple terms",
  "subjectCode": "NMICE"
}
```

Response:

```json
{
  "reply": "MICE means Meetings, Incentives, Conferences, and Exhibitions...",
  "provider": "openrouter"
}
```

## Hermes Agent Integration

Create these endpoints:

```txt
GET /api/agent/status
POST /api/agent/chat
POST /api/agent/study-review
```

Agent status page must show:

- Hermes status
- OpenRouter fallback status
- Current AI provider
- Last checked time
- Last AI response provider
- Study activity summary

If Hermes is not configured, show:

```txt
Hermes Agent is not connected yet. TourMate AI is using OpenRouter fallback.
```

---

# DATABASE SCHEMA

Use Prisma.

Create this schema and improve if needed:

```prisma
model User {
  id          String       @id @default(uuid())
  name        String
  email       String       @unique
  password    String
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  notes       Note[]
  progress    Progress[]
  quizResults QuizResult[]
  chatLogs    ChatLog[]
}

model Subject {
  id          String      @id @default(uuid())
  code        String      @unique
  title       String
  description String
  icon        String?
  color       String?
  lessons     Lesson[]
  quizzes     Quiz[]
  flashcards  Flashcard[]
  createdAt   DateTime    @default(now())
}

model Lesson {
  id        String   @id @default(uuid())
  subjectId String
  title     String
  content   String
  summary   String?
  order     Int      @default(0)
  subject   Subject  @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model Note {
  id        String   @id @default(uuid())
  userId    String
  subjectId String
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Quiz {
  id        String         @id @default(uuid())
  subjectId String
  title     String
  type      String         @default("multiple_choice")
  questions QuizQuestion[]
  subject   Subject        @relation(fields: [subjectId], references: [id], onDelete: Cascade)
}

model QuizQuestion {
  id          String @id @default(uuid())
  quizId      String
  question    String
  optionA     String
  optionB     String
  optionC     String
  optionD     String
  answer      String
  explanation String
  quiz        Quiz   @relation(fields: [quizId], references: [id], onDelete: Cascade)
}

model QuizResult {
  id        String   @id @default(uuid())
  userId    String
  quizId    String
  score     Int
  total     Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Flashcard {
  id        String   @id @default(uuid())
  subjectId String
  front     String
  back      String
  category  String?
  subject   Subject  @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model Progress {
  id        String   @id @default(uuid())
  userId    String
  subjectId String
  category  String
  percent   Int      @default(0)
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ChatLog {
  id        String   @id @default(uuid())
  userId    String
  subjectId String?
  message   String
  reply     String
  provider  String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

# API ROUTES

## Auth

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

## Subjects

```txt
GET /api/subjects
GET /api/subjects/:id
GET /api/subjects/code/:code
GET /api/subjects/:id/lessons
```

## Lessons

```txt
GET /api/lessons/:id
```

## Notes

```txt
GET /api/notes
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id
```

## Quizzes

```txt
GET /api/quizzes/subject/:subjectId
GET /api/quizzes/:quizId
POST /api/quizzes/:quizId/submit
```

## Flashcards

```txt
GET /api/flashcards/subject/:subjectId
POST /api/flashcards
PUT /api/flashcards/:id
DELETE /api/flashcards/:id
```

## Progress

```txt
GET /api/progress
POST /api/progress/update
GET /api/progress/summary
```

## AI

```txt
POST /api/ai/chat
POST /api/ai/generate-quiz
POST /api/ai/generate-notes
POST /api/ai/generate-flashcards
POST /api/ai/study-plan
```

## Agent

```txt
GET /api/agent/status
POST /api/agent/chat
POST /api/agent/study-review
```

---

# FRONTEND PAGES

Create these pages:

```txt
/
/login
/register
/dashboard
/subjects
/subjects/:id
/subjects/:id/lessons
/subjects/:id/notes
/subjects/:id/quiz
/subjects/:id/flashcards
/subjects/:id/games
/language
/maps-flags
/ai-tutor
/agent-status
/profile
/progress
/terms
/privacy
```

---

# DASHBOARD REQUIREMENTS

Dashboard must show:

- Welcome message: “Welcome back, [Name]!”
- Hospitable question: “How are your studies today?”
- Another question: “What did you achieve today?”
- Study streak card
- Total notes card
- Quiz average card
- Overall progress card
- Subject progress cards
- Continue learning button
- AI Tutor button
- Recommended activity today
- Recent notes
- Recent quiz results

---

# UI STYLE GUIDE

Design style:

- Modern student dashboard
- Tourism-inspired
- Clean and friendly
- Rounded cards
- Soft shadows
- Smooth hover effects
- Mobile responsive
- Dark mode ready
- Friendly micro-interactions

## Color Palette

```txt
Primary Teal: #0F766E
Secondary Blue: #2563EB
Accent Amber: #F59E0B
Soft Sky: #E0F2FE
Soft Mint: #CCFBF1
Background Light: #F8FAFC
Background Dark: #0F172A
Card Light: #FFFFFF
Card Dark: #1E293B
Text Main: #0F172A
Text Muted: #64748B
Success: #22C55E
Warning: #F97316
Danger: #EF4444
Border: #E2E8F0
```

## Font

Use:

```txt
Inter or system sans-serif
```

## Icons

Use Lucide icons:

- Plane
- Map
- Globe
- BookOpen
- NotebookPen
- Languages
- Flag
- CalendarDays
- GraduationCap
- Trophy
- Sparkles
- MessageCircle
- Gamepad2

---

# COMPONENTS

Create reusable components:

```txt
Navbar
Sidebar
ProtectedRoute
SubjectCard
CategoryCard
ProgressCard
LessonCard
NoteEditor
QuizCard
Flashcard
GameCard
ChatBox
AgentStatusCard
StatCard
EmptyState
LoadingSpinner
ErrorMessage
```

---

# GAME FEATURES

Create at least 4 working mini-games.

## 1. Flashcard Flip Game

Logic:

- Show question on front.
- Click to flip.
- Show answer on back.
- Buttons: Learned, Review Again.
- Update progress.

## 2. Timed Quiz Game

Logic:

- 10 questions.
- Countdown timer.
- Score screen.
- Show correct answers and explanations.
- Save score to database.

## 3. Match the Term Game

Logic:

- Left column: tourism terms.
- Right column: definitions.
- User matches term to definition.
- Show correct/incorrect.

Example terms:

```txt
MICE = Meetings, Incentives, Conferences, and Exhibitions
Itinerary = A travel schedule or plan
Ground Handling = Airport services for passengers and aircraft
Ecotourism = Responsible travel to natural areas
```

## 4. Flag Guessing Game

Logic:

- Show flag emoji or image.
- User chooses country.
- Show correct answer.
- Track score.

Sample data:

```txt
🇵🇭 Philippines
🇯🇵 Japan
🇰🇷 South Korea
🇹🇭 Thailand
🇸🇬 Singapore
🇫🇷 France
🇮🇹 Italy
🇺🇸 United States
```

Bonus games if possible:

- Airport code guessing game
- Destination map guessing game
- Tourism scenario decision game

---

# MAPS AND FLAGS MODULE

Create a page `/maps-flags`.

Features:

- Country flashcards
- Flag guessing
- Capital quiz
- Continent filter
- Popular tourist destination cards
- Airport code practice

Sample airport codes:

```txt
MNL - Manila Ninoy Aquino International Airport
CEB - Mactan-Cebu International Airport
NRT - Narita International Airport
HND - Haneda Airport
ICN - Incheon International Airport
SIN - Singapore Changi Airport
BKK - Suvarnabhumi Airport
LAX - Los Angeles International Airport
JFK - John F. Kennedy International Airport
```

---

# LANGUAGE MODULE

Create `/language` page.

Features:

- Greetings
- Self-introduction
- Common tourist phrases
- Hotel phrases
- Airport phrases
- Restaurant phrases
- Translation practice
- AI conversation practice

Sample phrases:

```txt
Hello
Good morning
Thank you
Where is the airport?
How much is this?
I have a reservation.
Can you help me?
Welcome to our hotel.
Please follow me.
Enjoy your stay.
```

---

# SUBJECT DETAIL PAGE

Each subject page must show:

- Subject code
- Subject title
- Description
- Progress percentage
- Learning category cards
- Recent notes
- Start lesson button
- Ask AI Tutor button
- Recommended game

Learning category cards:

```txt
Study Mode
Practice Mode
Game Mode
Tourism Special Mode
Language Mode
```

---

# NOTES FEATURE

Students can:

- Create note
- Edit note
- Delete note
- View notes by subject
- Search notes
- Ask AI to summarize note
- Ask AI to turn note into flashcards
- Ask AI to create quiz from note

Note editor should be simple and clean.

---

# QUIZ FEATURE

Quiz requirements:

- Multiple choice questions
- Score calculation
- Save result
- Show explanation after submission
- Track subject progress
- AI-generated quiz option

Quiz result page:

- Score
- Percentage
- Correct answers
- Mistakes
- Explanation
- Encouraging message

Example encouraging messages:

```txt
Great effort! Every attempt helps you improve.
Nice work! Want to try a harder challenge?
You are improving. Keep going, future tourism professional!
```

---

# SEED DATA REQUIREMENTS

Seed database with:

- All 7 subjects
- At least 3 lessons per subject
- At least 10 quiz questions per subject
- At least 10 flashcards per subject
- Sample maps and flags data can be static frontend data or backend seed data

---

# SAMPLE LESSON CONTENT

## NMICE Lesson Example

Title:

```txt
Introduction to MICE
```

Content:

```txt
MICE stands for Meetings, Incentives, Conferences, and Exhibitions. It is a major part of the tourism industry because people travel for business events, company rewards, conventions, trade shows, and professional gatherings.

A meeting is a formal gathering for discussion. Incentive travel is a reward trip given by a company to employees or partners. A conference is a large event where people discuss professional topics. An exhibition is an event where businesses display products or services.
```

## AIRMGT Lesson Example

Title:

```txt
Introduction to Airline Management
```

Content:

```txt
Airline Management is the study of how airlines operate and serve passengers. It includes ticketing, reservations, flight scheduling, ground handling, passenger service, safety, marketing, and airline business operations.

Students who study Airline Management can work in airlines, airports, travel agencies, ticketing offices, and customer service roles.
```

## FOLA01 Lesson Example

Title:

```txt
Basic Tourist Greetings
```

Content:

```txt
Foreign language skills are important in tourism because tourism professionals often speak with international guests. Basic greetings help create a welcoming and respectful experience.

Examples:
Hello.
Good morning.
Thank you.
Welcome.
How can I help you?
Enjoy your stay.
```

---

# TERMS AND CONDITIONS PAGE

Create `/terms` page with this simple content:

```txt
TourMate AI is a study support application. It is designed to help students review, practice, and improve their learning habits.

TourMate AI does not replace official school materials, instructors, modules, or academic requirements.

AI-generated answers may contain mistakes. Students should verify important information with teachers, official references, and school materials.

Users must not use the app for cheating, plagiarism, or academic dishonesty.

The app is for learning, reviewing, practicing, note-taking, and improving study confidence.
```

---

# PRIVACY POLICY PAGE

Create `/privacy` page with this simple content:

```txt
TourMate AI stores user account details, notes, quiz scores, chat logs, and study progress.

Passwords must be securely hashed and never stored as plain text.

The app may send study questions to AI providers such as OpenRouter or Hermes Agent to generate learning support.

Users should not send sensitive personal information in the AI chat.

The app is built for educational support and student productivity.
```

---

# SECURITY RULES

Follow these rules:

- Do not expose API keys in frontend.
- Hash passwords using bcrypt.
- Use JWT protected routes.
- Validate request inputs.
- Add CORS configuration.
- Add error handling.
- Never store plain passwords.
- Do not allow users to access another user's notes or progress.
- Use environment variables.

---

# BACKEND LOGIC RULES

Use NestJS modules:

```txt
AuthModule
UsersModule
SubjectsModule
LessonsModule
NotesModule
QuizzesModule
FlashcardsModule
ProgressModule
AiModule
AgentModule
PrismaModule
```

Use DTOs for validation.

Use guards for protected routes.

Use services for business logic.

Use Prisma for database queries.

---

# FRONTEND LOGIC RULES

Use:

- React Router for routes
- Axios API client
- TanStack Query for data fetching
- Auth context or Zustand for auth state
- ProtectedRoute component
- shadcn/ui components
- Tailwind utility classes

Create API client:

```txt
frontend/src/services/api.ts
```

Create auth service:

```txt
frontend/src/services/auth.service.ts
```

Create AI service:

```txt
frontend/src/services/ai.service.ts
```

---

# LOCAL RUN COMMANDS

The project must run with these commands:

```bash
# Start database
docker compose up -d

# Backend
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

Backend URL:

```txt
http://localhost:4000
```

---

# README REQUIREMENTS

Create a clear README with:

1. App overview
2. Features
3. Tech stack
4. Folder structure
5. Environment variables
6. Database setup
7. Backend setup
8. Frontend setup
9. How to run the app
10. How to test login
11. How to test AI chat
12. How to connect OpenRouter
13. How to connect Hermes Agent
14. Known MVP limitations
15. Next improvements

---

# MVP LIMITATIONS

Mention these in README:

```txt
This is an MVP. It includes basic learning content, games, quizzes, AI chat, and progress tracking.
Some content is seeded sample data and should be updated by teachers or school admins later.
AI answers should be verified with official school materials.
```


---

# IMPORTANT INTERACTIVITY UPDATE — DO NOT MAKE STATIC UI

The app must feel alive and interactive. Do **not** build plain static pages. Every main feature must have real JavaScript/TypeScript interaction using React state, events, forms, timers, filters, drag/click behavior, API calls, loading states, and progress updates.

Use React + TypeScript for all interactive frontend logic. Use JavaScript/TypeScript functions clearly, not only HTML layout.

## Required Interactive Behavior

### Global App Interactions

- Sidebar opens/closes on mobile.
- Dark mode toggle must work.
- User profile dropdown must open/close.
- Protected routes must redirect if not logged in.
- Loading spinners must show while fetching data.
- Empty states must show when no notes, quizzes, or progress exist.
- Toast notifications must show for save, delete, login, quiz result, and AI errors.
- Smooth page transitions using Framer Motion.

### Dashboard Interactions

Dashboard must include:

- Daily study check-in form.
- Clickable subject progress cards.
- Recommended activity button.
- Quick action buttons:
  - Start quiz
  - Open AI Tutor
  - Create note
  - Continue lesson
- Interactive progress bars.
- Study streak counter.
- Today achievement input.
- Local UI state for selected study mood:
  - Motivated
  - Tired
  - Confused
  - Ready for challenge

### Subject Page Interactions

Each subject page must include:

- Search lessons by keyword.
- Filter learning categories.
- Clickable category tabs.
- Expand/collapse lesson summaries.
- Start lesson button.
- Ask AI about this subject button.
- Progress updates after activity completion.

### Notes Interactions

Notes feature must include:

- Create note form.
- Edit note inline.
- Delete confirmation modal.
- Search notes.
- Filter notes by subject.
- Autosave draft in localStorage before saving to backend.
- AI buttons:
  - Summarize this note
  - Turn into quiz
  - Turn into flashcards

### Quiz Interactions

Quiz must be fully interactive:

- One question shown at a time.
- User selects answer.
- Next and previous buttons.
- Progress indicator.
- Submit button.
- Score calculation.
- Correct/incorrect feedback.
- Explanation screen.
- Save score to backend.
- Retake quiz button.

### Timed Quiz Interactions

Timed quiz must include:

- Countdown timer.
- Auto-submit when timer reaches 0.
- Warning color when time is low.
- Score summary.
- Review answers.

### Flashcard Interactions

Flashcards must include:

- Click card to flip.
- Next/previous buttons.
- Shuffle button.
- Learned button.
- Review again button.
- Progress tracker.
- Smooth flip animation.

### Games Interactions

Games must not be fake. Implement real playable logic.

Required games:

1. Flashcard Flip Game
2. Timed Quiz Game
3. Match the Term Game
4. Flag Guessing Game

Optional bonus games:

- Airport Code Guessing Game
- Destination Guessing Game
- Tourism Scenario Decision Game

### AI Tutor Interactions

AI Tutor must include:

- Chat input.
- Send button.
- Enter key support.
- Loading bubble while waiting.
- Message history.
- Subject context selector.
- Suggested prompt chips.
- Clear chat button.
- Provider badge:
  - Hermes
  - OpenRouter
- Error handling if AI provider fails.

Suggested prompt chips:

```txt
Explain this lesson
Create a 5-item quiz
Give me flashcards
Make a study plan
Ask me a challenge question
Summarize my notes
Practice tourist conversation
```

### Agent Status Interactions

Agent status page must include:

- Check status button.
- Auto-refresh every 30 seconds.
- Status indicator:
  - Connected
  - Fallback active
  - Offline
- Last checked timestamp.
- Current provider.
- Recent AI request logs.

---

# REQUIRED FRONTEND INTERACTIVE COMPONENTS

Create these React components with TypeScript logic.

```txt
frontend/src/components/interactive/DailyCheckIn.tsx
frontend/src/components/interactive/SubjectSearch.tsx
frontend/src/components/interactive/CategoryTabs.tsx
frontend/src/components/interactive/InteractiveQuiz.tsx
frontend/src/components/interactive/TimedQuiz.tsx
frontend/src/components/interactive/FlashcardFlip.tsx
frontend/src/components/interactive/MatchTermGame.tsx
frontend/src/components/interactive/FlagGuessGame.tsx
frontend/src/components/interactive/AIChatBox.tsx
frontend/src/components/interactive/AgentStatusPanel.tsx
frontend/src/hooks/useCountdown.ts
frontend/src/hooks/useLocalStorage.ts
frontend/src/hooks/useDebounce.ts
```

---

# REQUIRED JAVASCRIPT / TYPESCRIPT LOGIC EXAMPLES

Use these examples as guidance. Improve them as needed.

## Flashcard Flip Component

```tsx
import { useState } from "react";
import { motion } from "framer-motion";

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type Props = {
  cards: Flashcard[];
  onProgress?: (learnedCount: number) => void;
};

export function FlashcardFlip({ cards, onProgress }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnedIds, setLearnedIds] = useState<string[]>([]);

  const current = cards[index];

  function nextCard() {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  }

  function previousCard() {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }

  function markLearned() {
    if (!learnedIds.includes(current.id)) {
      const updated = [...learnedIds, current.id];
      setLearnedIds(updated);
      onProgress?.(updated.length);
    }
    nextCard();
  }

  if (!cards.length) {
    return <p>No flashcards available yet.</p>;
  }

  return (
    <div className="space-y-4">
      <motion.button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className="min-h-56 w-full rounded-2xl border bg-white p-8 text-center shadow-md dark:bg-slate-800"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-xl font-semibold">
          {flipped ? current.back : current.front}
        </div>
        <p className="mt-4 text-sm text-slate-500">Click to flip</p>
      </motion.button>

      <div className="flex flex-wrap gap-2">
        <button onClick={previousCard} className="rounded-lg border px-4 py-2">Previous</button>
        <button onClick={nextCard} className="rounded-lg border px-4 py-2">Next</button>
        <button onClick={markLearned} className="rounded-lg bg-teal-700 px-4 py-2 text-white">Learned</button>
      </div>

      <p className="text-sm text-slate-500">
        Learned {learnedIds.length} of {cards.length}
      </p>
    </div>
  );
}
```

## Timed Quiz Hook

```tsx
import { useEffect, useState } from "react";

export function useCountdown(initialSeconds: number, onDone: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      onDone();
      setIsRunning(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft, isRunning, onDone]);

  function start() {
    setIsRunning(true);
  }

  function reset() {
    setSecondsLeft(initialSeconds);
    setIsRunning(false);
  }

  return { secondsLeft, isRunning, start, reset };
}
```

## Interactive Quiz Component

```tsx
import { useState } from "react";

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type Props = {
  questions: Question[];
  onSubmitScore: (score: number, total: number) => Promise<void>;
};

export function InteractiveQuiz({ questions, onSubmitScore }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const current = questions[currentIndex];

  function selectAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function calculateScore() {
    return questions.reduce((score, item) => {
      return answers[item.id] === item.answer ? score + 1 : score;
    }, 0);
  }

  async function submitQuiz() {
    setIsSaving(true);
    const score = calculateScore();
    await onSubmitScore(score, questions.length);
    setSubmitted(true);
    setIsSaving(false);
  }

  if (!questions.length) return <p>No quiz questions available.</p>;

  if (submitted) {
    const score = calculateScore();
    return (
      <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-800">
        <h2 className="text-2xl font-bold">Quiz Result</h2>
        <p>You scored {score} out of {questions.length}.</p>
        {questions.map((item) => (
          <div key={item.id} className="rounded-xl border p-4">
            <p className="font-semibold">{item.question}</p>
            <p>Your answer: {answers[item.id] || "No answer"}</p>
            <p>Correct answer: {item.answer}</p>
            <p className="text-sm text-slate-500">{item.explanation}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
        <p className="text-sm text-slate-500">Answered {Object.keys(answers).length}/{questions.length}</p>
      </div>

      <h2 className="text-xl font-semibold">{current.question}</h2>

      <div className="grid gap-3">
        {current.options.map((option) => (
          <button
            key={option}
            onClick={() => selectAnswer(option)}
            className={`rounded-xl border p-4 text-left transition hover:bg-teal-50 dark:hover:bg-slate-700 ${
              answers[current.id] === option ? "border-teal-700 bg-teal-50 dark:bg-slate-700" : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((value) => value - 1)}
          className="rounded-lg border px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={currentIndex === questions.length - 1}
          onClick={() => setCurrentIndex((value) => value + 1)}
          className="rounded-lg border px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
        <button
          disabled={isSaving}
          onClick={submitQuiz}
          className="rounded-lg bg-teal-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
```

## Match the Term Game

```tsx
import { useMemo, useState } from "react";

type MatchItem = {
  id: string;
  term: string;
  definition: string;
};

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function MatchTermGame({ items }: { items: MatchItem[] }) {
  const definitions = useMemo(() => shuffle(items), [items]);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  function chooseDefinition(definitionId: string) {
    if (!selectedTermId) return;
    setMatches((prev) => ({ ...prev, [selectedTermId]: definitionId }));
    setSelectedTermId(null);
  }

  const score = Object.entries(matches).filter(([termId, definitionId]) => termId === definitionId).length;

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-amber-50 p-4 text-amber-900">
        Score: {score}/{items.length}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="font-semibold">Terms</h3>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTermId(item.id)}
              className={`w-full rounded-xl border p-3 text-left ${selectedTermId === item.id ? "border-teal-700 bg-teal-50" : ""}`}
            >
              {item.term}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Definitions</h3>
          {definitions.map((item) => (
            <button
              key={item.id}
              onClick={() => chooseDefinition(item.id)}
              className="w-full rounded-xl border p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              {item.definition}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Flag Guessing Game

```tsx
import { useState } from "react";

type FlagQuestion = {
  flag: string;
  answer: string;
  options: string[];
};

export function FlagGuessGame({ questions }: { questions: FlagQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const current = questions[index];
  const isCorrect = selected === current.answer;

  function choose(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore((value) => value + 1);
  }

  function next() {
    setSelected(null);
    setIndex((value) => (value + 1) % questions.length);
  }

  return (
    <div className="space-y-4 rounded-2xl border bg-white p-6 text-center shadow-sm dark:bg-slate-800">
      <p className="text-sm text-slate-500">Score: {score}</p>
      <div className="text-7xl">{current.flag}</div>
      <h2 className="text-xl font-bold">Which country is this?</h2>

      <div className="grid gap-3 md:grid-cols-2">
        {current.options.map((option) => (
          <button
            key={option}
            onClick={() => choose(option)}
            className="rounded-xl border p-3 hover:bg-teal-50 dark:hover:bg-slate-700"
          >
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <div className={isCorrect ? "text-green-600" : "text-red-600"}>
          {isCorrect ? "Correct! Great job." : `Not quite. The correct answer is ${current.answer}.`}
        </div>
      )}

      <button onClick={next} className="rounded-lg bg-teal-700 px-4 py-2 text-white">
        Next Flag
      </button>
    </div>
  );
}
```

## AI Chat Box

```tsx
import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  provider?: string;
};

export function AIChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Welcome to TourMate AI! How are your studies today? What did you achieve today?",
      provider: "system"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(messageText = input) {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText })
      });

      if (!response.ok) throw new Error("AI request failed");

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, provider: data.provider }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I could not reach the AI tutor right now. Please try again.",
          provider: "error"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "Explain MICE simply",
    "Create a 5-item quiz",
    "Give me flashcards",
    "Make a study plan"
  ];

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border bg-white shadow-sm dark:bg-slate-800">
      <div className="border-b p-4">
        <h2 className="font-bold">TourMate AI Tutor</h2>
        <p className="text-sm text-slate-500">Hospitable study companion</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] rounded-2xl p-3 ${
              message.role === "user" ? "ml-auto bg-teal-700 text-white" : "bg-slate-100 dark:bg-slate-700"
            }`}
          >
            <p>{message.content}</p>
            {message.provider && <p className="mt-1 text-xs opacity-70">{message.provider}</p>}
          </div>
        ))}
        {loading && <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-700">TourMate is thinking...</div>}
      </div>

      <div className="border-t p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button key={item} onClick={() => sendMessage(item)} className="rounded-full border px-3 py-1 text-sm">
              {item}
            </button>
          ))}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about your subject..."
            className="flex-1 rounded-xl border px-4 py-2 dark:bg-slate-900"
          />
          <button disabled={loading} className="rounded-xl bg-teal-700 px-4 py-2 text-white disabled:opacity-50">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
```

## Daily Check-In Component

```tsx
import { useState } from "react";

export function DailyCheckIn() {
  const [mood, setMood] = useState("Motivated");
  const [achievement, setAchievement] = useState("");
  const [saved, setSaved] = useState(false);

  function saveCheckIn() {
    localStorage.setItem(
      "tourmate_daily_checkin",
      JSON.stringify({ mood, achievement, date: new Date().toISOString() })
    );
    setSaved(true);
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-800">
      <h2 className="text-xl font-bold">How are your studies today?</h2>
      <p className="text-sm text-slate-500">Tell TourMate what you achieved today.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {["Motivated", "Tired", "Confused", "Ready for challenge"].map((item) => (
          <button
            key={item}
            onClick={() => setMood(item)}
            className={`rounded-full border px-4 py-2 ${mood === item ? "bg-teal-700 text-white" : ""}`}
          >
            {item}
          </button>
        ))}
      </div>

      <textarea
        value={achievement}
        onChange={(event) => setAchievement(event.target.value)}
        placeholder="Example: I reviewed Airline Management and finished 1 quiz."
        className="mt-4 min-h-28 w-full rounded-xl border p-3 dark:bg-slate-900"
      />

      <button onClick={saveCheckIn} className="mt-3 rounded-xl bg-teal-700 px-4 py-2 text-white">
        Save Check-In
      </button>

      {saved && <p className="mt-2 text-sm text-green-600">Saved. Great work today!</p>}
    </div>
  );
}
```

---

# INTERACTIVE SEED DATA REQUIREMENT

Add enough sample data so the interactive UI works immediately after running the app.

Include:

```txt
At least 10 quiz questions per subject
At least 10 flashcards per subject
At least 10 match-term pairs
At least 20 flags/countries/capitals
At least 10 airport code items
At least 10 tourism scenario questions
At least 20 language phrases
```

---

# INTERACTIVE ACCEPTANCE CRITERIA

The MVP is only considered complete if:

1. User can register and login.
2. User can click a subject and open a subject dashboard.
3. User can create, edit, delete, and search notes.
4. User can play flashcard flip with real card state.
5. User can answer quiz questions and get a real score.
6. User can play timed quiz with countdown timer.
7. User can match terms with definitions.
8. User can play flag guessing game.
9. User can chat with AI Tutor through backend API.
10. User can see Hermes/OpenRouter status.
11. User can save progress to backend.
12. App works on desktop and mobile.
13. App has real buttons, forms, state changes, API calls, and feedback.
14. No page should be only static placeholder text.


---

# FINAL OUTPUT EXPECTED FROM AI AGENT

After building, provide:

1. Completed project folder structure
2. Setup instructions
3. Database schema summary
4. API route list
5. Frontend page list
6. How to run backend
7. How to run frontend
8. How to test login
9. How to test quiz
10. How to test notes
11. How to test AI chat
12. How to test Hermes fallback
13. What features are completed
14. What features can be improved next

---

# IMPORTANT BUILD RULES

Follow these strictly:

- Build the actual working MVP.
- Do not create only static mock UI.
- Connect frontend to backend APIs.
- Use TypeScript.
- Keep code clean and understandable.
- Add loading states.
- Add empty states.
- Add error messages.
- Use responsive design.
- Use a hospitable and encouraging tone in the UI.
- Make the app feel like a friendly tourism study companion.
- Make the AI tutor safe, helpful, and educational.
- Do not encourage cheating.
- Keep all AI API calls in the backend.
- Make the app easy to run locally.

Build the full MVP now.
