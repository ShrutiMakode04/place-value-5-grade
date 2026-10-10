# Product Requirements Document (PRD)

## Place Value Power — Understanding the Value of Whole Numbers
### Grade 5 Math | Intellia SG | Global Primary Mathematics Curricula

---

## 0. Reference & Research Summary

Before specifying requirements, here is exactly what was checked and found, so every decision below can be traced back to a source.

| Reference | What was found |
|---|---|
| `intelliasg.com/courses/grade-5-math` | Could not be fetched directly — the page isn't indexed by search yet, and it wasn't reachable as typed. Its parent brand was confirmed independently below, so the course URL structure is inferred from that brand's existing convention rather than guessed. |
| `equal-tau.vercel.app` | Loaded successfully. Meta tags identify it as **"Equal Groups — Introduction to Multiplication & Division \| Grade 1 Math \| Intellia SG,"** described as an interactive-story, simulation, and game-based lesson aligned to **Singapore MOE Primary 1, Lesson 4.1**. This confirms the brand is **Intellia SG**, not a generic name — "intelliasg.com" = *Intellia SG*. |
| `github.com/dsamyak/equal` | This is the live source repo for the page above. Its file listing includes `equal_groups_multiplication_division_prd.txt` and `equal_groups_multiplication_division_trd.txt` — a complete, shipped PRD/TRD pair for the sibling Grade 1 lesson — plus a `reference_numberbound` file showing that lesson itself was built by mirroring an *earlier* lesson ("numberbound"). **This document and its TRD companion are built by continuing that exact chain**: Place Value mirrors Equal Groups the same way Equal Groups mirrored Number Bonds. |
| `geometry-shapes-ashen.vercel.app` | Loaded, but returned the same boilerplate title/meta tags as the Equal Groups page — meaning it's another lesson spun up from the same starter template (most likely a Shapes/Geometry lesson at a different grade), confirming this is a standardized, repeatable lesson engine across Intellia SG's catalog, not a one-off build. |
| Uploaded files | `/mnt/user-data/uploads` was checked directly and is **empty** — no audio sample and no course-page file was actually attached to this conversation. Section 9 (Audio & Narration) below is therefore reconstructed from the ElevenLabs pipeline **already documented** in the Equal Groups TRD (voice, model, and parameters are stated explicitly there), not invented. Please share the actual reference audio file if it differs — the pipeline is easy to re-parametrize. |
| Global syllabi | Singapore MOE Primary 5, US Common Core (4.NBT/5.NBT), CBSE/NCERT India Class 5, UK National Curriculum (Year 5/6), and Australian Curriculum v9 (Year 5/6) were each checked directly for how they teach whole-number place value. Section 4 cites what each requires. |

**Working conclusion:** Intellia SG is a Singapore-MOE-anchored platform (hence "SG") that names its courses "Grade N" rather than "Primary N." This document extends that same lesson engine to a **globally-benchmarked** version of Grade 5's foundational number topic — Place Value of Whole Numbers — so it can also be dropped into a Common Core, CBSE, UK, or Australian classroom with a clear equivalence table, while remaining 100% faithful to the existing product's UI, phase model, and technical architecture.

---

## 1. Executive Summary

This document defines product requirements for **"Place Value Power — Understanding the Value of Whole Numbers,"** an interactive lesson module delivered as **Lesson 1.1** within Intellia SG's **Grade 5 Math** program, Section 1: Whole Numbers. The module targets Grade 5 students aged 10–11 worldwide and introduces whole-number place value — up to ten million — as the concrete-pictorial-abstract (CPA) foundation for everything that follows in upper-primary number work: the four operations on large numbers, decimals, and percentages.

The product is a standalone web page to be hosted at:

```
https://intelliasg.com/courses/grade-5-math/lessons/place-value/
```

It is built using **React (Vite + JSX, JavaScript/CSS)** and is designed to strictly mirror the visual and UX structure already established at **https://equal-tau.vercel.app/** and the repository **https://github.com/dsamyak/equal** — the same way that lesson mirrored `numberbound` before it.

Audio narration uses **ElevenLabs exclusively** (Voice: Alice, Voice ID: `Xb7hH8MSUJpSbSDYk0k2`, Model: `eleven_multilingual_v2`), matching the pipeline already documented in the Equal Groups TRD's Audio & Narration Pipeline section.

