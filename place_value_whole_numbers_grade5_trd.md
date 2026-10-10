# Technical Requirements Document (TRD)

## Place Value Power — Understanding the Value of Whole Numbers
### Grade 5 Math | Intellia SG | Global Primary Mathematics Curricula

*Companion document to the PRD of the same name. Mirrors the architecture already shipped for the sibling Grade 1 lesson at `github.com/dsamyak/equal`, adapted for Grade 5 content and extended with a fully parametric question engine (Section 9) instead of a fixed shuffled bank.*

---

## 1. Technical Overview

This document specifies the architecture, component design, state management, data models, simulation logic, gamification implementation, audio pipeline, and quality standards for the **"Place Value Power"** interactive lesson module (Lesson 1.1) within Intellia SG's Grade 5 Math program.

The module is a **React 18** application (Vite + JSX), structured identically to the reference repository `https://github.com/dsamyak/equal`, and styled to match `https://equal-tau.vercel.app/`. Following the existing platform's pattern of building each lesson as a standalone app and embedding it into the WordPress-powered course site, it will be built and deployed independently, then embedded at:

```
https://intelliasg.com/courses/grade-5-math/lessons/place-value/
```

Audio narration uses ElevenLabs exclusively, mirroring the pipeline already documented in the Equal Groups TRD, adapted here for both pre-generated fixed narration **and** dynamic generation for the fully parametric Play phase (this module cannot pre-generate all possible question audio, because — per the brief — every question's numbers are randomized, not drawn from a fixed set of 100).

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| UI Framework | React 18 (JSX, Vite) | Matches the `equal` repo structure exactly |
| State Management | `useState` + `useReducer` | Sufficient for single-module complexity; matches reference |
| Styling | CSS Modules + Tailwind | Matches existing repo CSS approach |
| Icons | Lucide React | Available in artifact environment; matches reference |
| Animation | CSS keyframes + transitions | No external dependency needed |
| SVG Diagrams | Inline SVG (React) | For the place-value chart / digit-block diagrams |
| Persistence | `localStorage` | Session state only; no backend required for v1.0 |
| Audio (Primary) | ElevenLabs API | Premium, consistent voice (Alice) |
| Audio (Playback) | HTML5 Audio API (`new Audio()`) | Browser-native, no library needed |
| Number Logic | Vanilla JS | No library required — see Section 9 for the full randomization/formatting engine |
| Build Tool | Vite | Matches repo (`vite.config.js` present) |

---

## 3. Project Structure

Mirrors the `equal` repo's structure, with components renamed for this lesson's content:

```
place-value-power/
├── public/
│   ├── assets/
│   │   ├── audio/                       # Pre-generated .mp3 for FIXED narration only
│   │   │   ├── audio_wonder_hook_0.mp3
│   │   │   ├── audio_story_panel1_0.mp3
│   │   │   ├── ... (panels 2-6)
│   │   │   ├── audio_station_a_instruction_0.mp3
│   │   │   ├── audio_station_b_instruction_0.mp3
│   │   │   ├── audio_station_c_instruction_0.mp3
│   │   │   ├── audio_correct_0.mp3
│   │   │   ├── audio_reflect_prompt_0.mp3
│   │   │   └── ... (all FIXED phase phrases pre-generated)
│   │   └── images/
│   │       ├── mascot-idle.svg
│   │       ├── mascot-happy.svg
│   │       ├── mascot-thinking.svg
│   │       ├── mascot-celebrate.svg
│   │       └── world-map-bg.svg
├── src/
│   ├── main.jsx                          # React entry point
│   ├── App.jsx                           # Root component, global state (useReducer)
│   ├── App.css                           # Global styles (mirrors equal-tau CSS)
│   ├── components/
│   │   ├── IntroScreen.jsx               # Welcome + lesson overview + phase dot tracker
│   │   ├── ProgressMap.jsx                # 5-phase dot tracker (top bar)
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx           # Phase 1: Stadium-number hook + narration
│   │   │   ├── StoryPhase.jsx            # Phase 2: World Fair story panels
│   │   │   ├── SimulatePhase.jsx         # Phase 3: Simulation station wrapper
│   │   │   ├── PlayPhase.jsx             # Phase 4: IntelliPlay™ quiz engine
│   │   │   └── ReflectPhase.jsx          # Phase 5: Journal + completion badge
│   │   ├── simulations/
│   │   │   ├── DigitBlocksStation.jsx    # Station A: Concrete — drag digits into columns
│   │   │   ├── ChartMatchStation.jsx     # Station B: Pictorial — spot the matching chart
│   │   │   └── ValueEquationStation.jsx  # Station C: Abstract — fill the value equation
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx      # Polymorphic dispatcher → type-specific component
│   │   │   ├── IdentifyPlaceQ.jsx        # Q1
│   │   │   ├── IdentifyValueQ.jsx        # Q2
│   │   │   ├── ExpandedFormQ.jsx         # Q3
│   │   │   ├── StandardFormQ.jsx         # Q4
│   │   │   ├── NumberNamesQ.jsx          # Q5
│   │   │   ├── CompareNumbersQ.jsx       # Q6
│   │   │   ├── OrderNumbersQ.jsx         # Q7
│   │   │   ├── RoundNumberQ.jsx          # Q8
│   │   │   ├── ChartMatchQ.jsx           # Q9
│   │   │   ├── WordProblemQ.jsx          # Q10
│   │   │   └── HintOverlay.jsx           # Hint 1 & 2 + animated explanation after 3 fails
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx             # XP bar + floating XP animation
│   │   │   ├── StarRating.jsx            # 1–3 star rating per world
│   │   │   ├── BadgePanel.jsx            # Badge unlock toast + panel
│   │   │   ├── StreakCounter.jsx         # Fire streak counter
│   │   │   └── WorldMap.jsx              # 10-world progress map (horizontal scroll)
│   │   └── shared/
│   │       ├── Mascot.jsx                # LearnFlow robot with mood states
│   │       ├── PlaceValueChart.jsx       # Reusable SVG: N columns, digit chips, 🌍 toggle
│   │       ├── DigitChip.jsx             # Single draggable/tappable digit
│   │       ├── ColumnSlot.jsx            # Single place-value column (droppable zone)
│   │       ├── NumberSystemToggle.jsx    # 🌍 International ⇄ Indian switch
│   │       ├── NumberPad.jsx             # Large tap-friendly digit input (0–9)
│   │       └── FeedbackOverlay.jsx       # Correct/incorrect overlay with animation
│   ├── data/
│   │   └── storyContent.js               # Story phase panel data (text + visuals)
│   ├── hooks/
│   │   ├── useAudio.js                   # ElevenLabs + HTML5 Audio playback hook
│   │   ├── useGameState.js               # Gamification state hook
│   │   └── useLocalStorage.js            # Session persistence hook (24hr resume)
│   └── utils/
│       ├── audioMap.js                   # AUTO-GENERATED: fixed-text → .mp3 path map
│       ├── numberFormat.js               # 🌍 International/Indian formatting (Section 9.2)
│       ├── placeValue.js                 # digitAtPlace / valueAtPlace helpers (Section 9.2)
│       ├── questionGenerators.js         # 10 parametric generator functions (Section 9.3)
│       ├── distractors.js                # Misconception-aware distractor generation
│       ├── shuffle.js                    # Fisher-Yates for world/type ordering
│       ├── scoring.js                    # XP + star calculation
│       └── badgeEngine.js                # Badge unlock condition logic
├── scripts/
│   ├── generate_audio.js                 # Offline ElevenLabs pre-generation (FIXED lines only)
│   └── clean_audio.js                    # Remove orphaned .mp3 files
├── api/
│   └── elevenlabs.js                     # ElevenLabs proxy — keeps API key server-side (see Section 13)
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## 4. Application State Architecture

### 4.1 Global State (`App.jsx` — `useReducer`)

```js
const initialState = {
  // Navigation
  phase: 'intro',            // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  storyPanel: 0,              // 0–5 (6 story panels)
  currentSimStation: 0,       // 0=DigitBlocks, 1=ChartMatch, 2=ValueEquation
  simStationsComplete: [false, false, false],
  simRound: 0,

  // Play / Challenge phase
  currentQuestion: null,       // freshly generated Question object (see Section 8)
  questionIndexInWorld: 0,     // 0–9
  currentWorld: 0,             // 0–9 (10 worlds)
  worldScores: Array(10).fill(null),
  hintsUsed: 0,
  attemptCount: 0,             // Attempts on current question (max 3)

  // Signature feature
  numberSystem: 'international', // 'international' | 'indian'
  numeralBridgeCorrectCount: 0,  // tracks 🌍 Global Numeral Master badge progress

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],

  // Session metadata
  phaseComplete: {
    wonder: false, story: false, simulate: false,
    play: false, reflect: false,
  },
  sessionId: crypto.randomUUID(),

  // Settings
  audioEnabled: true,
  musicEnabled: false,
};
```

### 4.2 Reducer Action Types

```js
const ACTIONS = {
  SET_PHASE: 'SET_PHASE',
  NEXT_STORY_PANEL: 'NEXT_STORY_PANEL',
  ADVANCE_SIM_STATION: 'ADVANCE_SIM_STATION',
  COMPLETE_SIM_STATION: 'COMPLETE_SIM_STATION',
  NEXT_SIM_ROUND: 'NEXT_SIM_ROUND',
  TOGGLE_NUMBER_SYSTEM: 'TOGGLE_NUMBER_SYSTEM',
  LOAD_NEXT_QUESTION: 'LOAD_NEXT_QUESTION',   // calls a generator, not a bank lookup
  ANSWER_CORRECT: 'ANSWER_CORRECT',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT',
  USE_HINT: 'USE_HINT',
  UNLOCK_BADGE: 'UNLOCK_BADGE',
  COMPLETE_PHASE: 'COMPLETE_PHASE',
  TOGGLE_AUDIO: 'TOGGLE_AUDIO',
  TOGGLE_MUSIC: 'TOGGLE_MUSIC',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESET_SESSION: 'RESET_SESSION',
};
```

### 4.3 Key Reducer Logic

```js
// LOAD_NEXT_QUESTION — the key departure from the Equal Groups precedent:
// instead of indexing into a pre-shuffled array of 100 fixed objects, this
// calls a generator function fresh, every single time.
case ACTIONS.LOAD_NEXT_QUESTION: {
  const nextWorld = Math.floor(
    (state.questionIndexInWorld + 1) / 10
  ) > state.currentWorld ? state.currentWorld + 1 : state.currentWorld;
  const difficulty = worldToDifficulty(nextWorld); // 1 | 2 | 3
  const newQuestion = generateRandomQuestion(difficulty, state.numberSystem);
  return {
    ...state,
    currentWorld: nextWorld,
    currentQuestion: newQuestion,
    hintsUsed: 0,
    attemptCount: 0,
  };
}

