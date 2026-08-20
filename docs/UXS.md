# User Experience Specification (UXS)

# TourMate Language Game

**Parent product:** TourMate AI
**Version:** 1.0
**Date:** 2026-08-20

---

## 1. Feedback Levels

Instead of only Correct/Wrong, the system uses fuzzy matching against
the five-tier scoring engine defined in `PRD.md` §2.4.

**Correct**

```
こんにちは
User: こんにちは
```

Result: `Perfect ⭐⭐⭐`

**One character wrong**

```
User: こんにちわ
```

Result: `Great ⭐⭐ — Almost Perfect`

**Two characters wrong**

```
User: こんいちは
```

Result: `Close ⭐ — You're almost there.`

**Very different**

```
User: banana
```

Result: `Wrong — Try Again`

---

## 2. Reading Evaluation Examples

Question: `ありがとう`

| User answer  | Result  |
| ------------ | ------- |
| `thanks`     | Perfect |
| `thank you`  | Perfect |
| `thank u`    | Great   |
| `greetings`  | Close   |
| `banana`     | Wrong   |

These are the acceptance examples the scoring engine (`PRD.md` §2.4)
must reproduce exactly via its synonym dictionary and fuzzy-match
threshold — they should be encoded as test fixtures, not left to
implicit similarity-score tuning.

---

## 3. Combo System

Correct answers increase combo:

```
1x → 2x → 3x → 4x → 5x
```

Higher combo yields higher XP (combo is one of the XP multiplier
inputs listed in `PRD.md` §2.5).

---

## 4. Streak

Play every day to unlock rewards. Streak status feeds the daily-streak
bonus in the XP formula and is surfaced on the Dashboard (`UIS.md` §1).

---

## 5. Level Unlock

```
Level 1
  ↓
Reading
  ↓
Writing
  ↓
Typing
  ↓
Memory
  ↓
Boss Challenge
```
