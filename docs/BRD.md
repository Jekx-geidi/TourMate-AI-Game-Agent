# Business Requirements Document (BRD)

# TourMate Quest — AI Tourism Learning and Career Simulation

**Parent product:** TourMate AI  
**Repository:** `TourMate-AI-Game-Agent`  
**Primary audience:** BS Tourism Management students  
**Document status:** Proposed implementation baseline  
**Version:** 1.0  
**Date:** 2026-08-19

---

## 1. Executive Summary

TourMate AI is an existing tourism-focused study application with subjects, lessons, quizzes, flashcards, notes, games, maps/flags, language practice, AI tutoring, and progress views. The next product step is to connect these study tools to realistic workplace practice.

The proposed experience, **TourMate Quest**, adds branching tourism career missions, explainable rubric scoring, AI-assisted coaching, persistent progression, and a Career Passport. It is designed for BS Tourism Management students who need to move from remembering course content to applying it in guest-service, airline, event, travel, sustainability, product-development, and language situations.

The first release will not replace the current application. It will add one complete mission vertical slice, establish server-backed progression, and create a reusable architecture for future subject-aligned missions.

---

## 2. Business Context

### 2.1 Existing product value

The current application already supports major study activities:

- Account creation and authentication
- Subject and lesson exploration
- Notes
- Quizzes
- Flashcards
- Mini-games
- Maps and flags
- Language practice
- AI tutoring
- Progress tracking

These features reduce the cost and risk of building a new learning platform. The business opportunity is to make the existing capabilities feel like one coherent learning journey.

### 2.2 Current product gap

Study tools alone do not demonstrate whether a learner can apply knowledge in a realistic tourism service context. Existing short games provide engagement, but the application does not yet maintain a reusable, persistent model for:

- Workplace scenarios
- Branching decisions
- Versioned rubrics
- Session history
- Competency evidence
- Explainable performance feedback
- Durable game progression across devices

### 2.3 Opportunity

A simulation layer can differentiate TourMate AI by giving students a safe environment to practice decisions before internships, demonstrations, interviews, or workplace exposure.

The product can connect curriculum content to career readiness without becoming a full learning-management system or a consumer travel-booking service.

---

## 3. Product Vision

> Every tourism student should be able to practice realistic service decisions, understand the effect of those decisions, and build visible evidence of improvement.

### 3.1 Product promise

TourMate Quest will help a student answer three questions:

1. **What should I learn next?**
2. **Can I apply what I learned in a realistic situation?**
3. **Which tourism competencies am I improving?**

### 3.2 Value proposition

For tourism students who need applied practice, TourMate Quest is a mobile-first learning and career-simulation web application that combines course study, workplace missions, explainable scoring, and AI coaching in one progress journey.

Unlike a generic chatbot or quiz application, it grounds practice in tourism roles, curriculum subjects, versioned rubrics, and persistent competency evidence.

---

## 4. Business Objectives

### OBJ-01 — Increase applied learning

Enable students to practice tourism decisions, not only recall facts.

### OBJ-02 — Improve engagement through purposeful gameplay

Use missions, replay, XP, achievements, and progression to encourage repeated learning without encouraging meaningless point farming.

### OBJ-03 — Make learning progress understandable

Show subject mastery, mission results, and competency evidence in a student-friendly Career Passport.

### OBJ-04 — Provide scalable feedback

Use deterministic rules for fairness and AI for concise, personalized coaching, with a non-AI fallback.

### OBJ-05 — Preserve and extend existing investment

Retain existing features, content, users, and routes while adding value incrementally.

### OBJ-06 — Establish a future instructor foundation

Create versioned mission and rubric data that can later support instructor assignment, review, and authoring without building the complete instructor portal in the first release.

---

## 5. Success Measures

The following are **initial product targets**, not claims about current performance. Instrumentation must distinguish real measurements from planned targets.

### 5.1 Adoption and activation

- Percentage of newly registered students who complete at least one lesson, quiz, or mission in their first active session
- Percentage of eligible students who open the Missions catalog
- Percentage who start the first mission after viewing its details

### 5.2 Engagement

- Mission start-to-completion rate
- Replay rate after receiving improvement guidance
- Seven-day returning learner rate
- Average number of distinct learning activities per active learner

### 5.3 Learning behavior

- Percentage of replays that improve the previous best score
- Movement in competency evidence across repeated attempts
- Percentage of low-scoring results followed by a recommended lesson, quiz, or replay
- Distribution of rubric category scores to identify unclear content

