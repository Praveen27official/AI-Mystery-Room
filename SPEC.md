# SPEC.md — AI Mystery Room

## 1. Overview
AI-powered web app where a player enters a premise + difficulty, Gemini generates a mystery (story, suspects, clues, hints, hidden solution), the player investigates, requests hints, accuses a suspect, and sees verdict, score and explanation.
**Users:** students/casual players who like detective games. **Stack:** React, Vite, Tailwind, React Router, Axios; Node, Express, MongoDB (Mongoose), Zod, @google/genai.
**Core:** generate case, discover clues, hints, accuse, score, results, play again. **Optional:** case history list, share link, dark/noir theme.
**Limits:** no auth, one player per case (case id in URL), Gemini free-tier rate limits. **Deliverables:** SPEC.md, GitHub repo, live URL.

## 2. User Flow
1 Open site → 2 enter premise + difficulty → 3 Gemini generates case → 4 investigate (discover clues) → 5 request hints → 6 accuse suspect → 7 verdict, culprit, explanation, score → 8 start new mystery.

## 3. Pages
| Page | Route | Elements |
|---|---|---|
| Home | / | Intro, "Start" button |
| Create | /create | Premise textarea (10–300 chars), difficulty selector, loading spinner while generating, error banner |
| Investigation | /case/:id | Title, story, suspect cards, clue cards (locked → discover), hint button + hints list, progress bar, "Make accusation" |
| Accusation | /case/:id/accuse | Radio list of suspects, confirm button |
| Results | /case/:id/result | Verdict, score breakdown, culprit, explanation, "New mystery" |
Responsive: single column on mobile, 2-column grid ≥ md. Nav: header logo → Home. 404 → Home.

## 4. Backend
Base `/api`. All errors: `{ "error": "message" }` with 400 (validation), 404 (not found), 409 (already solved), 502 (Gemini failure), 500.
| Endpoint | Body | Response |
|---|---|---|
| POST /cases | `{premise, difficulty}` | `{id}` (+ public case) |
| GET /cases/:id | – | public case (no solution; undiscovered clue text hidden) |
| POST /cases/:id/clues/:clueId/discover | – | updated public case |
| POST /cases/:id/hints | – | `{hint, hintsUsed, hintsRemaining}` (400 if none left) |
| POST /cases/:id/accuse | `{suspectId}` | `{correct, score, culprit, explanation}` |
| GET /cases/:id/result | – | result (409 if not accused yet) |
**Model Case:** title, premise, story, difficulty, suspects[{id,name,role,description}], clues[{id,title,text,discovered}], hints[{text}], solution{culpritId,explanation} (`select:false`), progress{hintsUsed}, accusation{suspectId,correct}, score, status (active|solved).
**Security:** solution never sent until accusation is stored.

## 5. AI + Scoring
| Difficulty | Suspects | Clues | Hints |
|---|---|---|---|
| easy | 3 | 5 | 2 |
| medium | 4 | 7 | 3 |
| hard | 5 | 9 | 3 |
Gemini returns JSON only: `{title, story, suspects[{id,name,role,description}], clues[{id,title,text}], hints[string], culpritId, explanation}`. Validate with Zod: exact counts, unique ids, culpritId ∈ suspects, ≥ 2 clues must mention the culprit's name, retry up to 3 times, else 502. Hints must nudge, never name the culprit.
**Score (backend only):** correct = 100/150/200 (easy/medium/hard) else 0; +5 per discovered clue; −10 per hint; min 0. Wrong accusation still reveals the culprit.

## 6. Acceptance Criteria
- [ ] All 3 difficulties generate valid cases  - [ ] Investigate, hint, accuse work
- [ ] Solution absent from every pre-accusation response  - [ ] Backend computes score
- [ ] Results show culprit + explanation  - [ ] Invalid AI output / API failure handled gracefully
- [ ] Works on deployed site