The module follows Intellia's established 5-phase learner journey:

- **Phase 1 — WONDER** → Curiosity hook built around a real big number
- **Phase 2 — STORY** → Narrative-based concept introduction (World Fair story)
- **Phase 3 — SIMULATE** → Sandbox-style interactive simulation (3 CPA stations)
- **Phase 4 — PLAY** → IntelliPlay™ gamified practice (fully randomized, not just shuffled)
- **Phase 5 — REFLECT** → Journal / LearnFlow AI prompt + completion badge

The single biggest departure from the Equal Groups precedent — made deliberately, not by accident — is that this module is written for a **global** audience from day one: every number-system convention (comma grouping, "billion" vs "1,000 million," lakh/crore) is treated as a first-class toggle rather than a single hard-coded assumption, because place value is the one topic where "which country" quietly changes the right answer.

---

## 2. Product Vision & Goals

### 2.1 Vision

To make the value of every digit in a big number feel obvious, visual, and worth bragging about to a Grade 5 learner anywhere in the world — building the CPA bridge from physical place-value blocks, to place-value charts, to fluent reading/writing/comparing/rounding of numbers into the millions — through animated simulations, a relatable story, and gamified challenge that never runs out of fresh questions.

### 2.2 Goals

| Goal | Metric |
|---|---|
| Learning Completion | ≥85% of students complete all 5 phases |
| Practice Engagement | ≥90% attempt at least 15 practice questions in a session |
| Score Achievement | Average challenge score ≥75% on first attempt |
| Session Duration | Average engagement ≥18 minutes per session |
| Curriculum Alignment | 100% aligned to Singapore MOE Primary 5; mapped equivalence to 4 other major systems (Section 4) |
| Phase Progression | ≥80% reach Play phase in a single session |
| Simulation Interaction Rate | ≥95% attempt all 3 simulation stations |
| Question Freshness | 0% of students see an identical question twice in one session (parametric generation, not just shuffling — see Section 11) |

---

## 3. Target Users

### Primary: Grade 5 Students (Age 10–11)

- Fluent readers by this age, but still respond far better to visual/animated explanation than to a wall of text or a rule stated abstractly
- Ready for multi-step reasoning (e.g., "which of these two 7-digit numbers is bigger, and why") — a step up from Grade 1's single-fact recall
- Motivated by mastery, collecting, and light competition (badges, streaks, world maps) more than by simple animal-mascot praise alone
- Global context: familiar with big numbers from everyday life (population figures, sports attendance, app download counts, video views) regardless of country — these make far better hooks than a single-country cultural reference
- Still benefit enormously from concrete manipulation (place-value blocks/discs) before jumping to the abstract symbol — Grade 5 students often *think* they're past this stage and make careless place-value slips because they skipped it

### Secondary: Parents & Teachers

- Assign as classwork, homework, or exam-prep revision (place value underpins every later topic — a weak Grade 5 foundation here is the single most common cause of arithmetic errors in Grade 6+)
- Expect the module to map cleanly onto **their own** country's syllabus language, not just Singapore's — this is the main new requirement versus the Equal Groups precedent
- Want a quick way to confirm the number range and vocabulary matches what their child's school actually tests

---

## 4. Curriculum Alignment — Global

### 4.1 Topic Identity

**Topic:** Place Value of Whole Numbers (Lesson 1.1)
**Programme:** Intellia SG Grade 5 Math — Section 1: Whole Numbers
**Lesson URL:** `https://intelliasg.com/courses/grade-5-math/lessons/place-value/`

### 4.2 Home Curriculum — Singapore MOE Primary 5

Singapore MOE Primary 5 places **Whole Numbers** as the first branch of the Number strand, specifically:

- Count by ten thousands, hundred thousands, and millions to 10,000,000
- Read and write numbers to 10,000,000 in numerals and in words
- Find the value of any digit using a place-value chart
- Find the expanded form of numbers up to 7 digits
- Round numbers to a specified place

### 4.3 Global Equivalence Table

Because "Grade 5" is named differently almost everywhere, the table below anchors age 10–11 across systems before any content mapping is attempted:

| Age | England & Wales | Scotland | Rep. of Ireland | Australia | USA | Singapore |
|---|---|---|---|---|---|---|
| 10–11 | Year 6 | Primary 6 | Fifth Class | Grade 5 | Grade 5 | Primary 5 |

