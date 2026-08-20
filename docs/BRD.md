# Business Requirements Document (BRD)

# TourMate Language Game

**Parent product:** TourMate AI
**Repository:** `TourMate-AI-Game-Agent`
**Primary audience:** BS Tourism Management students
**Document status:** Active direction — supersedes the v1.0 mission/career-simulation BRD
**Version:** 2.0
**Date:** 2026-08-20

---

## 0. Relationship to the Prior Direction

TourMate AI's previous planning baseline (BRD v1.0, `UF.md` v1.0, and the `CLAUDE.md` first assignment) proposed a subject → lesson → quiz learning-management structure topped with a branching career-mission simulation layer (**TourMate Quest**).

That direction is superseded. TourMate is now a **game-first language learning platform**, structured the way Duolingo, Human Japanese, and Kanji Study are structured, but tourism-focused: reading, writing, vocabulary, and (later) listening/speaking games with score-driven XP and progression, instead of subject/lesson/quiz content browsing.

What still carries forward from the existing application, because it is infrastructure rather than curriculum shape:

- JWT authentication and protected routes
- The intent to make XP and progression server-authoritative (not browser `localStorage`)
- AI tutor/provider gateway work
- Existing account, profile, and dashboard shell

What is replaced:

- Subjects → Lessons → Quizzes as the primary navigation and content model
- The mission/simulation/rubric/Career Passport domain described in BRD v1.0

---

## 1. Vision

Build TourMate into a multilingual educational gaming platform where students learn foreign languages through interactive games instead of traditional lessons.

The system should prioritize engagement, replayability, progression, and gamification.

---

## 2. Business Goals

### Primary

Create an educational game students actually enjoy playing.

### Secondary

- Increase language recognition skills.
- Improve writing accuracy.
- Develop reading comprehension.
- Encourage daily practice.
- Increase session duration.

---

## 3. Supported Languages

**Initial release**

- Japanese
- Korean

**Future**

- Chinese
- Thai
- French
- Spanish
- German

---

## 4. Core Game Modes

### Reading Game

Player sees:

```
こんにちは
```

Player types:

```
hello
```

System evaluates the answer.

### Writing Game

Player sees:

```
Hello
```

Player writes:

```
こんにちは
```

System evaluates the answer.

### Vocabulary Challenge

Multiple choice.

### Typing Race

Fast typing challenge.

### Memory Match

Card matching.

### Daily Challenge

Random questions every day.

---

## 5. Progression

Players gain:

- XP
- Coins
- Badges
- Streak
- Rank

---

## 6. Success Metrics

- Daily Active Users
- Average Session Time
- Accuracy
- Replay Rate
- Retention
- XP Earned
- Games Completed

---

## 7. Related Documents

- `PRD.md` — functional requirements, scoring engine, XP formulas
- `UF.md` — user flows for first-time play, reading, writing, daily challenge
- `UIS.md` — screen-level interface specification
- `UXS.md` — feedback tiers, evaluation examples, combo/streak/unlock rules
