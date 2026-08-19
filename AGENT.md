# AGENT.md — Repository Instructions for Coding Agents

This file defines repository-wide working rules for any AI coding agent contributing to TourMate AI. It applies to Claude Code and any other agent unless a more specific instruction file exists in a subdirectory.

**Repository:** `TourMate-AI-Game-Agent`  
**Product direction:** TourMate Quest — tourism learning plus career simulation  
**Primary users:** BS Tourism Management students

---

## 1. Instruction Priority

Follow instructions in this order:

1. System, organization, security, and legal requirements
2. The explicit task from the human operator
3. `CLAUDE.md`
4. This `AGENT.md`
5. `PLAN.md`
6. `docs/BRD.md`
7. `docs/TDD.md`
8. `docs/UF.md`
9. `docs/IA.md`
10. Existing repository conventions and local instruction files

When two project documents conflict, stop changing code long enough to identify the conflict. Prefer the safer, backward-compatible interpretation and record the assumption in the implementation report.

---

## 2. Mission

Improve the existing TourMate AI application into a reliable, mobile-first tourism education and career-simulation platform.

Do not treat the repository as a greenfield prototype. Existing authentication, subjects, lessons, notes, quizzes, flashcards, games, maps, language tools, AI tutor, and progress behavior are assets to preserve unless a change is explicitly required and safely migrated.

The most important product loop is:

> Learn → Practice → Simulate → Receive feedback → Build competency evidence → Replay

---

## 3. Mandatory Read Order Before Editing

Before the first code change in a work session:

1. Read `CLAUDE.md`.
2. Read `PLAN.md`.
3. Read all documents under `docs/` referenced by the task.
4. Read the root `README.md`.
5. Inspect `git status`, the current branch, and recent relevant changes.
6. Inspect the actual package scripts; do not assume commands from documentation are current.
7. Inspect the relevant frontend routes, API client, backend modules/controllers/services, and Prisma schema.
8. Search for existing components and utilities before creating new ones.
9. Run or record the baseline validation commands appropriate to the task.

Never edit from filenames alone. Read the relevant implementation and its callers first.

---

## 4. Known Repository Shape to Verify

The audited repository uses this general architecture, but the live branch is authoritative:

```text
TourMate-AI-Game-Agent/
├── frontend/                 # React + TypeScript + Vite application
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/         # API access
│       ├── hooks/
│       └── ...
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── subjects/
│   │   ├── lessons/
│   │   ├── notes/
│   │   ├── quizzes/
│   │   ├── flashcards/
│   │   ├── progress/
│   │   ├── ai/
│   │   └── agent/
│   └── prisma/
├── prisma/                   # A second schema location may exist; verify ownership
├── PLAN.md
├── AGENT.md
├── CLAUDE.md
└── docs/
```

The stack observed during planning includes:

- React and TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- Framer Motion
- NestJS
- Prisma
- PostgreSQL
- JWT authentication

Do not replace these technologies merely because another library is familiar.

---

## 5. Non-Negotiable Engineering Rules

### 5.1 Preserve working behavior

- Prefer additive changes and compatibility layers.
- Preserve existing routes while introducing improved navigation.
- Do not delete a working feature until its replacement is complete, tested, migrated, and approved.
- Do not perform broad formatting or unrelated refactoring in a feature change.
- Keep each change reviewable and scoped.

### 5.2 Build vertical slices

A feature is not complete when only a page, schema, or endpoint exists. Implement the smallest usable path across:

- Database
- Backend domain/service
- Authorization and validation
- API contract
- Frontend query/mutation layer
- UI states
- Tests
- Documentation

The first required slice is the **Delayed Flight Passenger Assistance** simulation described in `PLAN.md`.

### 5.3 No destructive database shortcuts

- Never use a destructive reset against a shared or production database.
- Never edit migration history after it has been applied to shared environments.
- Use additive Prisma migrations.
- Inspect both possible Prisma schema locations and document the canonical command path before migration work.
- Backfill safely and idempotently.
- Preserve existing IDs and relationships.

### 5.4 Server authority