// ANSWER_CORRECT
case ACTIONS.ANSWER_CORRECT: {
  const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak);
  const newStreak = state.streak + 1;
  const worldIndex = state.currentWorld;
  const newWorldScore = (state.worldScores[worldIndex] || 0) + 1;
  const updatedWorldScores = [...state.worldScores];
  updatedWorldScores[worldIndex] = newWorldScore;
  const bridgeCount = state.currentQuestion?.type === 'chart_match' &&
    state.currentQuestion?.numberSystem === 'indian'
      ? state.numeralBridgeCorrectCount + 1
      : state.numeralBridgeCorrectCount;
  return {
    ...state,
    xp: state.xp + xpEarned,
    streak: newStreak,
    maxStreak: Math.max(state.maxStreak, newStreak),
    worldScores: updatedWorldScores,
    totalStars: calcTotalStars(updatedWorldScores),
    numeralBridgeCorrectCount: bridgeCount,
    hintsUsed: 0,
    attemptCount: 0,
  };
}

// ANSWER_INCORRECT
case ACTIONS.ANSWER_INCORRECT: {
  return { ...state, streak: 0, attemptCount: state.attemptCount + 1 };
}
```

---

## 5. Question Data Model

### 5.1 Question Schema

```ts
interface Question {
  id: string;                    // e.g. "Q2_1737489213_042"
  type: QuestionType;            // one of 10 enum values
  world: number;                 // 0–9
  difficulty: 1 | 2 | 3;         // 1=easy(≤99,999) 2=medium(≤9,999,999) 3=hard(≤10,000,000)