### 5.4 Reliability

- Mission completion success rate when AI is disabled
- AI fallback usage rate
- Duplicate reward event rate, target zero
- Cross-user access failures detected in tests, target zero successful unauthorized accesses
- API error rate on critical mission routes

### 5.5 Proposed launch targets

These values may be revised after pilot data:

- At least 60% of started first missions are completed.
- At least 25% of students scoring below 75 take a recommended next action.
- At least 30% of students who replay improve their personal best.
- 100% of mission completions return a deterministic result even when AI is unavailable.
- 0 duplicate XP awards for the same session in test and production monitoring.

---

## 6. Stakeholders

| Stakeholder | Interest | Responsibility in product decisions |
|---|---|---|
| Tourism student | Clear learning, realistic practice, progress visibility | Primary user feedback and usability validation |
| Instructor/content reviewer | Curriculum accuracy and rubric quality | Review objectives, scenarios, answer consequences, and lesson links |
| Project owner | Product value, scope, release priorities | Approve scope and release gates |
| Project manager | Delivery coordination and acceptance | Track requirements, risks, and implementation status |
| Engineering team | Maintainable and secure implementation | Architecture, implementation, testing, operations |
| QA/UAT tester | End-to-end reliability and clarity | Validate user flows and failure paths |
| Future school/program administrator | Cohort management and analytics | Post-MVP requirements source |

---

## 7. User Personas

### P-01 — First-year tourism student

**Context:** Learning foundational terms and service principles. Often uses a phone.  
**Needs:** Clear instructions, low-pressure practice, immediate explanations, simple navigation.  
**Pain points:** Generic examples, dense reading, fear of making mistakes, unreliable connectivity.  
**Success:** Completes a short mission and understands what to review next.

### P-02 — Upper-year tourism student preparing for internship

**Context:** Knows core concepts but wants applied practice.  
**Needs:** Realistic decisions, service-recovery situations, career-oriented feedback, replay.  
**Pain points:** Memorization does not feel job-ready; feedback can be vague.  
**Success:** Builds evidence across communication, planning, service, and problem-solving competencies.

### P-03 — Tourism instructor/content reviewer

**Context:** Needs confidence that scenarios support course outcomes.  
**Needs:** Versioned content, clear rubric mapping, preview/review capability, future assignment tools.  
**Pain points:** AI-generated material may be inaccurate or culturally inappropriate.  
**Success:** Can verify why each option receives its points and how it connects to a lesson.

### P-04 — Student with intermittent or slower connectivity

**Context:** Uses mobile data or shared access.  
**Needs:** Lightweight pages, retry-safe actions, no loss of completed decisions.  
**Pain points:** Long AI waits, duplicate submissions, lost state after refresh.  
**Success:** Completes the core mission with deterministic feedback even if AI fails.

---

## 8. Jobs to Be Done

### JTBD-01

When I finish a lesson, I want a realistic situation where I can use the concept so that I know whether I understand it beyond memorization.

### JTBD-02

When I make a weak decision, I want a respectful explanation and a specific next action so that I can improve without feeling punished.

### JTBD-03

When I return on another device, I want my mission history and progression to remain available so that my effort is not lost.

### JTBD-04

When an AI service is unavailable, I still want to complete the learning activity and receive useful feedback.

### JTBD-05

When I prepare for an internship or assessment, I want to see the competencies I have practiced and the evidence behind them.

### JTBD-06

When I review a scenario as an instructor, I want to see its objectives, choices, consequences, scoring, and version so that I can judge whether it is suitable for students.

---

## 9. Scope

### 9.1 In scope for the first release

- Existing student authentication and study features
- Learner-focused navigation update
- Missions catalog and detail page
- One complete airline-operations mission
- Versioned mission definition
- Persistent user-owned sessions and decisions
- Deterministic scoring and rubric breakdown
- AI coaching after deterministic scoring
- Deterministic coaching fallback
- Server-backed XP/game profile
- Career Passport or equivalent progression view
- Related lesson recommendation
- Replay and personal-best behavior
- Critical tests, accessibility, and mobile support
- Documentation for setup, APIs, data, scoring, and AI configuration

### 9.2 In scope after the first vertical slice

- One reviewed mission per current subject area
- Competency aggregation across missions
- Achievement rules
- Mission filters and status
- Adaptive next-activity recommendations
- World Lab and Language Lab cross-links
- Instructor review metadata

