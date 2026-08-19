# CLAUDE.md — Claude Code Project Instructions

You are working inside **TourMate-AI-Game-Agent**, an existing full-stack tourism education application. Your job is to evolve it safely into **TourMate Quest**, an AI-assisted tourism career-simulation and mastery experience for BS Tourism Management students.

This is not a greenfield rewrite.

---

## 1. Read These Files First

Read in this order before editing code:

1. `CLAUDE.md`
2. `AGENT.md`
3. `PLAN.md`
4. `docs/BRD.md`
5. `docs/TDD.md`
6. `docs/UF.md`
7. `docs/IA.md`
8. Root `README.md`
9. Relevant package files, route configuration, API client, NestJS modules, and Prisma schema

The live repository is authoritative. If these planning documents differ from the branch, report the difference and adapt without discarding the product intent.

---

## 2. Product Mission

Build a mobile-first web application where tourism students can:

- Learn through subjects, lessons, notes, quizzes, and flashcards
- Practice geography and tourism language skills
- Complete realistic, branching tourism workplace missions
- Receive transparent rubric scores and constructive AI coaching
- Earn persistent XP, achievements, and competency evidence
- See career-readiness progress in a Career Passport

The core loop is:

> Learn → Practice → Simulate → Reflect → Progress → Replay

The working product name remains **TourMate AI**. **TourMate Quest** is the game/simulation experience name and may be used in learner-facing copy where appropriate.

---

## 3. Current Application Baseline to Preserve

The audited main branch already includes or indicates:

- JWT authentication and protected pages
- Subjects and lessons
- Notes
- Quizzes and quiz results
- Flashcards
- Existing subject games
- Maps and flags
- Language learning
- AI tutor and agent/provider status
- Dashboard, profile, and progress views
- React + TypeScript + Vite frontend
- NestJS + Prisma + PostgreSQL backend

Do not remove or replace these features as a shortcut.

Important issues to verify in the live branch:

1. XP, levels, badges, and daily challenge data are stored in browser storage in parts of the frontend.
2. The database does not yet appear to contain a reusable simulation/session/rubric/competency domain.
3. AI provider documentation, environment variables, status reporting, and actual invocation order may be inconsistent.
4. Multiple Prisma schema locations may exist.
5. Frontend automated test infrastructure may be limited or absent.

Confirm each point before acting on it.

---

## 4. Working Mode

### Do

- Inspect before editing.
- Preserve working behavior.
- Implement one end-to-end vertical slice.
- Prefer additive migrations and backward-compatible routes.
- Use existing patterns and dependencies where they are adequate.
- Keep deterministic business logic independent of AI.
- Validate, authorize, test, and document every new write path.
- Make reversible assumptions when requirements are incomplete and record them.

### Do not

- Re-scaffold the application.
- Generate many placeholder pages.
- move authoritative progression to the browser.
- Let the client submit trusted scores or XP.
- Depend on an external AI provider for mission completion.
- Expose provider secrets to Vite/frontend code.
- Reset an unknown database.
- Delete existing routes or data without a migration path.
- Introduce broad dependency upgrades unrelated to the work.
- Claim validation commands passed unless they were run.

---

## 5. First Assignment

After the baseline audit, implement the first complete vertical slice:

# Delayed Flight Passenger Assistance Mission

**Subject:** Airline operations (`AIRMGT` or the actual matching subject identifier)  
**Student role:** Airport/airline customer-service trainee  
**Situation:** A passenger is upset because a delayed flight may cause a missed connection. The student must respond professionally without inventing policy or promising an unauthorized outcome.  
**Purpose:** Practice communication, service recovery, policy awareness, problem-solving, and professionalism.

The mission must be playable and completable when every external AI provider is disabled.

---

## 6. Required First-Slice Deliverables

### A. Baseline audit

Before feature code, produce a concise audit in your work report:

- Current branch and dirty files
- Package manager and lockfiles
- Existing scripts
- Current routes and API base configuration
- Canonical Prisma schema/migration path
- Existing authentication/authorization conventions
- Existing progress and local game-state behavior
- Existing AI provider flow and configuration names
- Baseline build/lint/test results
- Any conflicts with these planning documents