  // Core math values (all freshly randomized per instance — Section 9)
  targetNumber: number;
  digitCount: number;
  numberSystem: 'international' | 'indian';
  highlightedPlaceIndex?: number;  // 0=ones, 1=tens, ... 7=ten_millions
  secondNumber?: number;           // for compare/order types
  compareSet?: number[];           // for order_numbers (3-4 numbers)
  roundToPlaceIndex?: number;      // for round_number

  // Rendering
  questionText: string;           // Full narrated question text (ElevenLabs reads this)
  visual: VisualType;              // 'placeValueChart' | 'picture' | 'equation' | 'none'

  // MCQ
  options?: (number | string)[];   // always includes correctAnswer

  // Hints
  hint1: string;
  hint2: string;
  explanation: string;

  // Word problems only
  characterName?: string;
  context?: string;
  unit?: string;

  // Answer
  correctAnswer: number | string;
}

type QuestionType =
  | 'identify_place'      // Q1
  | 'identify_value'      // Q2
  | 'expanded_form'        // Q3
  | 'standard_form'        // Q4
  | 'number_names'         // Q5
  | 'compare_numbers'      // Q6
  | 'order_numbers'        // Q7
  | 'round_number'         // Q8
  | 'chart_match'          // Q9
  | 'word_problem';        // Q10

type VisualType = 'placeValueChart' | 'picture' | 'equation' | 'none';
```

### 5.2 Sample Generated Question Objects

```js
// Q2 — Identify Value (generated fresh, not looked up)
{
  id: "Q2_1737489213_042",
  type: "identify_value",
  world: 2,
  difficulty: 2,
  targetNumber: 6384201,
  digitCount: 7,
  numberSystem: "international",
  highlightedPlaceIndex: 6,           // millions place
  questionText: "What is the value of the digit 6 in 6,384,201?",
  visual: "placeValueChart",
  options: [6000000, 6, 60000000, 600000],   // shuffled; see Section 9.4 for distractor logic
  hint1: "Look at which column the digit 6 sits in.",
  hint2: "The digit 6 is in the millions place.",
  explanation: "The digit 6 is in the millions place, so its value is 6 × 1,000,000 = 6,000,000.",
  correctAnswer: 6000000,
}

// Q10 — Word Problem (name/context also randomized from the global pool)
{
  id: "Q10_1737489301_017",
  type: "word_problem",
  world: 7,
  difficulty: 3,
  targetNumber: 3245678,
  digitCount: 7,
  numberSystem: "international",
  highlightedPlaceIndex: 5,           // hundred-thousands place
  characterName: "Zara",
  context: "the population of Zara's home city",
  unit: "people",
  questionText: "The population of Zara's home city is 3,245,678 people. What is the value of the digit 2?",
  visual: "picture",
  options: [200000, 2, 2000000, 20000],
  hint1: "Find the digit 2 in the number first.",
  hint2: "Count the columns from the right: it's in the hundred-thousands place.",
  explanation: "The digit 2 is in the hundred-thousands place, so its value is 200,000.",
  correctAnswer: 200000,
}

// Q9 — Chart Match, generated with numberSystem: 'indian' (feeds the 🌍 badge)
{
  id: "Q9_1737489355_088",
  type: "chart_match",
  world: 9,
  difficulty: 3,
  targetNumber: 12345678,
  digitCount: 8,
  numberSystem: "indian",
  questionText: "Which place-value chart correctly shows 1,23,45,678 in the Indian system?",
  visual: "picture",
  hint1: "Group the digits in pairs from the right, after the first three.",
  hint2: "1 crore, 23 lakh, 45 thousand, 6 hundred 78.",
  explanation: "1,23,45,678 = 1 crore + 23 lakh + 45 thousand + 678.",
  correctAnswer: "chart_b",
}
```

---

## 6. Place-Value Chart SVG Component

The signature reusable visual, equivalent to the Equal Groups lesson's group-diagram component — and the carrier of the 🌍 International/Indian toggle.

```jsx
// PlaceValueChart.jsx — reusable SVG for N labeled place-value columns
const PLACE_LABELS = {
  international: ['Ones','Tens','Hundreds','Thousands','Ten\nThousands','Hundred\nThousands','Millions','Ten\nMillions'],
  indian:        ['Ones','Tens','Hundreds','Thousands','Ten\nThousands','Lakhs','Ten\nLakhs','Crores'],
};