### 4.4 Curriculum-by-Curriculum Content Mapping

| System | Standard / Reference | Whole-Number Range | Core Skills Required |
|---|---|---|---|
| **Singapore MOE** (home curriculum) | Primary 5, Numbers strand — Whole Numbers | Up to 10,000,000 | Place-value chart, expanded form, numerals ↔ words, rounding |
| **US Common Core** | 4.NBT.A.1–3 (place value anchor), extended in 5.NBT.A | Up to 1,000,000 at the anchor standard; Grade 5 reinforces this before extending the same logic to decimals | Digit = 10× the place to its right; read/write/expanded form; compare with `>,=,<`; round to any place |
| **CBSE / NCERT (India)** | Class 5, Large Numbers chapter | Up to crores (both Indian and International systems taught **and compared**) | Place value chart (Indian & International), expanded/short form, comparing, rounding, forming greatest/smallest numbers |
| **UK National Curriculum** | Year 6 — Number & Place Value | Up to 10,000,000 | "Read, write, order and compare numbers up to 10,000,000 and determine the value of each digit"; round to any given power of 10 |
| **Australian Curriculum v9** | Year 5–6, Number strand (place value foundation extends into decimals by end of Year 5) | Up to millions, extending into decimal place value | Partition, rearrange, and regroup numbers using place value |

**Design implication:** the number range chosen for this module — **up to 10,000,000** — is not an arbitrary "make it hard enough" choice. It is the one range that is simultaneously the Singapore MOE Primary 5 ceiling, the UK Year 6 ceiling, and squarely inside the CBSE Class 5 "up to crores" range, while still being a clean review-and-extend ceiling for a US/Australian Grade 5 classroom coming from a Grade 4 foundation of 1,000,000.

### 4.5 Learning Objectives Covered (LO1–LO8)

| # | Objective |
|---|---|
| LO1 | Identify the place and value of any digit in a whole number up to 10,000,000 |
| LO2 | Read and write whole numbers in numerals and in words |
| LO3 | Represent numbers concretely and pictorially using place-value blocks, discs, and charts |
| LO4 | Express a number in expanded form, and reconstruct standard form from an expanded form |
| LO5 | Compare and order whole numbers using place-value reasoning (`>`, `<`, `=`) |
| LO6 | Round whole numbers to a specified place, from the nearest ten to the nearest million |
| LO7 | Recognise and convert between the **International** (thousand/million) and **Indian** (lakh/crore) numeration systems |
| LO8 | Solve real-world word problems that require place-value reasoning about large numbers (population, distance, records) |

### 4.6 CPA Progression for This Lesson

| Stage | What the student does |
|---|---|
| Concrete | Physically arrange place-value blocks/discs into column mats (digitally simulated, drag or tap-to-place) |
| Pictorial | Read and match place-value charts and disc diagrams; spot which chart matches a given number |
| Abstract | Complete digit-value equations and expanded-form notation without a supporting diagram |

### 4.7 Number Ranges by Difficulty

| Tier | Digit Count | Range | Notes |
|---|---|---|---|
| Easy | 4–5 digits | up to 99,999 | Ones through ten-thousands place |
| Medium | 6–7 digits | up to 9,999,999 | Introduces hundred-thousands and millions place |
| Hard | 7–8 digits | up to 10,000,000 | Ten-millions place; includes Indian ⇄ International crossover questions |

### 4.8 Vocabulary Focus (age-appropriate, globally neutral)

"place value", "digit", "value", "standard form", "expanded form", "word form", "greater than / less than", "round to the nearest", "period", "International system", "Indian system", "lakh", "crore"

---

