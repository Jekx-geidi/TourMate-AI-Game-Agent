# TourMate AI — Product and Implementation Plan

**Product concept:** TourMate Quest — an AI-powered tourism learning and career-simulation web application  
**Repository:** `https://github.com/Jekx-geidi/TourMate-AI-Game-Agent.git`  
**Audience:** BS Tourism Management students  
**Plan status:** Implementation-ready  
**Audit date:** 2026-08-19  
**Canonical supporting documents:** `AGENT.md`, `CLAUDE.md`, `docs/BRD.md`, `docs/TDD.md`, `docs/UF.md`, and `docs/IA.md`

---

## 1. Product Direction

TourMate AI should evolve from a tourism study companion into a **mobile-first tourism career simulation and mastery platform** without discarding the working application.

The recommended experience name is **TourMate Quest**. The repository and product can keep the main name **TourMate AI**, while “Quest” identifies the game-based learning experience.

### One-sentence pitch

> TourMate Quest helps tourism students learn concepts, practice real service situations, receive AI coaching, and build a visible career-readiness passport through short, replayable missions.

### Core learning loop

1. **Learn** a concept through the existing lessons, notes, flashcards, maps, and language tools.
2. **Practice** through quizzes and short skill drills.
3. **Simulate** a realistic tourism workplace situation.
4. **Reflect** through deterministic scoring and AI-generated coaching.
5. **Progress** by earning persistent XP, badges, mastery, and competency evidence.
6. **Replay** to improve a score, try different decisions, and strengthen weak competencies.

### Experience pillars

- **Tourism-specific:** Every mission maps to a tourism subject, competency, or workplace role.
- **Educational before entertaining:** Game mechanics reinforce learning rather than distract from it.
- **Career-oriented:** Students practice communication, service recovery, safety, planning, sustainability, and cultural awareness.
- **Explainable scoring:** The application must show why an answer or decision earned its score.
- **Resilient AI:** The core experience remains usable when an external AI provider is unavailable.
- **Incremental delivery:** Preserve and improve the current app instead of rebuilding it.

---

## 2. Current-State Audit

The current repository already contains a useful MVP foundation. Claude must inspect the live branch before changing anything, but the audited baseline includes the following.

### Existing strengths to preserve

| Area | Current capability | Plan |
|---|---|---|
| Authentication | Register, login, JWT-based protected routes, user profile | Preserve and harden |
| Study content | Subjects, lessons, notes, quizzes, and flashcards | Keep as the “Learn” layer |
| Games | Subject games, matching, timed quiz, sequencing/scenario activities | Reuse components where practical |
| Tourism tools | Maps and flags, language practice, tourism subject content | Reorganize under labs and missions |
| AI | Tourism-oriented tutor, subject-aware behavior, provider status route | Refactor behind a stable provider gateway |
| Progress | Progress summaries and lesson/quiz activity | Extend into competencies and career evidence |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Axios, Framer Motion | Continue using the existing stack |
| Backend | NestJS, Prisma, PostgreSQL, JWT, validation, security middleware | Continue using the existing stack |
| Deployment | Existing deployment-related files and environment configuration | Verify before modifying |

### Important gaps to address

1. **Game progression is not fully durable.** XP, levels, badges, and daily challenges are currently handled in browser storage in parts of the frontend. They need a server-side source of truth.
2. **There is no persistent career-simulation domain.** The application needs entities for scenarios, sessions, decisions, results, rubrics, competencies, and evidence.
3. **AI behavior and provider configuration have drifted.** The README, status reporting, environment names, and actual provider invocation order must be normalized. The deterministic product flow must not depend on one provider.
4. **Current scenario-like games are component-level experiences.** They need a reusable engine, persistence, idempotent completion, and structured feedback.
5. **Progress is activity-focused rather than competency-focused.** Students need a career-readiness view showing what they can demonstrate.
6. **The primary navigation is feature-oriented.** It should become learner-task-oriented: Dashboard, Learn, Missions, World Lab, Language Lab, AI Coach, and Career Passport.
7. **Frontend automated test coverage is not yet a dependable release gate.** Add testing incrementally around new high-risk flows rather than attempting a large test rewrite.
8. **System/provider status is useful for development but should not be a primary learner destination.** Keep it protected and secondary.