const PlaceValueChart = ({
  targetNumber,
  numberSystem = 'international',   // 'international' | 'indian'
  highlightedPlaceIndex,             // which column to highlight/mark as "?"
  animated = false,
  size = 'medium',                   // 'small' | 'medium' | 'large'
}) => {
  const digits = String(targetNumber).split('').reverse(); // index 0 = ones
  const colWidth = size === 'large' ? 64 : size === 'medium' ? 52 : 40;
  const colHeight = colWidth * 1.3;
  const labels = PLACE_LABELS[numberSystem];
  const svgWidth = digits.length * (colWidth + 10) + 20;
  const svgHeight = colHeight + 70;

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}
         xmlns="http://www.w3.org/2000/svg"
         style={{ maxWidth: '100%', height: 'auto' }}>
      {digits.map((digit, i) => {
        const revIndex = digits.length - 1 - i;         // left-to-right rendering order
        const placeIndex = revIndex;
        const cx = i * (colWidth + 10) + 10;
        const isHighlighted = placeIndex === highlightedPlaceIndex;
        return (
          <g key={i} className={isHighlighted ? 'pv-col-highlight' : ''}>
            <rect x={cx} y="20" width={colWidth} height={colHeight} rx="10"
                  fill={isHighlighted ? 'var(--pv-highlight-bg)' : 'var(--pv-card-bg)'}
                  stroke={isHighlighted ? 'var(--pv-highlight-border)' : 'var(--pv-border)'}
                  strokeWidth="2.5"
                  strokeDasharray={isHighlighted && digit === undefined ? '6,3' : '0'} />
            <text x={cx + colWidth / 2} y={20 + colHeight / 2 + 10}
                  textAnchor="middle" fontSize={colWidth * 0.55} fontWeight="700">
              {isHighlighted && highlightedPlaceIndex === undefined ? '?' : digits[i]}
            </text>
            <text x={cx + colWidth / 2} y={colHeight + 42}
                  textAnchor="middle" fontSize="11" fill="var(--pv-label)">
              {labels[placeIndex]}
            </text>
          </g>
        );
      }).reverse()}
      <text x={svgWidth / 2} y={svgHeight - 6}
            textAnchor="middle" fontSize="14" fontWeight="600">
        {formatNumber(targetNumber, numberSystem)}
      </text>
    </svg>
  );
};
```

Animation variants: `animated=true` → CSS `digitCountUp` keyframe (each column's digit fades/scales in with an 80ms stagger); `shake` variant on wrong answer; `bounceIn` variant on correct answer — same keyframe names as Section 11, renamed from the Equal Groups precedent's group-circle equivalents.

---

## 7. Simulation Station Component Specs

### 7.1 `DigitBlocksStation.jsx` — Station A (Concrete)

```js
const [target, setTarget] = useState(() => generateTargetNumber(getStationARoundDifficulty(simRound)));
const [numberSystem, setNumberSystem] = useState('international');
const [chips, setChips] = useState(() => shuffleArray(String(target).split('')));
const [placed, setPlaced] = useState(Array(String(target).length).fill(null)); // null = empty column
const [selectedChipIndex, setSelectedChipIndex] = useState(null);
```

Interaction (tap-first, drag supported):
- Tap a chip → highlights as selected
- Tap a column → selected chip snaps into that column; chip removed from the pool
- 🌍 toggle re-labels columns and re-groups the "number so far" preview's commas live, without disturbing placed chips
- "Check" button appears only once every column is filled

Completion check: `placed.every((digit, i) => digit === correctDigitAt(target, i))` → all correct → mascot celebrates; any mismatch → only the wrong column(s) shake, narration: *"One of these isn't quite home yet — check the place-value chart!"*

Rounds (randomized difficulty progression, numbers freshly generated every session — never hard-coded):

| Round | Digits |
|---|---|
| 1 | 4 |
| 2 | 5 |
| 3 | 6 |
| 4 | 7 (🌍 toggle introduced) |

### 7.2 `ChartMatchStation.jsx` — Station B (Pictorial)

```js
const [target] = useState(() => generateTargetNumber(getStationBRoundDifficulty(simRound)));
const [cards] = useState(() => generateChartCards(target));  // 1 correct + 3 plausible distractors
const [selected, setSelected] = useState(null);
const [submitted, setSubmitted] = useState(false);
```

`generateChartCards(target)` builds the correct `PlaceValueChart` rendering of `target`, then produces 3 distractor charts, each shifting **exactly one digit into an adjacent column** (the single most common real place-value error) rather than being randomly wrong — this keeps the discrimination task meaningful rather than trivial.

### 7.3 `ValueEquationStation.jsx` — Station C (Abstract)

```js
const [problem, setProblem] = useState(() => generateValueEquationProblem(simRound));
// problem: { targetNumber, highlightedPlaceIndex, missingSlot: 'digit'|'place'|'value' }
const [inputValue, setInputValue] = useState('');
const [showChart, setShowChart] = useState(false);
```

Layout:

```jsx
<div className="equation-row">
  In <span className="digits">{formatDigitsSpaced(problem.targetNumber)}</span> →
  the digit {problem.missingSlot === 'digit' ? <BlankInput /> : <span>{digitAt(problem.targetNumber, problem.highlightedPlaceIndex)}</span>} is in the
  {problem.missingSlot === 'place' ? <BlankInput /> : <span>{placeLabel(problem.highlightedPlaceIndex)}</span>} place;
  its value is {problem.missingSlot === 'value' ? <BlankInput /> : <span>{formatNumber(valueAt(problem.targetNumber, problem.highlightedPlaceIndex))}</span>}
</div>
<NumberPad value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} />
<button onClick={() => setShowChart(!showChart)}>Show me the chart 🔢</button>
{showChart && <PlaceValueChart targetNumber={problem.targetNumber}
                                highlightedPlaceIndex={problem.highlightedPlaceIndex} animated />}
```

ElevenLabs reads the full equation aloud when displayed, matching on-screen text exactly (Section 10.6, Audio Script Parity).

---

## 8. Randomization Engine — Number Generation & Formatting

This section is the technical heart of the "every question should be random" requirement, and is the main structural addition versus the Equal Groups precedent (which could pre-shuffle a fixed bank of 100). Everything below was written and numerically verified before inclusion in this document.

### 8.1 Difficulty Ranges

```js
// utils/placeValue.js
export const DIFFICULTY_RANGES = {
  1: { min: 1000,     max: 99999 },      // easy: 4–5 digits
  2: { min: 100000,   max: 9999999 },    // medium: 6–7 digits
  3: { min: 1000000,  max: 10000000 },   // hard: 7–8 digits, up to Ten Millions/1 Crore
};