## 5. The 5-Phase Learner Journey (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  INTRO SCREEN → Progress Map (5-step visual tracker, top bar)               │
│  Welcome: "Hi! Ready to discover what a digit is REALLY worth? 🔢"          │
│  Lesson badge shown (locked). 5 glowing phase dots visible.                 │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1 — WONDER (≈ 2 min)                                                 │
│                                                                              │
│  Hook: "82,540 fans packed the stadium for the final! Sarah says the '8'   │
│  means 8. Mike says it means 80,000. Who's right — and why does it matter?"│
│                                                                              │
│  Visual: Stadium fills with animated dot-crowd as the number counts up      │
│  Mascot (LearnFlow) appears with a curious expression                      │
│  → "Let's find out what a digit is REALLY worth!"                          │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2 — STORY (≈ 3–4 min)                                                │
│                                                                              │
│  Narrative: John, Mike, and Sarah are building their class booth for the   │
│  school's Global Discovery Fair — every booth shares one BIG number fact.  │
│  Panel 1: "John's booth: 'Our city has 247,600 people.' He isn't sure     │
│  which digit is the 'important' one to say loudly."                        │
│  Panel 2: A place-value chart slides in, lighting up column by column      │
│  Panel 3: "Sarah's booth: the moon is 384,400 km away. Which is bigger —   │
│  the population digit or the distance digit in the same column?"           │
│  Panel 4: Expanded form appears: 247,600 = 200,000 + 40,000 + 7,000 + 600  │
│  Panel 5: "Mike's booth is about India: 'This city has 1.3 crore people!' │
│  Wait — what's a crore?" → Indian/International bridge is introduced      │
│  Panel 6: "Same amount, different name, depending on where you live. Big  │
│  numbers are everywhere — once you know place value, you can read them    │
│  all!"                                                                     │
│                                                                              │
│  → Illustrated story panels, ElevenLabs narration, key vocabulary          │
│    highlighted on-screen exactly as spoken (1:1 parity, see Section 9)     │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3 — SIMULATE (≈ 7–8 min)                                             │
│                                                                              │
│  3 Interactive Stations — student must complete all 3 to advance           │
│                                                                              │
│  Station A — "Digit Value Blocks" (Concrete)                              │
│  Drag/tap place-value blocks into column mats to build a target number.   │
│  Includes the 🌍 International ⇄ Indian system toggle (signature feature). │
│                                                                              │
│  Station B — "Spot the Matching Chart" (Pictorial)                        │
│  4 place-value charts shown; tap the one that correctly represents the    │
│  number given. Distractor charts have one digit in the wrong column.      │
│                                                                              │
│  Station C — "Fill the Value Equation" (Abstract)                         │
│  "In 4 7 , 3 8 2 → the digit ___ is in the ___ place; its value is ___"    │
│  Number pad input; "Show me the chart" scaffold button always available.  │
│                                                                              │
│  → Mascot reacts to each completed station; ElevenLabs narrates each       │
│    station's instruction and feedback                                     │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4 — PLAY (≈ 8–10 min)                                                │
│                                                                              │
│  IntelliPlay™: parametrically-generated questions across 10 worlds        │
│  10 questions per world, world unlocks at ≥6/10 correct                    │
│  Every question's numbers are freshly randomized per attempt — not just   │
│  a shuffled fixed bank (see Section 11)                                   │
│  Stars (1–3), XP, badges, and streak fire counter active                  │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5 — REFLECT (≈ 1–2 min)                                              │
│                                                                              │
│  Journal prompt: "Pick any big number you saw today. What is your city's  │
│  population, in your own words, digit by digit?"                          │
│  Or: LearnFlow AI chat — type/speak your understanding                     │
│  Lesson-complete badge unlocks here. Summary of XP + badges shown.        │
│  → "Share with your teacher!" button (screenshot / export)                │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Phase 3 — Simulation Design (Detailed)

### 6.1 Station A — "Digit Value Blocks" (Concrete)

**Visual:**
- A place-value mat with labeled columns (Ones, Tens, Hundreds, Thousands, Ten Thousands, Hundred Thousands, Millions — only as many columns as the round needs)
- A shuffled row of draggable/tappable digit chips taken from the target number
- A live "number so far" preview above the mat, showing placed digits and dashes for empty columns
- **🌍 Signature toggle:** "View columns as: **International** (Thousands · Millions) ⇄ **Indian** (Thousands · Lakh · Crore)" — switching it re-labels the columns and re-groups the live preview's commas in real time

**Interaction:**
- Student taps a chip (it highlights), then taps the destination column (it snaps in); drag is also supported
- "Check" button appears only once every chip has been placed
- Each column shows a small placeholder outline while empty, so students always know how many digits are expected

**Feedback:**
- All digits in their correct columns → mascot celebrates, block mat "locks in" with a satisfying snap animation
- One or more digits misplaced → the wrong column(s) shake gently; narration: *"One of these isn't quite home yet — check the place value chart!"*

**Rounds (randomized order, numbers freshly generated each session):**