---

## 3. Product Goals and Non-Goals

### Goals

- Give tourism students realistic, repeatable practice beyond memorization.
- Connect lessons and quizzes to workplace decisions.
- Make progress visible through competencies, not only completion percentages.
- Produce actionable, respectful feedback after each mission.
- Keep the experience useful on mobile devices and slower networks.
- Preserve existing users, content, progress, and routes during migration.
- Make the AI layer replaceable and failure-tolerant.
- Establish a foundation that can later support instructors and content authors.

### Non-goals for the first release

- A travel-booking engine or consumer trip marketplace.
- Real airline, hotel, visa, or payment transactions.
- A full learning-management system.
- Live multiplayer gameplay.
- High-stakes academic grading without instructor review.
- Unsupervised AI generation of official curriculum content.
- A complete instructor/admin portal in the first vertical slice.
- Native mobile applications; responsive web is the target.

---

## 4. Recommended Product Scope

### 4.1 Learn

Preserve the existing subject-centered study experience:

- Subject overview
- Lessons
- Notes
- Quizzes
- Flashcards
- Existing short games
- Subject-aware AI assistance

Add contextual links such as **“Practice this in a Mission”** and **“Review the lesson behind this result.”**

### 4.2 Missions

Create a reusable simulation engine with role-based, branching scenarios.

Recommended mission families aligned with the current subject set:

| Subject area | Example mission | Primary competencies |
|---|---|---|
| Airline operations | Assist a passenger during a delayed flight | Service recovery, safety, communication |
| MICE/events | Respond to a conference disruption | Planning, coordination, problem-solving |
| Travel and tour operations | Revise an itinerary after a client change | Itinerary design, feasibility, customer care |
| Sustainable tourism | Balance visitor demand and destination protection | Sustainability, ethics, stakeholder awareness |
| Tourism product development | Design a heritage experience responsibly | Product design, cultural sensitivity, visitor management |
| Foreign language | Assist an international guest in a service encounter | Language use, listening, hospitality |

Each mission should include:

- Role and context
- Learning objectives
- Estimated number of decision steps, not a time promise
- Scenario steps and choices
- Consequences or feedback after a decision when pedagogically useful
- Deterministic rubric scoring
- Optional AI narrative coaching
- Related lesson links
- Replay and improvement path

### 4.3 AI Coach

The AI Coach has three controlled roles:

1. **Tutor:** Explain tourism concepts using the selected subject context.
2. **Role-play partner:** Act as a guest, client, event stakeholder, or passenger within explicit mission boundaries.
3. **Coach:** Turn structured mission data into concise, constructive feedback.

The deterministic score remains authoritative. AI may explain and personalize feedback but must not silently change the recorded score.

### 4.4 World Lab

Group maps, flags, capitals, tourism geography, and later airport codes into one learning area.

Recommended activities:

- Identify country and flag
- Locate destination on a map
- Match capital, region, and country
- Match common airport codes in a later release
- Destination fact cards with curriculum-reviewed content

### 4.5 Language Lab

Preserve the current language practice and connect it to service situations:

- Essential tourism phrases
- Listening/reading-style prompts where assets permit
- Guest-service role-play
- Vocabulary review
- Mission links for foreign-language scenarios

### 4.6 Career Passport

Replace fragmented game-state presentation with a server-backed learner profile containing:

- XP and level
- Streak policy based on recorded activity dates
- Earned badges and achievements
- Subject mastery
- Competency progress
- Completed mission evidence
- Best and latest mission results
- Recommended next activity

---

## 5. Delivery Strategy

Work in vertical slices. A slice is complete only when its database, API, UI, validation, tests, loading/error states, and documentation are integrated.

### Phase 0 — Baseline, Safety, and Architecture Confirmation

#### Outcomes

- A clean understanding of the actual repository state.
- Reproducible local setup for frontend and backend.
- A documented baseline before feature changes.

#### Tasks

