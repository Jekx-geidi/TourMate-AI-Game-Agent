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