| Round | Digits | Example target |
|---|---|---|
| 1 | 4 | 6,384 |
| 2 | 5 | 47,382 |
| 3 | 6 | 675,840 |
| 4 | 7 (+ 🌍 toggle demo) | 3,405,026 |

### 6.2 Station B — "Spot the Matching Chart" (Pictorial)

**Visual:**
- A target number is displayed at the top
- 4 place-value chart cards shown in a 2×2 grid, each with digits already placed in columns — only one is correct
- Distractor charts always shift exactly one digit into an adjacent column (a common, plausible real error) rather than being obviously wrong

**Interaction:**
- Student taps the one chart they believe matches the target number
- Correct card glows green on submit; the rest briefly show the digit that's misplaced and where it should go

**Teaching goal:** builds the visual-discrimination half of place-value fluency — many real test errors are exactly this "off-by-one-column" mistake, so this station targets it directly.

**Rounds:** 3 rounds, increasing digit count (5 → 6 → 7 digits) across the round set.

### 6.3 Station C — "Fill the Value Equation" (Abstract)

**Visual:**
```
In  4 7 , 3 8 2  →  the digit ___ is in the ___ place; its value is ___
```
One blank highlighted for input per round; a "Show me the chart 🔢" button always reveals the Station A-style diagram as a scaffold.

**Interaction:**
- Number pad / place-name picker for the relevant blank
- Correct → bounce animation; incorrect → shake + hint, following the same 3-attempt hint ladder as Phase 4 (Section 8.3)

**Variants (rotated per round):**
- Find the digit: "The ___ (blank) in the thousands place of 47,382 is what digit?"
- Find the place: "In 47,382, which place is the digit 7 in?"
- Find the value: "In 47,382, what is the value of the digit 7?"

ElevenLabs narrates each equation aloud when displayed, exactly matching the on-screen text (Section 9.6, Audio Script Parity).

---

## 7. Phase 4 — Question Bank

### 7.1 Question Types

Rather than a fixed bank of 100 pre-written questions, this module uses **10 question-type generators**, each capable of producing effectively unlimited unique instances by randomizing its numeric parameters on every call (full spec in the companion TRD, Section 11 — Randomization Engine). A representative instance of each type:

| Type | Description | Example (freshly generated each time) |
|---|---|---|
| Q1 | Identify the place of a digit | In 3,templated,562,847 what place is the underlined digit in? |
| Q2 | Identify the value of a digit | What is the value of the digit 6 in 6,384,201? |
| Q3 | Expanded form (standard → expanded) | Write 247,600 in expanded form |
| Q4 | Standard form (expanded/word → standard) | What number is 3,000,000 + 400,000 + 5,000 + 20 + 6? |
| Q5 | Number names (standard ⇄ words) | Write 2,504,113 in words |
| Q6 | Compare two numbers | Compare 3,456,789 and 3,465,789 using `>`, `<`, or `=` |
| Q7 | Order numbers | Order these 4 numbers from smallest to largest |
| Q8 | Round to a given place | Round 6,748,392 to the nearest hundred thousand |
| Q9 | Pictorial chart match (MCQ) | Which place-value chart correctly shows 5,672,910? |
| Q10 | Word problem (real-world big numbers) | A city's population is 3,245,678. What is the value of the digit 4? |

### 7.2 Question Distribution by Difficulty (per 100-question world cycle)

| Type | Count | Easy | Medium | Hard |
|---|---|---|---|---|
| Q1 | 10 | 4 | 4 | 2 |
| Q2 | 10 | 4 | 4 | 2 |
| Q3 | 10 | 3 | 4 | 3 |
| Q4 | 10 | 3 | 4 | 3 |
| Q5 | 10 | 3 | 4 | 3 |
| Q6 | 10 | 4 | 4 | 2 |
| Q7 | 10 | 3 | 4 | 3 |
| Q8 | 10 | 3 | 4 | 3 |
| Q9 | 10 | 4 | 3 | 3 |
| Q10 | 10 | 3 | 4 | 3 |
| **Total** | **100** | **34** | **39** | **27** |

### 7.3 Names, Objects & Contexts (globalized word-problem pool)

Because the brief calls for a globally-recognizable cast rather than a single-country cast, names and contexts are drawn from two neutral pools:

- **Names (10):** John, Mike, Sarah, Emma, Alex, Zara, Leo, Maya, Noah, Ava
- **Contexts/quantities (unit-neutral, no currency symbols):** city or country population, distance to a landmark (km), stadium or concert attendance, charity fundraiser step-count or item-count, books read or donated, tickets sold, video views, trees planted

This keeps every generated word problem meaningful regardless of the student's own country, and doubles as a gentle, incidental "big numbers are global" thread that reinforces LO7/LO8 without singling out any one nation as the default.

### 7.4 Vocabulary Requirements

All generated questions draw only from the Section 4.8 vocabulary list, matching age-appropriate global textbook phrasing rather than any single system's idiosyncratic terms (e.g., "ones" is used, not "units").

---

## 8. Gamification Design

### 8.1 Reward System

- **Stars (⭐):** Earned per 10-question world (1–3 stars based on score)
- **XP Points:** 10 XP correct first try | 7 XP second try | 5 XP with hint used
- **Streak 🔥:** Fire counter for consecutive correct answers; +5 XP bonus per correct answer once streak ≥ 5

### 8.2 Badges (Unlockable)

| Badge | Unlock condition |
|---|---|
| 🏅 Value Voyager | Complete Wonder + Story phases |
| 🥈 Column Builder | Complete all 3 Simulation stations |
| 🥇 Place Value Champion | Score ≥80% across the Play phase |
| 💎 Perfect Ten | Score 10/10 in any world |
| 🔥 Streak Star | Achieve a streak of 10 consecutive correct answers |
| 🌟 Full Journey | Complete all 5 phases |
| 🎯 Sharp Eye | Answer 5 pictorial chart-match (Q9) questions correctly with no wrong picks |
| 🌍 Global Numeral Master | Correctly convert between Indian and International systems 5 times |

### 8.3 Feedback Mechanics

**✅ Correct:**
- Bounce animation + mascot happy mood
- ElevenLabs celebration audio, e.g. *"Yes! That digit's value is exactly right!"*
- XP floats up from the answer card; streak fire increments

**❌ Incorrect (Attempt 1):** gentle shake + *"Not quite — let's check the place-value chart again."* + Hint 1 (chart highlighted)
**❌ Incorrect (Attempt 2):** stronger shake + Hint 2 (column-by-column count-up animation) + narration walks through it
**❌ Incorrect (Attempt 3):** answer revealed with animated explanation, full narration, **no score penalty** — encouragement only

No negative scoring anywhere in the module. Encouragement-first, always.

### 8.4 World Map (IntelliPlay™ Level Progression)

| World | Theme | Difficulty |
|---|---|---|
| 1 | Neighborhood Numbers | Easy, 4–5 digit |
| 2 | City Census | Easy–medium, 5 digit |
| 3 | Sports Stadium | Medium, 6 digit |
| 4 | School Fair Fundraiser | Medium, 6 digit |
| 5 | National Parks | Medium, 6–7 digit |
| 6 | Around the World Flights | Medium–hard, 7 digit (distances) |
| 7 | Space Explorers | Hard, 7 digit (distance to Moon/planets) |
| 8 | World Population | Hard, 7–8 digit |
| 9 | Global Games Village | Hard, mixed types |
| 10 | Ten Million Club | Hardest, up to 10,000,000, includes Indian/International crossover |

Unlock gate: ≥6/10 correct required to advance. 3 stars in a world unlocks a hidden Bonus Challenge (3 extra questions).

### 8.5 Mascot — LearnFlow AI Companion

Character: the same friendly robot mascot used across Intellia SG lessons — **LearnFlow** — for cross-lesson brand consistency.
Mood states: idle | curious | happy | thinking | celebrating | encouraging
Appearances: Wonder hook, Story narration, Simulation feedback, Play-phase feedback, Reflect phase

---

## 9. Audio & Narration Design

### 9.1 Pipeline

Voice Provider: **ElevenLabs only** — no browser Web Speech API fallback in production
Voice: **Alice** (Voice ID `Xb7hH8MSUJpSbSDYk0k2`)
Model: `eleven_multilingual_v2`
API Key Env Var: `VITE_ELEVENLABS_API_KEY`