- Read the root README, package files, Prisma schemas, module registration, route configuration, API client, authentication flow, and deployment files.
- Run current build, lint, backend tests, and any available smoke checks.
- Record pre-existing failures separately; do not hide them inside feature work.
- Verify whether root and backend-local Prisma schemas are duplicates and decide which is canonical.
- Inventory environment variables without exposing values.
- Normalize documentation around ports, API base URL, and database commands.
- Create a short architecture decision record for the simulation engine and server-backed game state.

#### Exit gate

- Existing application behavior is documented.
- Baseline commands are reproducible.
- No feature code is started until destructive assumptions are removed.

### Phase 1 — Information Architecture and Persistent Game Foundation

#### Outcomes

- Learner-focused navigation.
- Durable game profile and activity events.
- Existing local game data can be safely merged or retired.

#### Tasks

- Add the Missions and Career Passport navigation destinations.
- Reorganize labels without breaking legacy routes.
- Add server-backed `GameProfile`, `ActivityEvent`, and achievement-related persistence.
- Add authenticated endpoints for the current user's game profile.
- Implement idempotent XP awards using unique event keys.
- Migrate browser-stored XP once per account where reliable; otherwise preserve it visually until the user earns a server event, then reconcile using a documented rule.
- Update the dashboard to read the server state.

#### Exit gate

- A refresh, logout/login, or device change does not erase newly earned progression.
- Repeated API requests cannot award the same completion XP twice.

### Phase 2 — First End-to-End Mission Vertical Slice

#### Mission

**Delayed Flight Passenger Assistance** under the airline operations subject.

#### Outcomes

- One complete, polished mission proves the reusable architecture.
- Students can start, pause through persisted state, complete, view results, and replay.

#### Required flow

1. Student opens the Missions catalog.
2. Student views mission details and learning objectives.
3. Student starts a session.
4. Student completes three to five decision steps.
5. Backend validates every step and records decisions.
6. Completion computes a deterministic score and competency breakdown.
7. XP is awarded exactly once.
8. AI coaching is requested after scoring; a deterministic fallback appears when AI fails.
9. Student views results, related lessons, and replay action.
10. Career Passport reflects the completed mission.

#### Scoring categories

- Communication
- Hospitality/service recovery
- Safety and policy awareness
- Problem-solving
- Professionalism

#### Exit gate

- The entire flow passes ownership, validation, idempotency, responsive-layout, keyboard, and failure-path checks.
- The mission remains completable with all external AI providers disabled.

### Phase 3 — Reusable Mission Catalog and Subject Expansion

#### Outcomes

- The engine supports multiple mission definitions without custom pages for each mission.
- At least one reviewed mission exists for each current subject area.

#### Tasks

- Build data-driven mission rendering.
- Add filters for subject, competency, difficulty, and status.
- Add draft/published/version fields to definitions.
- Seed one reviewed scenario for each subject.
- Add resume, abandon, replay, best score, and latest score behavior.
- Add prerequisite and recommended lesson links.
- Ensure old subject games remain available until equivalent functionality is proven.

#### Exit gate

- Adding a new choice-based mission primarily requires seed/content data, not a new route or custom scoring implementation.

### Phase 4 — Career Passport and Adaptive Recommendations

#### Outcomes

- Students understand strengths, gaps, and next actions.

#### Tasks

- Add competency definitions and mappings.
- Aggregate mission evidence and learning activities.
- Show latest score, best score, attempts, and demonstrated competency level.
- Recommend a lesson, quiz, flashcard set, or mission based on weak areas using transparent rules.
- Add badge criteria evaluated on the backend.
- Add share/export only if privacy and academic-use requirements are approved.

#### Exit gate

- Every displayed competency value can be traced to recorded evidence.
- Recommendations explain the rule that produced them.

### Phase 5 — Quality, Accessibility, and Release Hardening

#### Outcomes

- Stable student release with documented operations.

#### Tasks

- Complete critical-path browser tests.
- Run an accessibility audit on authentication, dashboard, mission play, results, and Career Passport.
- Verify mobile layouts at narrow widths and touch target sizes.
- Add rate limiting and abuse controls around AI endpoints where absent.
- Add structured logs and correlation IDs for mission completion and AI requests.
- Validate deployment environment parity.
- Prepare seed, migration, rollback, and release notes.