### 9.3 Out of scope for the first release

- Travel bookings, payments, ticketing, reservations, or live inventory
- Real airline rebooking or compensation decisions
- Live emergency or safety instruction
- Visa/legal advice
- Native iOS/Android applications
- Live multiplayer
- Full instructor gradebook
- Full content-authoring studio
- Cohort enrollment and school administration
- High-stakes automatic grading
- Public sharing of student performance
- AI-only scoring

---

## 10. Functional Requirements

Priorities use:

- **Must:** Required for first release acceptance
- **Should:** High value after the core slice
- **Could:** Future enhancement

### 10.1 Authentication and account

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| AUTH-001 | Students shall register and sign in using the existing authentication flow. | Must | Existing flow remains functional after changes. |
| AUTH-002 | Protected learning and mission routes shall require authentication. | Must | Unauthenticated access redirects or returns the standard unauthorized behavior. |
| AUTH-003 | User-owned records shall be accessible only by their owner. | Must | Cross-user API tests fail safely. |
| AUTH-004 | The application shall not expose whether another user's session/result exists. | Must | Error behavior follows the secure repository convention. |
| AUTH-005 | Students shall be able to view and update supported profile fields. | Should | Existing profile behavior is preserved. |

### 10.2 Learn experience

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| LRN-001 | Students shall browse existing subjects and lessons. | Must | Existing subject and lesson routes pass regression checks. |
| LRN-002 | Lessons shall link to related missions when a reviewed relationship exists. | Should | Mission CTA displays only for a valid published relationship. |
| LRN-003 | Mission results shall link back to relevant lessons or practice activities. | Must | First mission result provides a valid next-learning action. |
| LRN-004 | Notes, quizzes, flashcards, and existing games shall remain available. | Must | No route or core behavior regression. |
| LRN-005 | Learning content shall distinguish reviewed content from generated coaching. | Should | UI labels or metadata make the source clear. |

### 10.3 Missions catalog

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| SIM-001 | Students shall view a catalog of published missions. | Must | Draft/unpublished missions are excluded. |
| SIM-002 | Mission cards shall show title, subject, difficulty, status, and relevant competency summary. | Must | Required metadata appears with accessible labels. |
| SIM-003 | Students shall filter missions by subject, difficulty, competency, or status. | Should | Filters produce consistent URLs/state. |
| SIM-004 | Students shall view mission objectives, role, context, related learning, and attempt status before starting. | Must | Detail page renders complete metadata. |
| SIM-005 | The catalog shall distinguish not started, in progress, completed, and unavailable states. | Must | Status is textual and not color-only. |

### 10.4 Mission sessions

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| SES-001 | An authenticated student shall start a published mission. | Must | Session is created with owner and mission version. |
| SES-002 | A student shall resume an in-progress session after refresh or a later sign-in. | Must | API returns expected step and stored decisions. |
| SES-003 | A mission shall present ordered steps with valid choices. | Must | Student cannot answer an invalid or future step. |
| SES-004 | Every answer shall be persisted before advancing. | Must | Refresh does not lose accepted decisions. |
| SES-005 | Duplicate answer submissions shall not duplicate decisions. | Must | Retry produces one canonical decision. |
| SES-006 | A completed session shall reject further answers. | Must | State-transition test passes. |
| SES-007 | Students shall be able to replay a completed mission in a new session. | Must | Prior results remain unchanged. |
| SES-008 | Students may abandon an in-progress mission. | Could | Abandoned state is explicit and recoverable by policy. |

### 10.5 Scoring and results

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| SCR-001 | The backend shall calculate the authoritative score from the mission version and recorded decisions. | Must | Client-supplied score is ignored/rejected. |
| SCR-002 | Results shall include overall and category scores. | Must | First mission shows all five rubric categories. |
| SCR-003 | Results shall include deterministic strengths, improvement areas, and next action. | Must | Useful result exists with AI disabled. |
| SCR-004 | A completion retry shall return the existing result without duplicate side effects. | Must | Idempotency test passes. |
| SCR-005 | Results shall retain mission and score-policy version information. | Must | Historical score meaning remains traceable. |
| SCR-006 | Students shall view latest and personal-best results distinctly. | Should | Career Passport and mission detail label both. |
| SCR-007 | Result labels shall be framed as learning guidance, not official academic grades. | Must | Copy includes appropriate context. |