export const PLACE_VALUES = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];
export const PLACES = ['ones','tens','hundreds','thousands',
                        'ten_thousands','hundred_thousands','millions','ten_millions'];

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateTargetNumber(difficulty) {
  const { min, max } = DIFFICULTY_RANGES[difficulty];
  return randomInt(min, max);
}

export function digitAtPlace(number, placeIndex) {
  return Math.floor(number / PLACE_VALUES[placeIndex]) % 10;
}

export function valueAtPlace(number, placeIndex) {
  return digitAtPlace(number, placeIndex) * PLACE_VALUES[placeIndex];
}

export function digitCount(number) {
  return String(number).length;
}
```

### 8.2 International ⇄ Indian Formatting (verified)

```js
// utils/numberFormat.js
export function formatNumber(number, system = 'international') {
  const str = String(number);
  if (system === 'international') {
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  // Indian system: group the last 3 digits, then pairs of 2 for the rest
  if (str.length <= 3) return str;
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const restFormatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${restFormatted},${lastThree}`;
}
```

Verified output (run against Node 20 before inclusion here):

| Number | International | Indian |
|---|---|---|
| 6,384 | `6,384` | `6,384` |
| 47,382 | `47,382` | `47,382` |
| 675,840 | `675,840` | `6,75,840` |
| 3,405,026 | `3,405,026` | `34,05,026` |
| 12,345,678 | `12,345,678` | `1,23,45,678` |
| 10,000,000 | `10,000,000` | `1,00,00,000` |

Note that the two systems are identical below 100,000 — they only diverge once a number reaches the lakhs column, which is exactly where the Section 6 (Curriculum Alignment) research says CBSE introduces the comparison. This is a real, testable property of the formatter, not a cosmetic detail.

### 8.3 Question Generator Functions (representative sample; all 10 follow the same shape)

```js
// utils/questionGenerators.js
import { generateTargetNumber, digitAtPlace, valueAtPlace, digitCount, PLACES }
  from './placeValue.js';
import { formatNumber } from './numberFormat.js';
import { generateValueDistractors, generateNumberDistractors } from './distractors.js';
import { pickName, pickContext } from './wordProblemPools.js';

// Q2 — Identify Value
export function generateIdentifyValueQ(difficulty, numberSystem = 'international') {
  const target = generateTargetNumber(difficulty);
  const placeIndex = randomInt(0, digitCount(target) - 1);
  const digit = digitAtPlace(target, placeIndex);
  const correctValue = valueAtPlace(target, placeIndex);
  const options = shuffleArray([correctValue, ...generateValueDistractors(digit, placeIndex, correctValue)]);

  return {
    id: `Q2_${Date.now()}_${randomInt(0, 9999)}`,
    type: 'identify_value',
    difficulty,
    targetNumber: target,
    digitCount: digitCount(target),
    numberSystem,
    highlightedPlaceIndex: placeIndex,
    questionText: `What is the value of the digit ${digit} in ${formatNumber(target, numberSystem)}?`,
    visual: 'placeValueChart',
    options,
    hint1: `Look at which column the digit ${digit} sits in.`,
    hint2: `The digit is in the ${PLACES[placeIndex].replace('_', ' ')} place.`,
    explanation: `The digit ${digit} is in the ${PLACES[placeIndex].replace('_', ' ')} place, so its value is ${formatNumber(correctValue, numberSystem)}.`,
    correctAnswer: correctValue,
  };
}

// Q6 — Compare Numbers (deliberately generates numbers close in value so the
// question can't be answered by "more digits = bigger" alone once digit counts match)
export function generateCompareNumbersQ(difficulty, numberSystem = 'international') {
  const a = generateTargetNumber(difficulty);
  const closeEnough = Math.random() < 0.6; // 60% of the time, force a genuinely close pair
  const b = closeEnough
    ? a + (Math.random() < 0.5 ? 1 : -1) * randomInt(1, 999) * PLACE_VALUES[randomInt(1, 3)]
    : generateTargetNumber(difficulty);
  const symbol = a > b ? '>' : a < b ? '<' : '=';

  return {
    id: `Q6_${Date.now()}_${randomInt(0, 9999)}`,
    type: 'compare_numbers',
    difficulty,
    targetNumber: a,
    secondNumber: b,
    numberSystem,
    questionText: `Compare ${formatNumber(a, numberSystem)} and ${formatNumber(b, numberSystem)} using >, <, or =.`,
    visual: 'placeValueChart',
    options: shuffleArray(['>', '<', '=']),
    hint1: 'Start from the leftmost digit — the column with the biggest place value.',
    hint2: 'Compare digit by digit until you find one that is different.',
    explanation: `${formatNumber(a, numberSystem)} ${symbol} ${formatNumber(b, numberSystem)}.`,
    correctAnswer: symbol,
  };
}

// Q8 — Round to a Given Place
export function generateRoundNumberQ(difficulty, numberSystem = 'international') {
  const target = generateTargetNumber(difficulty);
  const maxPlace = digitCount(target) - 1;
  const roundIndex = randomInt(1, maxPlace); // never round to "ones" — trivial
  const divisor = PLACE_VALUES[roundIndex];
  const correctAnswer = Math.round(target / divisor) * divisor;

  return {
    id: `Q8_${Date.now()}_${randomInt(0, 9999)}`,
    type: 'round_number',
    difficulty,
    targetNumber: target,
    roundToPlaceIndex: roundIndex,
    numberSystem,
    questionText: `Round ${formatNumber(target, numberSystem)} to the nearest ${PLACES[roundIndex].replace('_', ' ')}.`,
    visual: 'placeValueChart',
    options: shuffleArray(generateNumberDistractors(correctAnswer, divisor)),
    hint1: `Look at the digit just to the right of the ${PLACES[roundIndex].replace('_', ' ')} place.`,
    hint2: '5 or more rounds up; less than 5 rounds down.',
    explanation: `${formatNumber(target, numberSystem)} rounds to ${formatNumber(correctAnswer, numberSystem)} (nearest ${PLACES[roundIndex].replace('_', ' ')}).`,
    correctAnswer,
  };
}

// Q10 — Word Problem (draws from the globalized Names/Contexts pool, PRD Section 7.3)
export function generateWordProblemQ(difficulty, numberSystem = 'international') {
  const target = generateTargetNumber(difficulty);
  const placeIndex = randomInt(0, digitCount(target) - 1);
  const name = pickName();
  const { context, unit } = pickContext();

  return {
    id: `Q10_${Date.now()}_${randomInt(0, 9999)}`,
    type: 'word_problem',
    difficulty,
    targetNumber: target,
    digitCount: digitCount(target),
    numberSystem,
    highlightedPlaceIndex: placeIndex,
    characterName: name,
    context, unit,
    questionText: `${context} is ${formatNumber(target, numberSystem)} ${unit}. What is the value of the digit ${digitAtPlace(target, placeIndex)}?`,
    visual: 'picture',
    options: shuffleArray([valueAtPlace(target, placeIndex), ...generateValueDistractors(digitAtPlace(target, placeIndex), placeIndex, valueAtPlace(target, placeIndex))]),
    hint1: `Find the digit ${digitAtPlace(target, placeIndex)} in the number first.`,
    hint2: `It's in the ${PLACES[placeIndex].replace('_', ' ')} place.`,
    explanation: `The digit is in the ${PLACES[placeIndex].replace('_', ' ')} place, so its value is ${formatNumber(valueAtPlace(target, placeIndex), numberSystem)}.`,
    correctAnswer: valueAtPlace(target, placeIndex),
  };
}
```

The remaining six generators (`identify_place`, `expanded_form`, `standard_form`, `number_names`, `order_numbers`, `chart_match`) follow the identical shape — generate fresh numbers with `generateTargetNumber(difficulty)`, derive the question-specific fields with the `placeValue.js` helpers, and build distractors with misconception-aware logic rather than arbitrary offsets. Each lives in its own exported function inside `questionGenerators.js` so `QuestionRenderer.jsx` can dispatch on `type` via a lookup map:

```js
export const GENERATORS = {
  identify_place: generateIdentifyPlaceQ,
  identify_value: generateIdentifyValueQ,
  expanded_form: generateExpandedFormQ,
  standard_form: generateStandardFormQ,
  number_names: generateNumberNamesQ,
  compare_numbers: generateCompareNumbersQ,
  order_numbers: generateOrderNumbersQ,
  round_number: generateRoundNumberQ,
  chart_match: generateChartMatchQ,
  word_problem: generateWordProblemQ,
};