Do not overwrite uncommitted human changes.

### B. Persistent game foundation

Implement the smallest coherent server-backed foundation needed for the mission:

- One game profile per user
- Activity/reward event records with unique idempotency keys
- Server-calculated XP
- Read endpoint for the current user's game profile
- Safe handling of existing browser-stored progression

Do not build the entire future achievement system unless required by the slice.

### C. Simulation domain

Implement equivalent domain concepts using names consistent with the repository:

- Published/versioned simulation definition
- Ordered steps
- Options with deterministic rubric points
- User-owned session
- Recorded decisions
- Completed result with score breakdown
- Mission/version reference on every result
- Related lesson reference where available

The model may be normalized relationally or use a bounded JSON content snapshot where justified in `docs/TDD.md`. Historical results must remain understandable after future mission edits.

### D. Backend API

Provide an authenticated API equivalent to:

```text
GET  /api/simulations
GET  /api/simulations/:slug
POST /api/simulations/:slug/sessions
GET  /api/simulation-sessions/:sessionId
POST /api/simulation-sessions/:sessionId/answers
POST /api/simulation-sessions/:sessionId/complete
GET  /api/simulation-sessions/:sessionId/result
GET  /api/gamification/me
```

Use the repository's actual controller conventions and global `/api` prefix. Endpoint names may be adjusted only when existing conventions make another contract clearer.

All user-owned session queries must enforce ownership in the service/database query, not only in the route guard.

### E. Frontend flow

Implement or adapt these routes:

```text
/simulations
/simulations/:slug
/simulations/:slug/play
/simulation-sessions/:sessionId/results
```

The flow must include:

- Missions catalog
- Mission detail and learning objectives
- Start or resume
- One decision at a time
- Step progress
- Pending/disabled submit behavior
- Refresh-safe server state
- Completion transition
- Score and competency breakdown
- Deterministic feedback
- AI coaching status/fallback
- Related lesson action
- Replay action
- Career Passport or dashboard progression update

Preserve all existing routes. Use redirects/aliases only after verifying route behavior.

### F. Tests and documentation

Add the tests required by `AGENT.md` and `docs/TDD.md`, especially:

- Ownership
- Invalid state transitions
- Deterministic score paths
- Completion idempotency
- XP idempotency
- AI-disabled completion
- Frontend loading/error/completion states

Update relevant README/environment/API documentation in the same change.

---

## 7. Suggested Mission Content

Use this as a curriculum-ready draft, then adapt to the repository's content format. Keep all airline policy language generic and instruct the learner to verify approved procedures.

### Mission metadata

```yaml
slug: delayed-flight-passenger-assistance
version: 1
status: published
subjectCode: AIRMGT
difficulty: beginner
role: Airport customer-service trainee
objective: Respond to a delayed-flight passenger with empathy, accurate process communication, and practical next steps.
competencies:
  - communication
  - service-recovery
  - safety-policy-awareness
  - problem-solving
  - professionalism
```

### Step 1 — Open the interaction

**Situation:** The passenger approaches visibly upset and says the delay will make them miss a connecting flight.

Strong response characteristics:

- Acknowledge the concern
- Use calm, respectful language
- Verify the booking/flight details through the approved system
- Avoid blame or speculation

Weak response characteristics:

- Dismiss the concern
- Promise an outcome before checking
- Blame another team or the passenger
- Ask for sensitive information publicly beyond what is needed

### Step 2 — Establish what is known

Strong response characteristics:

- Explain the confirmed delay information in plain language
- Distinguish confirmed information from an estimate
- Check the connection and approved re-accommodation options
- Avoid inventing airline policy, compensation, or visa advice

### Step 3 — Offer practical next steps

Strong response characteristics:

- Present approved options clearly
- Prioritize safety and feasibility
- Confirm the passenger understands the next step
- Escalate to an authorized colleague when required

### Step 4 — Handle continued frustration

Strong response characteristics:

- Remain calm and empathetic
- Set respectful boundaries if behavior becomes abusive
- Restate what can be done now
- Seek assistance according to workplace procedures when needed

### Step 5 — Close and document

Strong response characteristics:

- Summarize the selected next step
- Provide the correct service point or channel
- Confirm whether the passenger has another immediate need
- Record relevant service notes using approved procedures

Each step should offer three or four distinct options. Do not use obviously silly distractors. Every option should represent a plausible novice decision with explainable consequences.

---

## 8. Deterministic Rubric

Use five categories:

| Competency | Weight |
|---|---:|
| Communication | 25% |
| Service recovery/hospitality | 25% |
| Safety and policy awareness | 20% |
| Problem-solving | 20% |
| Professionalism | 10% |

### Option points

Each option may contribute `0–4` points to one or more categories.

- `4` — exemplary for the learning level
- `3` — strong with a small omission
- `2` — partially effective
- `1` — weak or risky
- `0` — unsafe, misleading, dismissive, or incompatible with the objective

### Score formula

For each category:

```text
category score = round(earned category points / maximum available category points × 100)
```

Overall:

```text
overall score = round(sum(category score × category weight))
```

Implementation requirements:

- Weights must sum to 100.
- Maximum values come from the exact mission version.
- The same decisions always produce the same score.
- Store category and overall scores with a score-policy version.
- Explain each category using deterministic templates and evidence from selected options.
- Cover known decision paths with unit tests.

### Result bands

Use encouraging labels, not punitive labels:

| Score | Label | Meaning |
|---:|---|---|
| 90–100 | Service Ready | Consistently strong decisions for this level |
| 75–89 | On Track | Strong foundation with targeted improvements |
| 60–74 | Developing | Some effective decisions; review specific gaps |
| 0–59 | Practice Recommended | Repeat related learning and replay the mission |

These labels are learning guidance, not official academic grades.

---

## 9. XP Policy for the First Slice

Keep the policy simple, transparent, and server-owned.

### First completed attempt for a mission version

```text
XP = 20 completion XP + floor(overall score / 5) + 20 first-completion bonus
```

This produces 40–60 XP.

### Later attempts

- Award 10 XP only when the attempt creates a new personal best.
- Add `floor(score improvement / 5)` improvement XP.
- Cap replay XP at 20.
- Award 0 XP for a completed replay that does not improve the personal best.

### Idempotency

- One XP event per completed session.
- Use a unique key such as `simulation_completion:<sessionId>`.
- First-completion status must be determined transactionally.
- A completion retry returns the existing result and event.

If the repository already has an approved XP policy, preserve it and adapt these rules only where required for consistency. Document the final rule.

---

## 10. Session State Machine

Use an explicit state machine equivalent to:

```text
NOT_STARTED
  → IN_PROGRESS
  → COMPLETED

IN_PROGRESS
  → ABANDONED   (optional in first slice)
```

Rules:

- Draft/unpublished missions cannot be started by ordinary students.
- A session records the mission version at start.
- A session has one expected current step.
- An answer must target the expected step and a valid option from that mission version.
- A completed or abandoned session rejects new answers.
- Completion is allowed only when all required steps are answered.
- Completion is transactional and idempotent.
- Resume returns the expected current step and prior safe-to-display decisions.

Use database constraints and service checks together.

---

## 11. AI Coaching Contract

AI coaching is an enhancement after the deterministic result exists.

### Input

Send only the minimum structured context:

- Mission title, objective, role, and version
- Category scores
- Selected option learning tags/evidence
- Deterministic strengths and improvement areas
- Related lesson titles/IDs where needed
- Prompt template version

Do not send passwords, authentication tokens, provider keys, or unnecessary profile data.

### Output schema

Validate an object equivalent to:

```json
{
  "summary": "Concise supportive summary",
  "strengths": [
    {
      "competency": "communication",
      "evidence": "What the learner did well"
    }
  ],
  "improvements": [
    {
      "competency": "problem-solving",
      "suggestion": "One concrete next action"
    }
  ],
  "nextAction": "A related lesson, drill, or replay recommendation"
}
```