### 10.6 AI Coach

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| AI-001 | The AI Coach shall explain tourism concepts using subject context. | Must | Existing tutor remains functional or is safely adapted. |
| AI-002 | Mission coaching shall be generated only after deterministic scoring. | Must | AI cannot block or change score calculation. |
| AI-003 | Mission AI output shall follow a validated structured schema. | Must | Malformed output is rejected and fallback used. |
| AI-004 | The application shall provide deterministic fallback feedback when AI fails. | Must | Mission completion succeeds with providers disabled. |
| AI-005 | Provider selection and status shall use one backend registry/gateway. | Must | Reported provider behavior matches invoked behavior. |
| AI-006 | Provider priority shall be configurable without frontend code changes. | Should | Backend environment/config controls priority. |
| AI-007 | Student-facing AI output shall not invent current law, visa rules, airline compensation, prices, or safety policy. | Must | Prompt and content constraints are documented and tested where possible. |
| AI-008 | The system shall record safe operational metadata about generated feedback. | Should | Provider/model/prompt version and fallback status are available without secrets. |

### 10.7 Game progression

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| GAM-001 | The server shall maintain one authoritative game profile per user. | Must | State persists across refresh and devices. |
| GAM-002 | XP awards shall be recorded as unique activity events. | Must | Same session cannot award XP twice. |
| GAM-003 | XP rules shall be transparent and versioned/documented. | Must | Formula and reason are visible in technical documentation. |
| GAM-004 | Students shall see current XP and level. | Must | Dashboard or Career Passport shows server values. |
| GAM-005 | Students shall earn achievements from server-evaluated rules. | Should | Unlock is unique and evidence-based. |
| GAM-006 | Existing browser-stored progression shall be reconciled safely. | Must | One-time rule is implemented or a documented safe transition is approved. |
| GAM-007 | Replays shall not permit unlimited reward farming. | Must | Replay XP policy and tests prevent repeated duplicate value. |

### 10.8 Competencies and Career Passport

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| CMP-001 | The system shall maintain canonical tourism competency definitions. | Should | Stable IDs and learner-friendly labels exist. |
| CMP-002 | Mission rubrics shall map to one or more competencies. | Must | First mission maps all scoring categories. |
| CMP-003 | Completed results shall create traceable competency evidence. | Must | Evidence references the result/session/version. |
| CMP-004 | Students shall view strengths, developing areas, attempts, and recent evidence. | Should | Career Passport explains source data. |
| CMP-005 | Recommendations shall use transparent rules. | Should | UI states why an activity is recommended. |
| CMP-006 | The system shall preserve historical evidence after a replay. | Must | New result does not overwrite prior result. |

### 10.9 World Lab

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| WRL-001 | Existing maps and flags activities shall remain available. | Must | Regression checks pass. |
| WRL-002 | The application should group geography activities under World Lab. | Should | Navigation label and route aliases preserve access. |
| WRL-003 | World Lab should support country, flag, capital, region, and later airport-code practice. | Could | Content model supports extension. |
| WRL-004 | Geographic facts used for assessment shall come from reviewed/static data. | Must | AI is not the sole source of answer keys. |

### 10.10 Language Lab

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| LNG-001 | Existing language learning shall remain available. | Must | Current route passes regression. |
| LNG-002 | Language practice should connect to tourism service contexts. | Should | At least one contextual link exists after expansion. |
| LNG-003 | AI role-play should identify that it is simulated practice. | Should | Student sees clear role/context. |
| LNG-004 | The application shall avoid evaluating accent, identity, or fluency through unsupported claims. | Must | Feedback focuses on the supplied text/task. |

### 10.11 Dashboard and navigation

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| NAV-001 | Main navigation shall support Dashboard, Learn, Missions, World Lab, Language Lab, AI Coach, Career Passport, and Profile. | Must | New IA is represented without breaking old routes. |
| NAV-002 | The dashboard shall show a clear next action. | Must | Student can resume or start a useful activity. |
| NAV-003 | In-progress missions shall be visible from the dashboard or Missions catalog. | Must | Resume action opens the correct session. |
| NAV-004 | Agent/provider status shall be secondary and not presented as a core learner activity. | Should | Status remains available where operationally useful. |

### 10.12 Future instructor capability