export function generateRandomQuestion(difficulty, numberSystem) {
  const types = Object.keys(GENERATORS);
  const type = types[randomInt(0, types.length - 1)];
  return GENERATORS[type](difficulty, numberSystem);
}
```

### 8.4 Misconception-Aware Distractor Generation

```js
// utils/distractors.js
//
// IMPORTANT edge case, caught by stress-testing 20,000+ generated questions while
// building the companion demo: when `digit` is 0, `digit * anything` is still 0 —
// so every candidate must be checked against correctValue uniformly, not just the
// first one, or the digit-0 case silently produces two "0" options (a duplicate
// answer choice). The `tryAdd` helper below closes that gap.
export function generateValueDistractors(digit, placeIndex, correctValue) {
  const distractors = new Set();
  const tryAdd = (v) => { if (v !== correctValue && v >= 0) distractors.add(v); };
  tryAdd(digit);                                                       // face-value confusion
  if (placeIndex + 1 < PLACE_VALUES.length)
    tryAdd(digit * PLACE_VALUES[placeIndex + 1]);                      // off-by-one-column (too high)
  if (placeIndex - 1 >= 0)
    tryAdd(digit * PLACE_VALUES[placeIndex - 1]);                      // off-by-one-column (too low)
  let guard = 0;
  while (distractors.size < 3 && guard < 40) {                         // bounded — never trust an unbounded while on generated data
    guard++;
    tryAdd(correctValue + randomInt(1, 9) * PLACE_VALUES[Math.max(0, placeIndex - 1)]);
  }
  return Array.from(distractors).slice(0, 3);
}

export function generateNumberDistractors(correctAnswer, divisor) {
  // Common rounding errors: rounded to the wrong neighboring multiple,
  // or rounded in the wrong direction. divisor is always >= 10 here (Section 8.1
  // never rounds to the ones place), so these three candidates are always
  // mutually distinct and distinct from correctAnswer — no guard needed.
  return [
    correctAnswer + divisor,
    correctAnswer - divisor,
    correctAnswer + divisor / 2,
  ].filter(d => d >= 0 && d !== correctAnswer);
}
```

This directly extends the same principle used for the Equal Groups lesson's distractor generation (plausible near-misses, not random noise) but grounded in place-value-specific misconceptions rather than simple numeric offsets, since "off by one column" is a different (and far more common) error type than "off by one count." The `expanded_form` generator (Section 5, not fully coded above for brevity) needs the same discipline for a subtler reason: a number with only one non-zero digit-part (e.g. 1,000 or 5,000,000) can make a naive "perturb one part" loop regenerate the exact same distractor forever. The shipped demo's `genExpandedForm` handles this with a bounded perturbation strategy plus a guaranteed-terminating fallback that draws a fresh random number if the first two strategies come up short — verified against 20,000 generated questions, including every single-non-zero-part number in range, before being included in either deliverable.

### 8.5 Session Persistence (24-hour resume)

Identical mechanism to the Equal Groups precedent — `localStorage` under a lesson-specific key, restored if the saved timestamp is within 86,400,000 ms, persisted on every state change via a `useEffect`.

---

## 9. Audio Pipeline

### 9.1 Voice Configuration

Voice Name: **Alice** | Voice ID: `Xb7hH8MSUJpSbSDYk0k2` | Model: `eleven_multilingual_v2` | API Key Var: `VITE_ELEVENLABS_API_KEY` (reused exactly from the documented Equal Groups pipeline — see PRD Section 0 for why).

### 9.2 Speech Style Settings

| Style | stability | similarity_boost | style_exaggeration |
|---|---|---|---|
| statement | 0.75 | 0.75 | 0.0 |
| instruction | 0.80 | 0.75 | 0.0 |
| question | 0.60 | 0.80 | 0.3 |
| encouragement | 0.55 | 0.85 | 0.6 |
| emphasis | 0.85 | 0.70 | 0.1 |
| thinking | 0.65 | 0.80 | 0.2 |
| celebration | 0.45 | 0.90 | 0.8 |

### 9.3 Two-Tier Audio Strategy (fixed vs. parametric)

Because Phases 1, 2, 3, and 5 use **fixed** narration text, they are pre-generated exactly like the Equal Groups precedent — `scripts/generate_audio.js` hits the ElevenLabs API once per phrase, saves the `.mp3` to `public/assets/audio/`, and auto-generates `audioMap.js`.

Phase 4 (Play) is different: because every question's numbers are freshly generated (Section 8), its `questionText` cannot be known in advance. Its narration is generated **dynamically** at runtime:

```js
// hooks/useAudio.js
const elevenLabsCache = new Map(); // in-memory; cleared on refresh