Constraints:

- Concise student-facing text
- No score fields
- No invented airline policy, compensation entitlement, visa rule, or safety procedure
- No shame, insults, or cultural stereotypes
- Maximum bounded item counts and string lengths

### Fallback

If AI is unavailable, malformed, too slow, or rejected by validation:

- Return the deterministic result normally.
- Generate summary, strengths, improvements, and next action from rubric rules.
- Mark feedback source as `deterministic_fallback` for observability.
- Do not show a technical provider error to the student.

---

## 12. AI Provider Refactor Requirement

During the first slice, inspect and normalize the existing AI service only as far as needed to create a reliable gateway.

Expected issues to confirm:

- A provider may appear in status but not in actual generation flow.
- Provider order in code may differ from README claims.
- `GOOGLE_API_KEY` and `GEMMA_API_KEY` or similar names may be inconsistent.
- An SDK client may be instantiated but unused.

Target:

```ts
interface AiProvider {
  id: string;
  isConfigured(): boolean;
  healthCheck(): Promise<ProviderHealth>;
  generate(request: AiRequest): Promise<AiResponse>;
}
```

Use one registry for status and generation. Make priority configurable. Preserve existing working tutor behavior while moving it behind the gateway.

Do not expand this into an unrelated platform rewrite.

---

## 13. Proposed Backend Module Boundaries

Adapt names to existing conventions:

```text
backend/src/
├── simulations/
│   ├── dto/
│   ├── simulations.controller.ts
│   ├── simulations.service.ts
│   ├── simulation-sessions.service.ts
│   ├── simulation-scoring.service.ts
│   └── simulations.module.ts
├── gamification/
│   ├── gamification.controller.ts
│   ├── gamification.service.ts
│   └── gamification.module.ts
└── ai/
    ├── providers/
    ├── ai-gateway.service.ts
    └── ...existing compatible files
```

Avoid circular dependencies. A clean orchestration direction is:

```text
Simulation completion
  → deterministic scoring
  → result persistence
  → activity/XP award
  → optional AI coaching
```

The simulation domain may call a gamification service through an explicit module export. Do not let the gamification domain know frontend details.

---

## 14. Proposed Frontend Structure

Adapt to existing naming and avoid duplicate abstractions:

```text
frontend/src/
├── pages/
│   ├── Simulations.tsx
│   ├── SimulationDetails.tsx
│   ├── SimulationPlay.tsx
│   └── SimulationResults.tsx
├── components/
│   └── simulations/
│       ├── SimulationCard.tsx
│       ├── MissionProgress.tsx
│       ├── DecisionOptions.tsx
│       ├── CompetencyBreakdown.tsx
│       └── CoachFeedback.tsx
├── services/
│   └── simulations.ts
├── hooks/
│   └── useSimulations.ts
└── types/
    └── simulations.ts
```

Use the existing API client and query-key conventions. Do not duplicate authentication headers in each service.

---

## 15. Information Architecture Direction

Primary learner navigation should move toward:

- Dashboard
- Learn
- Missions
- World Lab
- Language Lab
- AI Coach
- Career Passport
- Profile

During the first slice:

- Add Missions prominently.
- Add a Career Passport destination or a clearly labeled progression entry point.
- Keep existing Subject, Maps/Flags, Language, AI Tutor, Progress, and Profile routes working.
- Keep Agent Status secondary/developer-oriented rather than a main learning destination.

Follow `docs/IA.md` for route and label details.

---

## 16. Database and Migration Safety

Before creating a migration:

1. Identify the canonical Prisma schema and migration directory.
2. Confirm which command the backend uses in local and deployment environments.
3. Inspect existing data relations and naming conventions.
4. Verify the database target is not an unknown shared/production environment.
5. Generate an additive migration.
6. Review generated SQL for destructive operations.
7. Test against a disposable database or approved local environment.

Never run `prisma migrate reset` automatically.

If two schema copies exist, do not edit both blindly. Determine ownership, document it, and either synchronize through an explicit repository convention or remove duplication in a separate approved change.

---