| ID | Requirement | Priority | Acceptance summary |
|---|---|---:|---|
| INS-001 | Future authorized reviewers should create draft mission versions. | Could | Data model supports draft/published/version states. |
| INS-002 | Future reviewers should inspect objective-to-step-to-rubric mapping. | Could | Mission definition retains reviewable structure. |
| INS-003 | Future instructors should assign missions and view cohort summaries. | Could | Not implemented in first release. |
| INS-004 | Future score overrides must require authorization and an audit trail. | Could | Architecture does not prevent later addition. |

---

## 11. Business Rules

### BR-001 — Published content

Only published mission versions are available to ordinary students. Drafts are not discoverable through catalog or direct route.

### BR-002 — Version lock

A session is bound to the mission version active when the session starts. Later content edits do not change that session's scoring.

### BR-003 — Authoritative score

The backend computes the score. The frontend may display a preview only if it is explicitly non-authoritative; the first release should avoid client score calculation.

### BR-004 — Completion

A session can be completed only after all required steps have one accepted decision.

### BR-005 — Completion idempotency

Completing the same session more than once returns the existing result and does not create additional rewards or evidence.

### BR-006 — XP authority

All authoritative XP changes are server-side activity events with a reason and unique key.

### BR-007 — Replay

A replay creates a new session. It cannot modify prior results. Replay rewards follow anti-farming rules.

### BR-008 — AI role

AI may provide narrative coaching but cannot alter stored score or fabricate mission answer keys.

### BR-009 — Fallback

AI unavailability cannot prevent a student from viewing a completed deterministic result.

### BR-010 — Competency evidence

Every competency claim displayed in the Career Passport must trace to a completed activity/result or an explicit reviewed rule.

### BR-011 — Content safety

Missions must avoid presenting generic practice as official airline, immigration, legal, emergency, medical, or security procedure.

### BR-012 — Privacy

The product shall collect only the data needed for account, learning, progression, reliability, and approved analytics purposes.

---

## 12. Non-Functional Requirements

### 12.1 Performance

| ID | Requirement |
|---|---|
| NFR-PERF-001 | Non-AI mission API operations should target a p95 response time below 800 ms under normal pilot load, excluding network conditions and approved long-running migrations. |
| NFR-PERF-002 | The deterministic completion transaction shall not wait indefinitely for an external AI provider. |
| NFR-PERF-003 | Catalog APIs shall avoid returning unnecessary full step/option content. |
| NFR-PERF-004 | Mobile pages shall avoid unnecessarily large media and blocking bundles. |

### 12.2 Availability and resilience

| ID | Requirement |
|---|---|
| NFR-REL-001 | Mission scoring and result retrieval shall work without external AI. |
| NFR-REL-002 | Retry of a timed-out write shall not duplicate decisions, results, XP, or achievements. |
| NFR-REL-003 | In-progress session state shall be stored on the server after each accepted decision. |
| NFR-REL-004 | Provider failures shall be isolated and normalized. |

### 12.3 Security

| ID | Requirement |
|---|---|
| NFR-SEC-001 | Authentication and user-resource ownership shall be enforced server-side. |
| NFR-SEC-002 | All write DTOs shall be validated and unknown fields rejected according to global policy. |
| NFR-SEC-003 | Provider, database, SMTP, and JWT secrets shall never be exposed to frontend bundles or responses. |
| NFR-SEC-004 | AI and authentication routes shall have appropriate abuse/rate controls before external rollout. |
| NFR-SEC-005 | Logs shall not contain passwords, tokens, secrets, or unnecessary sensitive prompt content. |

### 12.4 Accessibility

| ID | Requirement |
|---|---|
| NFR-A11Y-001 | Critical student flows shall support keyboard operation. |
| NFR-A11Y-002 | Status and score communication shall not rely on color alone. |
| NFR-A11Y-003 | Form fields and controls shall have accessible names. |
| NFR-A11Y-004 | Focus shall remain visible and move meaningfully during mission steps and errors. |
| NFR-A11Y-005 | Non-essential motion shall honor reduced-motion preferences. |

The target is conformance with WCAG 2.2 AA principles for critical flows, subject to a formal audit.

### 12.5 Usability

| ID | Requirement |
|---|---|
| NFR-UX-001 | The first mission shall be usable on a narrow mobile viewport without horizontal page scrolling. |
| NFR-UX-002 | Each mission page shall present one clear primary action. |
| NFR-UX-003 | Error states shall explain recovery in student-friendly language. |
| NFR-UX-004 | Technical provider names shall not dominate the learner experience. |