The backend is authoritative for:

- User identity and authorization
- Mission/session state
- Scores and rubric results
- XP and level
- Achievements
- Competency evidence
- Completion status

Browser storage may cache non-sensitive UI preferences. It must not remain the authoritative source for rewards or academic progress.

### 5.5 Deterministic scoring first

- Mission scores are computed from versioned rubric data and validated decisions.
- AI text may explain a score but may not silently alter it.
- A mission must be completable when all external AI services are disabled.
- Persist enough scoring inputs and version metadata to reproduce a result.

### 5.6 Idempotency

Write operations that can be retried must be safe to repeat.

At minimum:

- Starting a session should support a client request key or a clear resume rule.
- Submitting an answer must not create duplicate decisions.
- Completing a session must not create duplicate results.
- Awarding XP must use a unique activity key.
- Unlocking an achievement must be unique per user and achievement.

Prefer database constraints plus transactions over frontend-only guards.

---

## 6. Work Session Protocol

### Before coding

Report internally or in the task notes:

- What is being changed
- Which acceptance criteria apply
- Which files/modules are likely involved
- What existing behavior could regress
- What commands will validate the result

### During coding

- Make one coherent change at a time.
- Re-run the narrowest useful checks after each meaningful step.
- Keep DTOs, types, API clients, and UI behavior aligned.
- Record new assumptions immediately rather than relying on memory.
- If a baseline command already fails, capture the exact failure before modifying related code.

### After coding

Provide a completion report containing:

1. Summary of user-visible behavior
2. Files changed
3. Database migration/seed impact
4. Commands run and results
5. Tests added or updated
6. Screens or routes manually verified
7. Assumptions and tradeoffs
8. Known issues or deferred work
9. Suggested next work unit

Do not claim success for checks that were not run.

---

## 7. Frontend Rules

### 7.1 Architecture

- Use existing routing, API, query, component, and styling conventions.
- Keep server data in TanStack Query rather than duplicating it into broad global state.
- Keep ephemeral interaction state local to the page/component unless multiple routes need it.
- Centralize API base configuration and authentication behavior.
- Use typed request and response shapes.
- Avoid direct `fetch` calls if the repository already standardizes on Axios.

### 7.2 New route family

The target mission route family is:

```text
/simulations
/simulations/:slug
/simulations/:slug/play
/simulation-sessions/:sessionId/results
```

Legacy routes must remain valid. Add redirects or aliases only after checking current route behavior.

### 7.3 Required UI states

Every server-backed screen must intentionally handle:

- Initial loading
- Refreshing/revalidating
- Empty state
- Successful data state
- Validation error
- Authorization failure
- Not found
- Network/server error
- Retry
- Stale or conflicting session state

Do not use a permanent spinner as error handling.

### 7.4 Mission player interaction

- Present one primary decision at a time on small screens.
- Keep role, context, and current progress visible without overwhelming the screen.
- Prevent accidental double submission while a request is pending.
- Restore server state after refresh.
- Give immediate, concise confirmation after a decision only when it supports the learning design.
- Avoid revealing the “correct” option before submission unless the activity is explicitly practice mode.
- Provide a clear completion transition to the result screen.

### 7.5 Accessibility

- Use semantic HTML before ARIA.
- Associate every form field with a label.
- Use real buttons and links for interactive elements.
- Maintain visible keyboard focus.
- Do not rely on color alone for score, correctness, lock, or status.
- Move or announce focus after meaningful route/step changes.
- Provide useful error text near the affected control and a summary where needed.
- Honor reduced-motion preferences for non-essential animation.
- Ensure touch targets are practical on mobile.
- Test the mission flow using only a keyboard.

### 7.6 Content style

Student-facing content should be:

- Clear and encouraging
- Professional and hospitable
- Tourism-specific
- Free of unnecessary technical language
- Constructive rather than punitive
- Explicit about why a decision is strong, risky, or incomplete

Avoid stereotypes about cultures, nationalities, languages, disabilities, or travelers.

---

## 8. Backend Rules

### 8.1 NestJS boundaries

For each new domain, prefer the repository's existing module pattern:

```text
simulations/
├── dto/
├── entities or types/
├── simulations.controller.ts
├── simulations.service.ts
├── simulation-scoring.service.ts
└── simulations.module.ts
```

Separate concerns where behavior warrants it:

- Catalog and definition retrieval
- Session state transitions
- Deterministic scoring
- Rewards/activity events
- AI coaching

Do not put domain logic in controllers.

### 8.2 DTO validation

- Use explicit DTO classes for writes.
- Whitelist properties through the existing global validation configuration.
- Reject unknown fields where the application already does so.
- Validate enums, IDs, string lengths, arrays, and nested data.
- Never accept user ID from the client when it can come from the authenticated request.

### 8.3 Authorization

For every user-owned resource:

- Query by both resource ID and authenticated user ID, or perform an equivalent explicit ownership check.
- Return the repository-standard not-found/forbidden behavior without leaking another user's data.
- Apply the rule to reads and writes.
- Add negative tests for cross-user access.

### 8.4 Transactions

Use a database transaction for mission completion when it performs multiple writes such as:

- Lock/check session state
- Calculate and store result
- Store competency evidence
- Record activity event
- Award XP
- Unlock achievements
- Mark session complete

Design the operation so a retry returns the existing result instead of duplicating side effects.

### 8.5 Error shape

Use the existing global exception strategy. New APIs should expose a stable, student-safe error shape with:

- HTTP status
- Machine-readable code where repository conventions permit
- Human-readable message
- Field errors for validation when useful
- Correlation/request ID when available

Never pass raw provider errors, stack traces, SQL details, or secrets to the browser.

---

## 9. Prisma and Data Modeling Rules

### 9.1 General

- Use singular model names consistent with the existing schema.
- Add `createdAt` and `updatedAt` where domain records change over time.
- Use explicit unique constraints for slugs, idempotency keys, and one-per-user records.
- Add indexes for common filters and ownership queries.
- Prefer enums for stable workflow states, but consider migration impact before changing enum values.
- Use JSON only for bounded snapshots or provider metadata, not as a substitute for all relational design.

### 9.2 Mission versioning

A published mission definition must not be edited in a way that changes the meaning of historical results.

Use one of these approaches:

- Immutable version records, or
- Definition version plus complete result snapshot

Every session/result must identify the exact mission version used.

### 9.3 Recommended core records

Verify naming against the live schema, then implement equivalent concepts:

- Simulation definition
- Simulation step
- Simulation option
- Simulation session
- Session decision
- Simulation result
- Game profile
- Activity event
- Competency
- Competency evidence/progress
- Achievement and user achievement
- AI evaluation metadata

Do not create all records at once if the first vertical slice can safely begin with a smaller coherent subset.

### 9.4 Seed content

- Use stable slugs and IDs where seed reruns require them.
- Make seed operations upsert-based or otherwise repeatable.
- Keep scenario content separate from schema code.
- Mark content as draft or published.
- Include a version number.
- Do not publish generated scenario content without a curriculum review note.

---

## 10. AI and Agent Rules

### 10.1 One gateway

Provider selection, health status, timeout policy, and error normalization must pass through one backend gateway/registry.

The current implementation must be inspected for provider drift, including inconsistent environment-variable names and differences between documented priority and actual call order.

### 10.2 No frontend secrets

- All provider API calls occur on the backend.
- Never put provider keys in Vite-exposed environment variables.
- Never return configuration values to the frontend.
- Status endpoints may report provider IDs and availability, not credentials.

### 10.3 Structured simulation feedback

Use a validated response contract similar to:

```ts
interface SimulationCoachFeedback {
  summary: string;
  strengths: Array<{
    competency: string;
    evidence: string;
  }>;
  improvements: Array<{
    competency: string;
    suggestion: string;
  }>;
  nextAction: string;
  safetyNotice?: string;
}
```

Rules:

- Validate parsed output before storage or display.
- Limit length and number of items.
- Do not allow AI to return or override authoritative score fields.
- Sanitize text before rendering.
- Fall back to deterministic templates when output is malformed or unavailable.