## 17. Legacy Game-State Reconciliation

Parts of the current frontend may hold XP, level, badges, notifications, or daily challenges in `localStorage`.

Implement a safe transition:

- Server state becomes authoritative.
- Recognize only known legacy keys and fields.
- Validate types and clamp imported numeric values.
- Import at most once per user using a unique activity event.
- Never allow a client to repeatedly claim arbitrary XP.
- Preserve a documented audit reason for the imported amount.
- Remove or ignore the legacy authoritative path after successful import.

If secure reconciliation is not possible in the first slice, start new server progression at zero and show a transparent transition note in development documentation rather than trusting unverified values. Do not silently discard real user state in production.

---

## 18. Accessibility and Responsive Acceptance

The first mission must meet these practical checks:

- Catalog, details, player, and results work at a narrow mobile viewport.
- No horizontal page scrolling is required.
- All actions are keyboard reachable.
- Focus is visible.
- Step changes have a meaningful heading/focus target or announcement.
- Option state is communicated by text/semantics, not only color.
- Error messages identify the problem and recovery action.
- Motion is reduced when the user's preference requests it.
- Buttons cannot be activated twice while a request is pending.
- Result charts or bars have textual values and labels.

Use existing design tokens and components where they meet these requirements.

---

## 19. Minimum Validation Matrix

Run the actual repository scripts. At minimum, aim to validate:

### Frontend

- Type/build check
- Lint
- New component/route tests
- One complete mission browser flow if browser tooling exists or is introduced deliberately
- Manual narrow-width and keyboard checks

### Backend

- Prisma generation
- Type/build check
- Lint if configured
- Unit tests
- API/integration tests for the new domain
- Seed smoke test

### Regression

- Registration/login
- Dashboard
- Subject list and lesson view
- Quiz result flow
- Flashcards
- Existing games
- Maps/flags
- Language page
- AI tutor with provider and fallback behavior
- Profile/progress

Report every command as `PASS`, `FAIL`, or `NOT RUN` with the reason.

---

## 20. Required Implementation Report

After completing a work unit, respond with:

```md
# Implementation Report

## Outcome
What a student can now do.

## Baseline Findings
Important repository facts and pre-existing failures.

## Changes
- `path` — purpose

## Database and API
Migrations, seed changes, endpoints, authorization, and idempotency.

## Tests and Validation
- `command` — PASS/FAIL/NOT RUN

## Manual Verification
Routes, viewports, keyboard path, error/fallback paths.

## Assumptions and Decisions
What was inferred and why.

## Known Risks or Deferred Work
Only concrete, scoped items.

## Recommended Next Slice
One coherent next work unit.
```

Do not hide incomplete work behind a general success statement.

---

## 21. Initial Execution Checklist

- [ ] Read all project documents.
- [ ] Inspect branch and uncommitted changes.
- [ ] Verify package scripts and lockfiles.
- [ ] Run baseline validation.
- [ ] Confirm canonical Prisma schema.
- [ ] Audit browser-stored game state.
- [ ] Audit AI provider status and generation paths.
- [ ] Map existing routes/components that can be reused.
- [ ] Implement server-backed progression foundation.
- [ ] Implement one mission end to end.
- [ ] Verify completion with AI disabled.
- [ ] Verify ownership and idempotency.
- [ ] Add/update tests.
- [ ] Update documentation.
- [ ] Deliver the implementation report.

---

## 22. Starter Instruction from the Operator

Use the following as the active assignment when no narrower task is supplied:

> Read `CLAUDE.md`, `AGENT.md`, `PLAN.md`, and every file in `docs/`. Audit the current repository before editing. Preserve existing working features and uncommitted human changes. Then implement the first end-to-end vertical slice defined in the plan: the “Delayed Flight Passenger Assistance” mission, including persistent server-backed progression, deterministic rubric scoring, authenticated session ownership, idempotent XP, AI coaching with deterministic fallback, responsive UI, tests, and documentation. Begin with the baseline audit, use additive migrations only, and finish with the required implementation report. Do not create a greenfield replacement or a set of disconnected placeholders.