### 12.6 Maintainability

| ID | Requirement |
|---|---|
| NFR-MNT-001 | New backend domains shall follow NestJS module/service/controller boundaries. |
| NFR-MNT-002 | Mission definitions shall be data-driven enough that new choice-based missions do not require new routes. |
| NFR-MNT-003 | AI providers shall implement one common gateway interface. |
| NFR-MNT-004 | Database migrations and seed behavior shall be documented and repeatable. |
| NFR-MNT-005 | Requirements, APIs, scoring policy, and user flows shall be versioned with implementation changes. |

### 12.7 Compatibility

| ID | Requirement |
|---|---|
| NFR-CMP-001 | Existing student routes shall remain functional during IA migration. |
| NFR-CMP-002 | Existing user and learning records shall remain valid after schema changes. |
| NFR-CMP-003 | Supported modern mobile and desktop browsers shall be confirmed during release validation. |

---

## 13. Content and Pedagogy Requirements

- Every mission has one or more explicit learning objectives.
- Every decision step maps to at least one objective and competency.
- Every option has a plausible rationale and deterministic point mapping.
- Distractors represent realistic novice mistakes, not jokes or obviously absurd behavior.
- Feedback explains behavior and consequence rather than labeling the student.
- Content uses inclusive, culturally respectful examples.
- Generated feedback is distinguishable from reviewed curriculum content.
- Time-sensitive rules are not embedded as timeless facts without review/version context.
- Students receive a next action: review, practice, replay, or advance.

---

## 14. Data Requirements

The product must be able to represent:

- User and profile
- Subjects and lessons
- Mission definition, status, slug, subject, difficulty, and version
- Learning objectives and related lessons
- Ordered mission steps
- Options and rubric points
- Competency definitions and mappings
- User-owned session and state
- Accepted decisions
- Result snapshot and score-policy version
- AI feedback and safe provider metadata
- Game profile
- Idempotent activity/XP events
- Personal best and latest attempt derivation
- Competency evidence
- Achievement state in later scope

Data retention and deletion behavior for chats, AI evaluations, activity events, and analytics must be documented before broad external rollout.

---

## 15. Assumptions

- The existing subject taxonomy remains relevant for the initial mission set.
- Students use authenticated individual accounts.
- Existing PostgreSQL/Prisma infrastructure remains the system of record.
- The product can use reviewed seed content for the first mission.
- An external AI provider may be available, but availability is not guaranteed.
- Instructors/content owners will review scenario accuracy before a broad academic release.
- Responsive web is sufficient for the first release.
- Existing deployment configurations can be adapted after environment verification.

---

## 16. Dependencies

- Stable authentication and database connectivity
- Canonical Prisma schema and migration workflow
- Existing subject and lesson identifiers
- Reviewed first-mission content and rubric
- Backend environment management for AI providers
- Frontend API base configuration
- Product decision on legacy browser progression reconciliation
- QA access to at least two user accounts for ownership tests

---

## 17. Constraints

- Do not break existing study features.
- Do not expose secrets to the frontend.
- Do not require AI for core completion.
- Do not treat simulated decisions as official airline or legal guidance.
- Avoid large infrastructure additions for the first slice.
- Work within the existing React/NestJS/Prisma architecture unless a documented blocker proves otherwise.
- Data migrations must be additive and safe for existing users.

---

## 18. Risks

| ID | Risk | Business impact | Response |
|---|---|---|---|
| R-001 | Scenarios feel generic or inaccurate | Low trust and weak learning value | Subject-review workflow and objective/rubric mapping |
| R-002 | AI invents policy | Misinformation and reputational harm | Constrained prompts, deterministic source of truth, fallback, clear scope |
| R-003 | Duplicate rewards | Progress loses credibility | Transactions, unique event keys, retry tests |
| R-004 | Migration loses existing progression | Student dissatisfaction | Server authority plan and one-time safe reconciliation |
| R-005 | Large redesign breaks familiar features | Adoption and delivery risk | Incremental IA with legacy route preservation |
| R-006 | Slow AI delays result | Drop-off | Persist/return deterministic result first or enforce strict timeout |
| R-007 | Mission content changes invalidate old scores | Confusing evidence | Versioned definitions and result snapshots |
| R-008 | Mobile interface is too dense | Low completion | One decision per screen and narrow-width testing |
| R-009 | No frontend regression gate | Repeated UI defects | Add targeted component/route/browser tests |
| R-010 | Sensitive data appears in prompts/logs | Privacy risk | Minimize payloads and sanitize operational logs |