### 10.4 Prompt design

- State the educational role and subject.
- Provide the exact mission version, rubric breakdown, and selected decisions needed for feedback.
- Exclude unnecessary personal data.
- Require concise, supportive output.
- Forbid invented laws, airline policies, visa rules, prices, or emergency procedures.
- Tell the model to acknowledge uncertainty and direct students to official/current sources for time-sensitive rules.
- Version prompts and record the version with generated feedback.

### 10.5 Provider observability

Record only operational metadata needed for reliability, such as:

- Provider ID
- Model ID
- Prompt template version
- Start/end timestamps or latency
- Success/failure category
- Fallback usage
- Token/usage data where safely available

Do not log full tokens, passwords, private keys, or unnecessary student content.

---

## 11. Scoring and Progression Rules

### 11.1 Scoring

- Score data comes from versioned mission options and rubric weights.
- Normalize the final score to a documented range, normally 0–100.
- Category scores must be explainable from recorded decisions.
- Treat incomplete missions separately from failed/low-scoring completions.
- Do not award a perfect score merely for completion.

### 11.2 XP

Use a transparent formula stored in backend configuration or a versioned service.

Example policy for the first slice:

```text
completion XP = base completion + score component + first-completion bonus
```

Requirements:

- Clamp XP to configured limits.
- Award first-completion bonus only once per mission version or defined mission family.
- Replays may earn reduced XP if the product rule requires it.
- Record every award as an activity event with a unique key and reason.
- Never calculate authoritative XP solely in the browser.

### 11.3 Competencies

- Map mission rubric categories to canonical competency IDs.
- Store evidence per completed session.
- Derive a user's displayed competency progress from evidence using a documented aggregation rule.
- Do not overwrite history with the latest attempt.
- Show best, latest, and attempt count distinctly where relevant.

---

## 12. Testing Rules

### 12.1 General

- Test business behavior, not implementation trivia.
- Include positive, negative, boundary, ownership, and retry cases.
- Do not delete tests just to make a build pass.
- Keep fixtures deterministic.
- Mock external AI providers at the gateway boundary.
- Ensure at least one test exercises the deterministic fallback.

### 12.2 Required backend coverage for the first mission

- Catalog returns only published/eligible missions.
- Session start requires authentication.
- Cross-user session access fails.
- Valid answer advances expected state.
- Invalid step, option, or state transition fails.
- Duplicate answer request does not duplicate a decision.
- Completion score is correct for known paths.
- Completion retry returns the same result.
- XP event is created once.
- AI failure still produces a complete result.

### 12.3 Required frontend coverage for the first mission

- Catalog loading, empty, and error states
- Mission detail rendering
- Start/resume behavior
- Option selection and pending state
- Server validation error
- Completion result breakdown
- AI fallback label/message
- Replay action
- Protected-route behavior

### 12.4 Validation commands

Always inspect package scripts first. Typical commands may include:

```bash
# Frontend
cd frontend
npm ci
npm run lint
npm run build

# Backend
cd backend
npm ci
npx prisma generate
npm run lint
npm run test
npm run build
```

Only run migration commands after confirming the database target and canonical schema. Never run a destructive reset as an automatic validation step.

If the project does not yet have a frontend test script, add the smallest suitable test setup as part of the first new critical flow and document the decision.

---

## 13. Security Checklist for Every Feature

- [ ] Authenticated routes use the existing guard strategy.
- [ ] Service-level ownership is enforced.
- [ ] DTO input is validated and unknown properties are rejected.
- [ ] IDs cannot be used to access another student's data.
- [ ] Output excludes secrets and internal error details.
- [ ] AI routes have reasonable request-size and rate controls.
- [ ] User or AI text is rendered safely.
- [ ] Database writes are transactional where partial state would be harmful.
- [ ] Idempotency prevents duplicate rewards.
- [ ] Logs avoid sensitive content.

---

## 14. Performance and Reliability Rules