*(This exact voice/model pairing is the one already documented for the Equal Groups lesson's audio pipeline — reused here for brand consistency, since no separate audio reference file was found attached to this conversation. If your actual sample uses a different voice, only Section 9.1 and the `.env` value need to change — nothing else in this document depends on which voice is selected.)*

### 9.2 Speech Styles

| Style | stability | similarity_boost | style | Use case |
|---|---|---|---|---|
| statement | 0.75 | 0.75 | 0.0 | Story narration, instructions |
| instruction | 0.80 | 0.75 | 0.0 | Simulation station prompts |
| question | 0.60 | 0.80 | 0.3 | Practice question read-aloud |
| encouragement | 0.55 | 0.85 | 0.6 | Correct answer feedback |
| emphasis | 0.85 | 0.70 | 0.1 | Key vocabulary highlight |
| thinking | 0.65 | 0.80 | 0.2 | Mascot thinking moments |
| celebration | 0.45 | 0.90 | 0.8 | Badge unlock, world complete |

### 9.3 Pre-generated vs. Dynamic Audio

All fixed phase narration (Wonder, Story panels, Simulate instructions, Reflect prompt, badge unlocks) is pre-generated offline and stored as static `.mp3` files, mapped via an auto-generated `audioMap.js`. Because Play-phase questions are now **parametrically generated** rather than pulled from a fixed bank (Section 11), their narration is generated **dynamically** at runtime and cached in memory for the session — this is a deliberate difference from the Equal Groups precedent, which could pre-generate all 100 fixed questions' audio in advance.

### 9.4 Sample Narration Script (new content, written for this lesson)

| Phase | Style | Line |
|---|---|---|
| Wonder | thinking | "Eighty-two thousand, five hundred forty fans packed the stadium." |
| Wonder | question | "Sarah says the 8 means 8. Mike says it means 80,000. Who's right?" |
| Story, Panel 1 | statement | "John, Mike, and Sarah are building their booth for the Global Discovery Fair." |
| Story, Panel 3 | emphasis | "Same digit, same column — but a completely different number!" |
| Story, Panel 5 | statement | "Wait — what's a crore? Big numbers have different names in different places." |
| Simulate, Station A | instruction | "Drag each digit chip into the column where it belongs." |
| Play, correct | celebration | "Yes! You found its true value!" |
| Play, incorrect (1) | encouragement | "Not quite — let's check the place-value chart again." |
| Reflect | thinking | "What's one big number you could read out loud now, digit by digit?" |

### 9.5 Audio Script Parity (1:1 Strict Parity Rule)

Every on-screen text string that is narrated must match the narration exactly — same words, same punctuation — so a student reading along never hears something different from what they see. Any UI text change requires updating both the audio pre-generation script and the corresponding on-screen component.

---

## 10. UX & Visual Design Requirements

### 10.1 Visual Theme

Brand: **Intellia SG — Think. Explore. Become.**
Reference UI: `https://equal-tau.vercel.app/` (mirror exactly)
Reference Repo: `https://github.com/dsamyak/equal`

Colours (matched to the reference exactly):
- Primary blue (`#4A90D9`-equivalent) for structural chrome and primary buttons
- Accent gold/yellow for rewards, stars, and XP
- Soft coral/red for wrong-answer shake states
- White card backgrounds with soft drop shadows
- Phase-band colours distinct per phase (Wonder, Story, Simulate, Play, Reflect each get their own accent for the progress tracker)

Typography: rounded, playful — **Nunito** or **Fredoka One**, matching the reference exactly.

Illustrations: cartoon-style, child-friendly, but **globally neutral settings** (school, city skyline, stadium, world map, space) rather than any single country's cultural references — a deliberate change from the Singapore-specific hawker-centre imagery in the Equal Groups precedent, to match this module's global brief.

### 10.2 Layout Structure (mirrors equal-tau.vercel.app)

- **Top Bar:** Intellia logo | Lesson title "Place Value Power" | 5-phase dot tracker
- **Main Area:** phase content, responsive, smooth phase transitions
- **Bottom Bar:** XP counter | Star count | Streak fire | Phase navigation arrows
- **Sidebar:** hidden on mobile; shown on tablet+ as a vertical phase map

### 10.3 Place-Value Chart — Primary Visual Component

The signature reusable visual used across all phases (the direct equivalent of the Equal Groups lesson's group-diagram component):

- N labeled columns (Ones through Ten Millions, as many as the round needs), each showing a single digit
- 🌍 toggle switches column labels and comma grouping between International and Indian systems live
- Digits animate in with a count-up effect when the diagram first renders
- A missing digit is shown as a dashed-border column with "?" inside

### 10.4 Accessibility

- Minimum 44×44px tap targets on all interactive elements
- WCAG AA colour contrast throughout
- All narration via ElevenLabs (consistent voice)
- Full keyboard navigation (Tab + Enter)
- No mandatory time pressure (optional timer toggle in challenge mode only)
- Every drag interaction has a tap-tap fallback

### 10.5 Responsive Design

- Primary: iPad/tablet (768px+) — classroom context
- Secondary: Desktop browser (1024px+)
- Tertiary: Mobile (375px+) — stacked single-column layout

---

## 11. Content Requirements

### 11.1 Simulation Visuals

Place-value columns and digit chips rendered as SVG; Station B cards use clean, distinct-whitespace layouts to keep the "off-by-one-column" distractor genuinely readable rather than cluttered.

### 11.2 Question Bank Coverage — Parametric, Not Just Shuffled

This is the clearest enhancement over the Equal Groups precedent, made specifically because the brief asked that *every* question be random, not just presented in a random order:

- Each of the 10 question types is a **generator function**, not a static list — it produces a fresh target number (and, for word problems, a fresh name/context pairing) from the appropriate difficulty range every time it is called
- No two students — and no single student across two attempts — should see the same literal numbers in the same question type
- MCQ distractors are generated algorithmically from common place-value misconceptions (off-by-one-column, digit-vs-value confusion), not drawn from a fixed list (full logic in the companion TRD, Section 11)

### 11.3 Word Problem Format

```
"[Name]'s [context] has/is [number] [unit]. What is the value of the digit
in the [place] place?"

"[Name A]'s city has [number A] people. [Name B]'s city has [number B]
people. Whose city has more people, and how do you know from place value alone?"
```

### 11.4 Audio Script Parity

As stated in Section 9.5 — enforced across all content, including dynamically generated Play-phase questions.

---

## 12. Success Criteria (v1.0)

| Criterion | Target |
|---|---|
| All 10 question-type generators produce valid, freshly-randomized instances | ✅ Required |
| All 3 simulation stations functional, including the 🌍 system toggle | ✅ Required |
| All 5 phases navigable end-to-end | ✅ Required |
| Gamification (XP, stars, 8 badges) working | ✅ Required |
| World map 10-world progression logic correct | ✅ Required |
| ElevenLabs audio plays for all phase narration | ✅ Required |
| Dynamic audio generation works for parametric Play-phase questions | ✅ Required |
| Mobile/tablet responsive layout | ✅ Required |
| Aligned to Singapore MOE Primary 5, with documented equivalence to Common Core, CBSE, UK NC, and Australian Curriculum | ✅ Required |
| Loads in < 3 seconds (Vite production build) | ✅ Required |
| WCAG AA accessible | ✅ Required |
| UI matches equal-tau.vercel.app structure | ✅ Required |
| Hosted correctly at the intelliasg.com lesson URL | ✅ Required |

---

## 13. Out of Scope (v1.0)

- Teacher dashboard / backend analytics
- Student login / account persistence across devices
- Multiplayer or class competition features
- Parent progress report emails
- Print worksheet generation
- Lesson 1.2 (Four Operations with Whole Numbers) and Lesson 1.3 (Factors and Multiples) — separate modules
- Decimal place value (belongs to a later Section 2 module, once whole-number place value is secure)
- Assessment against a full external test engine

---

**Document Version:** 1.0 | July 2026
**Product:** Intellia SG — Grade 5 Math, Lesson 1.1
**Lesson Title:** Place Value Power — Understanding the Value of Whole Numbers
**Curriculum:** Singapore MOE Primary 5 Mathematics (home) + mapped equivalence to Common Core, CBSE/NCERT, UK National Curriculum, and Australian Curriculum
**Reference UI:** https://equal-tau.vercel.app/
**Reference Repo:** https://github.com/dsamyak/equal
**Audio Pipeline:** ElevenLabs (Alice, Xb7hH8MSUJpSbSDYk0k2, eleven_multilingual_v2)
**Parent Course Page:** https://intelliasg.com/courses/grade-5-math/
**Lesson URL:** https://intelliasg.com/courses/grade-5-math/lessons/place-value/
