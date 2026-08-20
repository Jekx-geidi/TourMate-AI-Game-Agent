# User Interface Specification (UIS)

# TourMate Language Game

**Parent product:** TourMate AI
**Version:** 1.0
**Date:** 2026-08-20

---

## 1. Dashboard

Contains:

- XP Bar
- Daily Streak
- Coins
- Daily Challenge
- Continue Playing
- Leaderboard
- Achievements

---

## 2. Reading Screen

**Top**

- Progress
- Score
- Timer

**Middle**

- Large foreign word, e.g. `こんにちは`

**Bottom**

- Typing Input
- Submit
- Skip
- Hint

---

## 3. Writing Screen

**Top**

- Progress

**Middle**

- English prompt, e.g. `Good Morning`
- Input with Japanese/Korean keyboard support

**Bottom**

- Submit Button

---

## 4. Result Popup

Shows:

```
Great!
Correct Answer: こんにちは
+15 XP
Accuracy: 96%
```

Buttons:

- Continue
- Replay
- Exit

---

## 5. Statistics Screen

Shows:

- Accuracy
- Games Played
- Reading Accuracy
- Writing Accuracy
- Weak Vocabulary
- Strong Vocabulary

---

## 6. Accessibility Notes

These screens carry the same practical acceptance checks as the rest of
the app: usable at a narrow mobile viewport, keyboard-reachable
Submit/Skip/Hint/Continue/Replay/Exit actions, visible focus, and
result values (score, accuracy, XP) expressed as text/labels — not
color alone — so the Result Popup and Statistics Screen remain legible
without relying on the star-rating color coding in `UXS.md`.