---

## 19. UAT Acceptance Scenarios

### UAT-01 — New student starts a mission

**Given** an authenticated student with no mission history  
**When** the student opens Missions, views Delayed Flight Passenger Assistance, and starts it  
**Then** an owned in-progress session is created and the first step is displayed.

### UAT-02 — Refresh and resume

**Given** a student has completed two accepted steps  
**When** the page is refreshed or the student returns later  
**Then** the mission resumes at the expected next step without losing accepted decisions.

### UAT-03 — Complete without AI

**Given** all external AI providers are disabled  
**When** the student completes every required step  
**Then** the backend records a deterministic result, awards XP once, and displays useful fallback coaching.

### UAT-04 — Retry completion

**Given** a completed session  
**When** the completion request is repeated because the client did not receive the first response  
**Then** the same result is returned and no duplicate XP or evidence is created.

### UAT-05 — Cross-user protection

**Given** Student A owns a session  
**When** Student B attempts to read, answer, complete, or view the result using its ID  
**Then** access fails safely without exposing Student A's data.

### UAT-06 — Replay and personal best

**Given** a student has completed a mission  
**When** the student starts a replay and achieves a higher score  
**Then** both results remain available, the new personal best is identified, and replay XP follows the documented anti-farming policy.

### UAT-07 — Weak result guides learning

**Given** a student receives a Developing or Practice Recommended result  
**When** the results page loads  
**Then** it names specific improvement areas and provides a working related lesson or replay action.

### UAT-08 — Mobile and keyboard use

**Given** a narrow viewport and keyboard-only input  
**When** the student completes the mission  
**Then** no required information is inaccessible, focus remains visible, and all actions are operable.

### UAT-09 — Existing feature regression

**Given** an existing student account  
**When** the student uses lessons, quizzes, flashcards, maps/flags, language, AI tutor, profile, and progress  
**Then** the core existing flows still work.

---

## 20. Release Gates

The first release is ready only when:

- All Must requirements relevant to the first slice are implemented or explicitly approved as exceptions.
- The first mission has subject/content review.
- Mission completion works with AI disabled.
- Ownership and idempotency tests pass.
- Existing authentication and study regression checks pass.
- Migration and seed behavior are repeatable.
- Mobile and keyboard UAT passes.
- Environment variables and deployment behavior are documented.
- No secret appears in source, frontend bundles, logs, fixtures, or documentation.
- Known limitations are stated honestly.

---

## 21. Requirement Traceability

| Product area | BRD IDs | User flow | Technical section |
|---|---|---|---|
| Mission discovery | SIM-001–SIM-005 | UF-03 | TDD catalog API/frontend |
| Mission play | SES-001–SES-008 | UF-04 | TDD session state machine |
| Results | SCR-001–SCR-007 | UF-05 | TDD scoring/completion |
| AI coaching | AI-001–AI-008 | UF-05, UF-07 | TDD AI gateway |
| Progression | GAM-001–GAM-007 | UF-05, UF-06 | TDD gamification |
| Career Passport | CMP-001–CMP-006 | UF-06 | TDD competency aggregation |
| Learn integration | LRN-001–LRN-005 | UF-02, UF-05 | IA Learn and related content |
| World/Language Labs | WRL/LNG requirements | UF-08, UF-09 | IA lab sections |
| Navigation | NAV-001–NAV-004 | UF-01, UF-02 | IA global navigation |

---

## 22. Open Product Decisions

These decisions should be resolved from repository evidence or product-owner approval, but they do not block safe Phase 0 auditing:

1. Exact learner-facing branding: “TourMate AI Missions” versus “TourMate Quest.”
2. Whether Career Passport is a renamed/extended Progress page or a new route with an alias.
3. Whether one in-progress session per mission is enforced or multiple sessions are allowed.
4. Whether immediate option consequences are shown after each step or only at the end.
5. Whether AI narrative is generated synchronously with a strict timeout or requested after the result page loads.
6. Exact one-time legacy XP reconciliation rule for existing accounts.
7. Initial competency aggregation rule beyond individual mission evidence.
8. Content-review ownership and publication process before external use.

Use the recommendations in `PLAN.md` and `docs/TDD.md` when a reversible implementation decision is needed.

