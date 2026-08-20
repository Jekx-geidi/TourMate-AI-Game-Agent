# User Flows (UF)

# TourMate Language Game

**Parent product:** TourMate AI
**Version:** 2.0 — supersedes the v1.0 mission/career-simulation user flows
**Date:** 2026-08-20
**Primary actor:** Authenticated student

---

## 1. Purpose

This document defines the intended user flows for TourMate as a game-first language learning platform. See `BRD.md` §0 for why this replaces the earlier subject/lesson/quiz and mission-simulation flows.

Each flow describes learner behavior, not visual layout — see `UIS.md` for screen-level detail and `UXS.md` for scoring/feedback behavior referenced from these flows.

---

## 2. First-Time User Flow

```
Register
  ↓
Choose Language
  ↓
Tutorial
  ↓
First Reading Game
  ↓
XP Reward
  ↓
Unlock Writing Game
```

---

## 3. Reading Flow

```
Dashboard
  ↓
Play
  ↓
Reading
  ↓
Question
  ↓
User Types English
  ↓
Evaluate
  ↓
Feedback
  ↓
XP
  ↓
Next Question
```

---

## 4. Writing Flow

```
Dashboard
  ↓
Writing
  ↓
English Word
  ↓
User Writes Japanese/Korean
  ↓
Evaluate
  ↓
Feedback
  ↓
XP
  ↓
Next
```

---

## 5. Daily Challenge Flow

```
Home
  ↓
Daily Challenge
  ↓
10 Random Questions
  ↓
Final Score
  ↓
Reward
  ↓
Leaderboard
```

---

## 6. Other Game Modes

Vocabulary Challenge, Typing Race, and Memory Match follow the same
`Question → Answer → Evaluate → Feedback → XP → Next` shape as the
Reading and Writing flows above, using the same scoring engine
(`PRD.md` §2.4) and feedback tiers (`UXS.md` §1). They are not
re-diagrammed separately unless their evaluation logic diverges from
that shared pattern.