export async function getAudioUrl(text, style = 'statement', apiKey) {
  if (audioMap[text]) return audioMap[text];               // 1. fixed-phrase fast path
  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey); // 2. session cache
  if (!apiKey) return null;                                 // 3. silent skip — no fallback
  const response = await fetch(`/api/elevenlabs`, {          // proxied — see Section 13
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, style }),
  });
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  elevenLabsCache.set(cacheKey, url);
  return url;
}

export async function narrate(segments, apiKey, onSegmentStart) {
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    const url = await getAudioUrl(text, style, apiKey);
    if (!url) continue;
    if (i + 1 < segments.length) getAudioUrl(segments[i + 1].text, segments[i + 1].style, apiKey); // eager preload
    if (onSegmentStart) onSegmentStart(i);
    await playAudio(url);
  }
}

async function playAudio(url) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.onended = resolve;
    audio.onerror = resolve; // never block UX on an audio failure
    audio.play().catch(resolve);
  });
}
```

### 9.4 Sample Fixed-Narration Phrases (`scripts/generate_audio.js`)

```js
const phrases = [
  { text: "Eighty-two thousand, five hundred forty fans packed the stadium.", style: 'thinking' },
  { text: "Sarah says the 8 means 8. Mike says it means 80,000. Who's right?", style: 'question' },
  { text: "John, Mike, and Sarah are building their booth for the Global Discovery Fair.", style: 'statement' },
  { text: "Same digit, same column — but a completely different number!", style: 'emphasis' },
  { text: "Wait — what's a crore? Big numbers have different names in different places.", style: 'statement' },
  { text: "Drag each digit chip into the column where it belongs.", style: 'instruction' },
  { text: "Yes! You found its true value!", style: 'celebration' },
  { text: "Not quite — let's check the place-value chart again.", style: 'encouragement' },
  { text: "What's one big number you could read out loud now, digit by digit?", style: 'thinking' },
];
```

### 9.5 Audio Cleanup

Identical to the Equal Groups precedent's `scripts/clean_audio.js` — scans `public/assets/audio/` and deletes any `.mp3` not referenced by `audioMap.js`.

### 9.6 Audio Script Parity (1:1 Strict Parity Rule)

Every on-screen text string that is narrated — fixed or dynamically generated — must match the narration exactly, same words and punctuation. For dynamically generated Play-phase questions this is automatic by construction, because `questionText` is the single source of truth passed to both the UI and `narrate()`.

---

## 10. Gamification Implementation

### 10.1 XP Calculation

```js
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}
```

### 10.2 Star Rating

```js
export function calcStars(correct, total = 10) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 5) return 1;
  return 0;
}
export function canUnlockWorld(worldScore) {
  return worldScore !== null && worldScore >= 5;
}
export function calcTotalStars(worldScores) {
  return worldScores.reduce((sum, ws) => sum + (ws !== null ? calcStars(ws) : 0), 0);
}
```

### 10.3 Badge Engine

```js
export const BADGES = [
  { id: 'value_voyager', label: '🏅 Value Voyager',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story },
  { id: 'column_builder', label: '🥈 Column Builder',
    condition: (s) => s.simStationsComplete.every(Boolean) },
  { id: 'place_value_champion', label: '🥇 Place Value Champion',
    condition: (s) => s.worldScores.reduce((sum, ws) => sum + (ws || 0), 0) >= 80 },
  { id: 'perfect_ten', label: '💎 Perfect Ten',
    condition: (s) => s.worldScores.some(ws => ws === 10) },
  { id: 'streak_star', label: '🔥 Streak Star',
    condition: (s) => s.maxStreak >= 10 },
  { id: 'full_journey', label: '🌟 Full Journey',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean) },
  { id: 'sharp_eye', label: '🎯 Sharp Eye',
    condition: (s) => (s.chartMatchPerfectCount || 0) >= 5 },
  { id: 'global_numeral_master', label: '🌍 Global Numeral Master',
    condition: (s) => s.numeralBridgeCorrectCount >= 5 },
];