#### Exit gate

- All P0 acceptance criteria and release checks pass.
- No known issue can duplicate rewards, expose another user's data, or block a non-AI mission completion.

---

## 6. Prioritized Backlog

### P0 — Required for the first meaningful release

- Baseline build and test audit
- Canonical environment-variable documentation
- Learner-focused navigation with Missions and Career Passport
- Server-backed game profile and idempotent XP events
- Simulation definitions, steps/options, sessions, decisions, and results
- Delayed Flight Passenger Assistance vertical slice
- Deterministic rubric score and result explanation
- AI coaching with local fallback
- Session ownership authorization
- Related lessons on result screen
- Responsive and keyboard-accessible mission flow
- Backend unit/integration coverage for scoring and idempotency
- Frontend critical-flow tests around the new mission

### P1 — High-value expansion

- One mission per current subject
- Mission filters and search
- Resume and abandon behavior
- Competency progress and evidence
- Achievement rules
- Adaptive next-activity recommendations
- World Lab taxonomy improvements
- Language-role-play integration
- AI prompt/version logging without secrets or unnecessary personal data

### P2 — Later opportunities

- Instructor dashboard
- Mission/content authoring tools
- Cohort analytics
- Instructor-assigned missions
- Rubric review and manual override with audit trail
- Team missions
- Downloadable competency report
- Richer media and listening activities
- Offline-friendly content caching after a deliberate product decision

---

## 7. First Vertical Slice Acceptance Criteria

The first mission is accepted only when all statements are true.

### Discovery and launch

- An authenticated student can open `/simulations` from the main navigation.
- The catalog clearly distinguishes available, completed, and locked/draft items.
- Mission details show role, objective, subject, competencies, and related lesson.
- Draft or unpublished missions are not exposed to ordinary students.

### Session behavior

- Starting a mission creates one owned session.
- Refreshing the page reloads the current server state.
- The API rejects answers to a session owned by another user.
- A decision cannot be submitted for the wrong step.
- The same answer submission cannot create duplicate decisions.
- A completed session cannot be modified.

### Scoring and rewards

- Score calculation is deterministic and covered by tests.
- Category scores and an overall score are stored with the result.
- Completion is idempotent.
- XP is awarded once through a unique activity event.
- Replays create new sessions but do not corrupt earlier evidence.
- The best and most recent result are distinguishable.

### AI feedback

- AI receives a structured, minimal context payload.
- AI output follows a validated schema or is rejected.
- The displayed deterministic score is never replaced by AI text.
- Timeout, malformed output, unavailable provider, and quota failure all return useful fallback feedback.
- Provider/model metadata may be logged; secrets and raw authentication tokens may not.

### User experience

- All controls work by keyboard.
- Focus moves meaningfully after step transitions and errors.
- Choices do not rely on color alone.
- Loading, empty, retry, offline/network-error, and completed states are designed.
- The mission is usable on a narrow mobile viewport without horizontal scrolling.

---

## 8. Data and Migration Plan

### Principles

- Use additive Prisma migrations.
- Never reset or delete production data as part of a feature command.
- Keep existing user, subject, lesson, quiz, flashcard, note, progress, and chat records valid.
- Add foreign keys and indexes intentionally.
- Store snapshots needed to preserve historical result meaning when mission content changes.

### Recommended migration sequence

1. Add game profile and activity event tables.
2. Backfill one game profile per existing user lazily or in a safe migration script.
3. Add simulation definition and versioning tables.
4. Add session, decision, and result tables.
5. Add competencies and evidence tables.
6. Seed the first published mission using stable slugs.
7. Change dashboard reads from browser storage to API state.
8. Run reconciliation once, then mark the local migration complete per user.

### Local-storage reconciliation rule

The migration must not blindly trust arbitrary browser values. Use one documented approach:

- Treat server XP as authoritative.
- During a one-time signed-in migration, accept only recognized legacy fields and clamp values to configured limits.
- Record a unique `legacy_game_state_import` event so it cannot run twice.
- Store the imported amount and reason in an audit-friendly metadata field.
- Remove or ignore legacy game state after successful reconciliation.

---

## 9. Testing Strategy

### Backend

- Unit tests for score calculation, competency mapping, XP calculation, badge rules, AI-output validation, and fallback selection.
- Service tests for session state transitions and ownership.
- API integration tests for start, answer, complete, retry, and unauthorized access.
- Migration and seed smoke tests on a disposable database.
- Idempotency tests that intentionally repeat start/answer/complete requests.

### Frontend

- Component tests for mission cards, option selection, score breakdown, and fallback feedback.
- Route-level tests for protected access, loading, errors, resume, completion, and replay.
- At least one browser test for the complete first mission.
- Keyboard navigation checks on the mission player.
- Responsive checks at narrow, medium, and desktop widths.

### Contract checks

- Shared or generated TypeScript types for mission API responses where practical.
- DTO validation on every write endpoint.
- A stable error shape for the frontend.
- Explicit handling of version conflicts or stale step submissions.

### Release regression

Before release, verify existing:

- Registration and login
- Dashboard
- Subjects and lessons
- Notes
- Quizzes and quiz results
- Flashcards
- Existing games
- Maps/flags
- Language practice
- AI tutor
- Profile and progress

---

## 10. AI Normalization Plan

### Required correction

The current implementation must be audited for discrepancies among:

- Documented provider priority
- Provider status reporting
- Actual provider invocation order
- Environment-variable names
- Instantiated but unused SDK clients

### Target design

- A single backend `AiGateway` selects providers from an environment-defined priority list.
- Every provider implements the same interface.
- Provider health/status and provider invocation use the same registry.
- Timeouts, retry policy, and circuit behavior are explicit.
- AI requests never originate directly from the browser with provider secrets.
- Simulation evaluation uses schema-validated JSON.
- Deterministic scoring is available before AI is called.
- The local fallback produces feedback from rubric rules and selected decisions.

### Suggested provider interface

```ts
export interface AiProvider {
  readonly id: string;
  isConfigured(): boolean;
  healthCheck(): Promise<ProviderHealth>;
  generate(request: AiRequest): Promise<AiResponse>;
}
```

Use the actual providers supported by the repository after inspection. Do not claim a provider is active merely because a status URL responds.

---

## 11. Analytics and Learning Events

Implement a small, privacy-conscious event vocabulary. Do not store raw sensitive prompts by default.

Recommended events:

- `user_registered`
- `login_succeeded`
- `lesson_opened`
- `lesson_completed`
- `quiz_started`
- `quiz_completed`
- `simulation_viewed`
- `simulation_started`
- `simulation_step_answered`
- `simulation_completed`
- `simulation_replayed`
- `ai_tutor_requested`
- `ai_feedback_generated`
- `ai_feedback_fallback_used`
- `achievement_unlocked`
- `career_passport_viewed`

Minimum useful fields:

- User ID or approved pseudonymous ID
- Event type
- Timestamp
- Subject or simulation ID
- Session ID where applicable
- Result bucket, not unnecessary free text
- App version

---

## 12. Security and Privacy Work

- Keep JWT and authorization checks on every user-owned resource.
- Never rely on route guards alone; enforce ownership in services/queries.
- Validate and whitelist all DTO input.
- Do not expose AI, database, SMTP, or JWT secrets to the frontend.
- Rate-limit authentication and AI routes.
- Sanitize rendered user content and AI output.
- Avoid logging passwords, tokens, complete prompts with personal information, or provider secrets.
- Use generic authentication error messages where enumeration is a risk.
- Define retention for chat logs, AI evaluations, and analytics before production expansion.
- Add Terms and Privacy destinations before external student rollout.
- Treat AI feedback as educational guidance, not a guaranteed academic grade.

---