- Avoid loading entire catalogs when pagination/filtering is appropriate.
- Select only required Prisma fields for list screens.
- Index common filters such as published status, subject ID, user ID, session status, and timestamps.
- Keep the deterministic result response independent of slow AI feedback where practical.
- Use explicit timeouts for external providers.
- Avoid unbounded retries.
- Cache static definition data only when invalidation/version behavior is clear.
- Do not optimize blindly; measure slow queries or routes before large changes.

A practical completion flow is:

1. Compute and persist deterministic result transactionally.
2. Return the completed result promptly.
3. Generate AI narrative synchronously with a strict timeout or through an existing supported job mechanism.
4. Show deterministic feedback immediately and update narrative when available.

Do not introduce a new queue or infrastructure dependency solely for elegance unless the task approves it.

---

## 15. Documentation Rules

Update documentation in the same change when you alter:

- Environment variables
- Commands
- Routes
- API contracts
- Database schema or seed behavior
- AI provider behavior
- Scoring or XP policy
- Navigation labels
- User flows

Documentation must distinguish:

- Current behavior
- Implemented new behavior
- Proposed future behavior

Do not describe a proposed feature as already shipped.

---

## 16. Git and Change Hygiene

- Inspect `git status` before and after work.
- Do not overwrite unrelated human changes.
- Keep generated files out of commits unless the repository expects them.
- Do not commit `.env` files, credentials, database dumps, or private logs.
- Use focused commits when the workflow permits.
- Include migration and schema changes in the same coherent feature review.
- Avoid dependency upgrades unrelated to the requested work.
- Explain any new dependency and why built-in/current options were insufficient.

---

## 17. Prohibited Shortcuts

Do not:

- Replace the application with a new scaffold.
- Create mock-only screens and call the feature complete.
- Store XP or authoritative scores only in `localStorage`.
- Trust a user-supplied score.
- Let AI decide or overwrite an official score without deterministic evidence.
- Expose provider keys in frontend code.
- Skip ownership checks because a route is guarded.
- run `prisma migrate reset` against an unknown database.
- Swallow errors and return success.
- Add `any` broadly to silence TypeScript errors.
- Disable validation, lint, or tests to pass a gate.
- Add a large state-management or UI framework without a proven need.
- Generate dozens of scenarios before one has been reviewed and validated end to end.
- Claim a command passed when it was not executed.

---

## 18. Decision and Escalation Rules

Proceed with a safe default when the decision is reversible and documented. Escalate or stop before an irreversible action when:

- A migration could delete or reinterpret existing user data.
- Two schemas appear active and the migration target is uncertain.
- A secret is committed or exposed.
- A requirement conflicts with privacy, security, or academic integrity.
- The requested change would remove a working feature without migration.
- A deployment target is unclear and a command could affect production.

When blocked, provide:

- Exact evidence
- What has already been tried
- The safest options
- The recommended choice
- Work that can proceed independently

---

## 19. Completion Report Template

Use this format after each coherent work unit:

```md
## Completed
- User-visible outcome
- Key implementation details

## Changed Files
- `path/to/file` — reason

## Data/API Impact
- Migration, seed, endpoint, or contract changes

## Validation
- `command` — PASS/FAIL/NOT RUN and brief result

## Manual Checks
- Route/device/state checked

## Assumptions and Tradeoffs
- Assumption and effect

## Remaining Work or Risks
- Clearly scoped item
```

Keep the report factual. “Not run” is preferable to an unsupported success claim.

---

## 20. Final Agent Checklist

Before declaring a TourMate task complete:

- [ ] I read the relevant requirements and live implementation.
- [ ] I preserved unrelated working behavior.
- [ ] I implemented a coherent vertical slice.
- [ ] Server-side validation and ownership are present.
- [ ] Rewards and completion are idempotent.
- [ ] Deterministic behavior works without AI.
- [ ] AI output is constrained and validated.
- [ ] Loading, empty, error, and retry states exist.
- [ ] Mobile and keyboard paths were considered and checked.
- [ ] Tests cover high-risk behavior.
- [ ] Commands and results are reported honestly.
- [ ] Documentation matches what is actually implemented.
- [ ] No secrets or sensitive content were introduced.