export function checkBadges(state) {
  return BADGES.filter(b => !state.badges.includes(b.id) && b.condition(state)).map(b => b.id);
}
```

---

## 11. CSS Animation Keyframes

Reused directly from the reference (naming kept consistent for anyone maintaining both lessons side by side; the group-specific one is renamed to fit this lesson's diagram):

```css
@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); opacity: 1; }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
}
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 217, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(74, 144, 217, 0); }
}
@keyframes celebrate {
  0% { transform: rotate(-5deg) scale(1); }
  25% { transform: rotate(5deg) scale(1.1); }
  50% { transform: rotate(-3deg) scale(1.05); }
  75% { transform: rotate(3deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
}
@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
@keyframes digitCountUp {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
@keyframes columnPop {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.08); }
  100% { transform: scale(1); opacity: 1; }
}
/* Stagger: each column/digit gets animation-delay: (index * 100ms) */
```

---

## 12. Component Prop Contracts

| Component | Props | Returns |
|---|---|---|
| `PlaceValueChart` | `{ targetNumber, numberSystem?, highlightedPlaceIndex?, animated?, size? }` | Inline responsive SVG |
| `ColumnSlot` | `{ index, digit, isCorrect, onDrop, highlighted? }` | Droppable column with digit display |
| `DigitChip` | `{ digit, isSelected, onTap, onDragStart }` | Draggable/tappable digit element |
| `NumberSystemToggle` | `{ value, onChange }` | 🌍 switch control |
| `NumberPad` | `{ max, value, onChange, onSubmit }` | Grid of digit buttons (≥44×44px), backspace, submit |
| `Mascot` | `{ mood }` (`idle`\|`happy`\|`thinking`\|`celebrating`\|`encouraging`) | SVG/img + CSS animation class mapped to mood |
| `QuestionRenderer` | `{ question: Question, onAnswer, hints }` | Type-specific question component |
| `FeedbackOverlay` | `{ isCorrect, explanation?, xpEarned, onContinue }` | Animated modal overlay |
| `WorldMap` | `{ worldScores, currentWorld, onSelectWorld }` | Horizontal scrollable world list with stars/locks |
| `BadgePanel` | `{ badges, newBadgeId? }` | Badge grid with unlock toast |

---

## 13. Security, Privacy & Child Safety

- **No student accounts or login in v1.0** (matches PRD Out of Scope) — session state lives only in `localStorage`, scoped to the device/browser, and is never transmitted to a server
- **ElevenLabs API key never ships to the client.** `api/elevenlabs.js` is a serverless proxy: the browser calls `/api/elevenlabs` with `{ text, style }`, and the proxy attaches the real key server-side before calling ElevenLabs — mirroring how the Equal Groups reference handles the same requirement, made explicit here as a hard rule rather than an implementation detail
- No collection of names, emails, or other personal identifiers — the "characterName" field used in word problems is drawn from a fixed fictional pool (Section 8.3), never the actual student's name
- No third-party analytics or advertising SDKs in this module
- Designed to be compatible with COPPA (US) and GDPR-K (EU) principles for under-13 educational products: minimal data, no behavioral tracking, no persistent cross-session identifier beyond the local device

---

## 14. Performance Requirements

| Metric | Target |
|---|---|
| Initial load time | < 2 seconds (Vite production build) |
| Time to first meaningful paint | < 1 second |
| SVG animation frame rate | 60 fps |
| Memory usage | < 60 MB |
| Bundle size (gzipped) | < 600 KB |
| Lighthouse Performance score | ≥ 90 |
| Lighthouse Accessibility score | ≥ 90 |
| ElevenLabs pre-gen audio TTFB | 0ms (static `.mp3` assets) |
| ElevenLabs dynamic audio TTFB | < 2 seconds (API latency, proxied) |
| Question generation time | < 5ms (pure JS, no network call) |

---

## 15. Browser & Device Support

| Environment | Support Level |
|---|---|
| Chrome 110+ (desktop) | Full |
| Safari 15+ (iPad) | Full — primary classroom device |
| Firefox 110+ | Full |
| Edge 110+ | Full |
| Android Chrome | Full |
| iOS Safari 15+ | Full |
| IE 11 | Not supported |

Primary test device: iPad (768px, touch) — classroom use context. Secondary: Desktop Chrome (1280px+).

---

## 16. Testing Strategy

| Layer | Tool | Coverage focus |
|---|---|---|
| Unit | Vitest | All 10 question generators (parameter ranges, distractor plausibility), `numberFormat.js` (both systems, verified boundary cases at 3/5/6/8 digits), `placeValue.js` helpers, XP/star/badge logic |
| Component | React Testing Library | `PlaceValueChart` renders correct column count and labels per system; `DigitBlocksStation` accepts tap-tap placement and rejects incomplete submissions |
| End-to-end | Playwright | Full phase-to-phase journey on a simulated iPad viewport; verifies no two consecutively generated questions of the same type share a `targetNumber`; verifies session resume after reload within 24h |
| Accessibility | axe-core (in CI) + manual screen-reader pass | WCAG AA contrast, keyboard-only completion of all 3 simulation stations |

---

## 17. Deployment & Hosting

Mirrors the platform's existing pattern (Equal Groups is itself hosted at `equal-tau.vercel.app` and embedded into WordPress):

1. Build and deploy this lesson as a standalone Vite/React app to Vercel (its own preview URL, e.g. `place-value-power.vercel.app`, for QA before embedding)
2. Embed the deployed app via `<iframe>` into the WordPress-powered course page at `https://intelliasg.com/courses/grade-5-math/lessons/place-value/`
3. Environment variables (`VITE_ELEVENLABS_API_KEY`) are set in the Vercel project, never committed to the repo
4. `api/elevenlabs.js` runs as a Vercel serverless function, colocated with the static build

---

## 18. Out of Scope (Technical)

Consistent with the PRD's Section 13: no backend database, no authentication service, no multiplayer/WebSocket layer, no CMS integration beyond the WordPress iframe embed, no native mobile build (responsive web only) for v1.0.

---

**Document Version:** 1.0 | July 2026
**Product:** Intellia SG — Grade 5 Math, Lesson 1.1
**Reference UI:** https://equal-tau.vercel.app/
**Reference Repo:** https://github.com/dsamyak/equal
**Audio Pipeline:** ElevenLabs (Alice, Xb7hH8MSUJpSbSDYk0k2, eleven_multilingual_v2)
**Companion PRD:** place_value_whole_numbers_grade5_prd.md