## 13. Key Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Rewriting working features | Regression and delayed value | Add vertical slices and preserve legacy routes |
| AI provider outage | Mission completion blocked | Deterministic scoring and local feedback fallback |
| Duplicate XP/rewards | Loss of trust and corrupt progress | Unique event keys and transactional completion |
| Browser/server game-state conflict | Inconsistent levels | One-time reconciliation and server authority |
| Scenario content is pedagogically weak | Fun but low learning value | Map every step to objectives and rubric criteria; require review |
| AI invents policy or facts | Misinformation | Constrain prompts, cite related app lessons, and validate outputs |
| Mission versions change old results | Historical evidence becomes unclear | Store definition version and result snapshot |
| Mobile flow becomes too dense | Low student completion | One decision per screen, concise copy, responsive testing |
| Schema duplication | Migrations run against wrong file | Identify and document one canonical Prisma workflow in Phase 0 |
| Frontend test tooling sprawl | Maintenance burden | Add only the minimum tools required for critical new flows |

---

## 14. Definition of Done

A work item is done when:

- Acceptance criteria are demonstrably met.
- Types, DTOs, validation, authorization, and error states are implemented.
- Database changes use a reviewed additive migration.
- New behavior has appropriate automated tests.
- Existing build, lint, and test gates pass, or pre-existing failures are explicitly documented.
- UI supports loading, empty, success, retry, and unauthorized states.
- Mobile and keyboard behavior are checked.
- No secret or sensitive data is exposed.
- Documentation is updated in the same change.
- The implementation report lists changed files, commands run, results, assumptions, and remaining risks.

---

## 15. Claude Execution Sequence

Claude should implement in this order unless repository evidence requires a safer order:

1. Read `CLAUDE.md`, `AGENT.md`, this plan, and all files under `docs/`.
2. Audit the actual branch and report differences from the documented baseline.
3. Run baseline commands and separate existing failures from introduced failures.
4. Write or update a small architecture decision record for simulation state and game progression.
5. Normalize game-state ownership on the backend.
6. Build the first mission as one end-to-end vertical slice.
7. Validate deterministic completion with AI disabled.
8. Add AI coaching behind the stable gateway.
9. Integrate Career Passport evidence.
10. Expand the reusable catalog only after the first slice passes its release gate.

Claude must not generate a broad set of disconnected placeholder pages. The first priority is one real, tested workflow from database to user result.

---

## 16. Release Checklist

### Product

- [ ] First mission has reviewed objectives, choices, consequences, and rubric.
- [ ] Related lessons are accurate.
- [ ] Student can understand how the result was calculated.
- [ ] Replay has a clear purpose.

### Engineering

- [ ] Migrations apply from a clean database and from the current schema.
- [ ] Seed is deterministic and repeatable.
- [ ] Completion and XP award are transactional and idempotent.
- [ ] Ownership checks are covered by tests.
- [ ] AI-disabled flow passes.
- [ ] Existing core regression checks pass.

### UX and accessibility

- [ ] Mobile layout passes.
- [ ] Keyboard path passes.
- [ ] Focus and error messages are understandable.
- [ ] Color is not the only status cue.
- [ ] Loading and retry states are present.

### Operations

- [ ] Environment variables are documented.
- [ ] No secrets are committed.
- [ ] Logs identify failures without leaking private content.
- [ ] Rollback steps are documented.
- [ ] Deployment health checks cover frontend, API, database, and AI fallback behavior.

---

## 17. Decision Register

| Decision | Status | Rationale |
|---|---|---|
| Preserve current application and extend it | Accepted | Existing functionality provides a strong foundation |
| Use TourMate Quest as the simulation experience name | Recommended | Communicates game-based career practice without forcing a repository rename |
| Deterministic score is authoritative | Accepted | Ensures fairness, testability, and offline/provider resilience |
| Server is authoritative for progression | Accepted | Prevents data loss, device inconsistency, and reward duplication |
| Build one vertical slice before catalog expansion | Accepted | Validates architecture and reduces speculative work |
| Keep AI provider-specific logic behind an interface | Accepted | Reduces configuration drift and vendor lock-in |
| Preserve legacy URLs during IA migration | Accepted | Avoids broken links and regressions |
| Instructor authoring is post-MVP | Accepted | Keeps first release focused on the student loop |

