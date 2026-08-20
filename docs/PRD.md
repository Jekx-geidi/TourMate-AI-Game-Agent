# Product Requirements Document (PRD)

# TourMate Language Game

**Parent product:** TourMate AI
**Version:** 1.0
**Date:** 2026-08-20

---

## 1. Objective

Transform TourMate into a fully gamified multilingual learning platform focused on reading, writing, and vocabulary mastery instead of subject-based education.

See `BRD.md` §0 for how this supersedes the prior mission/simulation direction.

---

## 2. Functional Requirements

### 2.1 Reading Game

- System displays a foreign-language word.
- Player enters the English translation.
- System evaluates using exact match, synonyms, and fuzzy matching.
- Provide immediate feedback.
- Award XP.
- Track accuracy.

### 2.2 Writing Game

- System displays an English word or phrase.
- Player writes it in the target language.
- Evaluate using exact and fuzzy matching.
- Award XP.

### 2.3 Vocabulary Quiz

Support:

- Multiple Choice
- True/False
- Fill in the Blank
- Drag & Drop (future)

### 2.4 Scoring Engine

Each answer is categorized into one of the following levels:

| Score       | Description                                                     | XP Multiplier |
| ----------- | ---------------------------------------------------------------- | -------------- |
| ⭐⭐⭐ Perfect | Exact match or accepted synonym                                  | 1.0x           |
| ⭐⭐ Great     | Minor typo, one-character difference, high similarity (≈90–99%)  | 0.9x           |
| ⭐ Close      | Understandable but partially incorrect (≈70–89%)                 | 0.6x           |
| 💡 Almost    | Recognizable attempt but missing key characters (≈50–69%)        | 0.3x           |
| ❌ Wrong      | Incorrect or unrelated answer (<50%)                             | 0x             |

**Implementation notes**

- Use Levenshtein Distance for typo tolerance.
- Maintain an accepted-synonym dictionary per language pair (e.g. "thanks" and "thank you").
- Normalize input before scoring (trim whitespace, lowercase English, normalize Unicode, convert full-width/half-width characters where appropriate).
- Store both the raw answer and the normalized answer for analytics.
- Scoring must be deterministic: the same input always produces the same tier and XP, independent of any AI provider being available. See `UXS.md` for the worked examples this logic must reproduce exactly.

### 2.5 XP System

XP depends on:

- Difficulty
- Accuracy tier (from the scoring engine above)
- Combo multiplier (see `UXS.md` §3)
- Daily streak bonus
- First-time completion bonus

XP must be calculated and awarded server-side, with an idempotency key per completed round/session so retries or duplicate submissions cannot inflate XP.

### 2.6 Progress Tracking

Track per user:

- Reading accuracy
- Writing accuracy
- Vocabulary mastered
- Weak words
- Average response time
- Total XP
- Current streak
- Highest combo

### 2.7 Future Expansion

- Listening mode
- Speaking mode
- AI pronunciation feedback
- Multiplayer challenges
- Seasonal events
- Language tournaments
- Custom word packs
- Tourism scenario missions integrating reading, writing, listening, and speaking

Note: the last item is where the previous mission/simulation concept re-enters — as a later, optional integration layer on top of the game modes, not as the primary structure.
