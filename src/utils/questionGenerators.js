import { generateTargetNumber, digitAtPlace, valueAtPlace, digitCount, PLACES, PLACE_VALUES, randomInt } from './placeValue';
import { formatNumber } from './numberFormat';
import { generateValueDistractors, generateNumberDistractors } from './distractors';
import { pickName, pickContext } from './wordProblemPools';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateIdentifyPlaceQ(difficulty, numberSystem = 'international') {
  const target = generateTargetNumber(difficulty);
  const placeIndex = randomInt(0, digitCount(target) - 1);
  const digit = digitAtPlace(target, placeIndex);
  
  const options = shuffleArray([
    PLACES[placeIndex],
    PLACES[Math.max(0, placeIndex - 1)],
    PLACES[Math.min(PLACES.length - 1, placeIndex + 1)],
    PLACES[Math.max(0, placeIndex - 2)]
  ]);

  return {
    id: `Q1_${Date.now()}_${randomInt(0, 9999)}`,
    type: 'identify_place',
    difficulty,
    targetNumber: target,
    digitCount: digitCount(target),
    numberSystem,
    highlightedPlaceIndex: placeIndex,
    questionText: `In ${formatNumber(target, numberSystem)}, what place is the digit ${digit} in?`,
    visual: 'placeValueChart',
    options: [...new Set(options)].slice(0, 4).map(o => o.replace('_', ' ')), 
    hint1: `Look at the position of the digit ${digit}.`,
    hint2: `Count the columns from the right.`,
    explanation: `The digit ${digit} is in the ${PLACES[placeIndex].replace('_', ' ')} place.`,
    correctAnswer: PLACES[placeIndex].replace('_', ' '),
  };
}

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
    options: options.map(o => formatNumber(o, numberSystem)),
    hint1: `Look at which column the digit ${digit} sits in.`,
    hint2: `The digit is in the ${PLACES[placeIndex].replace('_', ' ')} place.`,
    explanation: `The digit ${digit} is in the ${PLACES[placeIndex].replace('_', ' ')} place, so its value is ${formatNumber(correctValue, numberSystem)}.`,
    correctAnswer: formatNumber(correctValue, numberSystem),
  };
}

export function generateExpandedFormQ(difficulty, numberSystem = 'international') {
  const target = generateTargetNumber(difficulty);
  const parts = [];
  for (let i = digitCount(target) - 1; i >= 0; i--) {
    const v = valueAtPlace(target, i);
    if (v > 0) parts.push(formatNumber(v, numberSystem));
  }
  const correctAnswer = parts.join(' + ');

  const distractors = new Set();
  const tryAdd = (str) => { if (str !== correctAnswer) distractors.add(str); };
  
  const largestVal = valueAtPlace(target, digitCount(target) - 1);
  const wrongLargest = formatNumber(largestVal / 10, numberSystem);
  tryAdd([wrongLargest, ...parts.slice(1)].join(' + '));
  
  if (parts.length > 1) {
      const secondVal = valueAtPlace(target, digitCount(target) - 2);
      const wrongSecond = formatNumber(secondVal * 10, numberSystem);
      tryAdd([parts[0], wrongSecond, ...parts.slice(2)].join(' + '));
  }
  
  if (parts.length > 2) {
      tryAdd([...parts.slice(0, 1), ...parts.slice(2)].join(' + '));
  }
  
  while (distractors.size < 3) {
      tryAdd(correctAnswer + ' + 0');
      tryAdd(correctAnswer.replace('+', '-'));
  }

  const options = shuffleArray([correctAnswer, ...Array.from(distractors).slice(0, 3)]);

  return {
    id: `Q3_${Date.now()}_${randomInt(0, 9999)}`,
    type: 'expanded_form',
    difficulty,
    targetNumber: target,
    numberSystem,
    questionText: `Which is the correct expanded form of ${formatNumber(target, numberSystem)}?`,
    visual: 'none',
    options,
    hint1: `Break down the number into the value of each digit.`,
    hint2: `Start from the largest place value on the left.`,
    explanation: `${formatNumber(target, numberSystem)} is equal to ${correctAnswer}.`,
    correctAnswer,
  };
}

export function generateStandardFormQ(difficulty, numberSystem = 'international') {
  const q = generateExpandedFormQ(difficulty, numberSystem);
  return {
    ...q,
    id: `Q4_${Date.now()}_${randomInt(0, 9999)}`,
    type: 'standard_form',
    questionText: `What number is ${q.correctAnswer}?`,
    options: shuffleArray([
        formatNumber(q.targetNumber, numberSystem), 
        formatNumber(q.targetNumber + 100, numberSystem),
        formatNumber(q.targetNumber * 10, numberSystem),
        formatNumber(Math.floor(q.targetNumber / 10), numberSystem)
    ]),
    hint1: `Add the numbers together, lining them up by place value.`,
    hint2: `Watch out for any missing place values (which would be 0).`,
    explanation: `${q.correctAnswer} is equal to ${formatNumber(q.targetNumber, numberSystem)}.`,
    correctAnswer: formatNumber(q.targetNumber, numberSystem),
  };
}

export function generateCompareNumbersQ(difficulty, numberSystem = 'international') {
  const a = generateTargetNumber(difficulty);
  const closeEnough = Math.random() < 0.6;
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

export function generateOrderNumbersQ(difficulty, numberSystem = 'international') {
    let numbers = [];
    while(numbers.length < 3) {
       let n = generateTargetNumber(difficulty);
       if(!numbers.includes(n)) numbers.push(n);
    }
    numbers.sort((a,b) => a-b);
    const correctAnswer = numbers.map(n => formatNumber(n, numberSystem)).join(' ; ');
    
    const distractors = [
        [numbers[2], numbers[1], numbers[0]].map(n => formatNumber(n, numberSystem)).join(' ; '),
        [numbers[1], numbers[0], numbers[2]].map(n => formatNumber(n, numberSystem)).join(' ; '),
        [numbers[0], numbers[2], numbers[1]].map(n => formatNumber(n, numberSystem)).join(' ; ')
    ];

    return {
        id: `Q7_${Date.now()}_${randomInt(0, 9999)}`,
        type: 'order_numbers',
        difficulty,
        targetNumber: numbers[0],
        compareSet: numbers,
        numberSystem,
        questionText: `Order these numbers from smallest to largest.`,
        visual: 'none',
        options: shuffleArray([correctAnswer, ...distractors]),
        hint1: 'Look at the highest place value first.',
        hint2: 'Find the smallest number, then the next smallest.',
        explanation: `The correct order from smallest to largest is ${correctAnswer}.`,
        correctAnswer
    }
}

export function generateRoundNumberQ(difficulty, numberSystem = 'international') {
  const target = generateTargetNumber(difficulty);
  const maxPlace = digitCount(target) - 1;
  const roundIndex = randomInt(1, maxPlace); // never round to "ones"
  const divisor = PLACE_VALUES[roundIndex];
  const correctAnswer = Math.round(target / divisor) * divisor;

  const distractors = generateNumberDistractors(correctAnswer, divisor);
  let opts = [correctAnswer, ...distractors];
  while(opts.length < 4) {
      let extra = correctAnswer + divisor * (Math.floor(Math.random() * 4) + 2) * (Math.random() > 0.5 ? 1 : -1);
      if(extra >= 0 && !opts.includes(extra)) opts.push(extra);
  }
  const options = shuffleArray(opts.slice(0, 4).map(n => formatNumber(n, numberSystem)));

  return {
    id: `Q8_${Date.now()}_${randomInt(0, 9999)}`,
    type: 'round_number',
    difficulty,
    targetNumber: target,
    roundToPlaceIndex: roundIndex,
    numberSystem,
    questionText: `Round ${formatNumber(target, numberSystem)} to the nearest ${PLACES[roundIndex].replace('_', ' ')}.`,
    visual: 'placeValueChart',
    options: options,
    hint1: `Look at the digit just to the right of the ${PLACES[roundIndex].replace('_', ' ')} place.`,
    hint2: '5 or more rounds up; less than 5 rounds down.',
    explanation: `${formatNumber(target, numberSystem)} rounds to ${formatNumber(correctAnswer, numberSystem)} (nearest ${PLACES[roundIndex].replace('_', ' ')}).`,
    correctAnswer: formatNumber(correctAnswer, numberSystem),
  };
}

export function generateChartMatchQ(difficulty, numberSystem = 'international') {
  const target = generateTargetNumber(difficulty);
  const options = ['Chart A', 'Chart B', 'Chart C', 'Chart D'];
  const correctIdx = Math.floor(Math.random() * 4);
  const correctAnswer = options[correctIdx];

  return {
    id: `Q9_${Date.now()}_${randomInt(0, 9999)}`,
    type: 'chart_match',
    difficulty,
    targetNumber: target,
    numberSystem,
    questionText: `Which place-value chart correctly shows ${formatNumber(target, numberSystem)}?`,
    visual: 'none', // handled by renderer
    options,
    hint1: `Check each digit's column carefully.`,
    hint2: `Make sure the digits are in the correct place value columns!`,
    explanation: `${correctAnswer} shows ${formatNumber(target, numberSystem)} correctly.`,
    correctAnswer,
    correctIdx 
  };
}

export function generateWordProblemQ(difficulty, numberSystem = 'international') {
  const target = generateTargetNumber(difficulty);
  const placeIndex = randomInt(0, digitCount(target) - 1);
  const name = pickName();
  const { context, unit } = pickContext();
  const digit = digitAtPlace(target, placeIndex);
  const cVal = valueAtPlace(target, placeIndex);

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
    questionText: `The ${context} is ${formatNumber(target, numberSystem)} ${unit}. What is the value of the digit ${digit}?`,
    visual: 'picture',
    options: shuffleArray([cVal, ...generateValueDistractors(digit, placeIndex, cVal)]).map(o => formatNumber(o, numberSystem)),
    hint1: `Find the digit ${digit} in the number first.`,
    hint2: `It's in the ${PLACES[placeIndex].replace('_', ' ')} place.`,
    explanation: `The digit is in the ${PLACES[placeIndex].replace('_', ' ')} place, so its value is ${formatNumber(cVal, numberSystem)}.`,
    correctAnswer: formatNumber(cVal, numberSystem),
  };
}

export const GENERATORS = {
  identify_place: generateIdentifyPlaceQ,
  identify_value: generateIdentifyValueQ,
  expanded_form: generateExpandedFormQ,
  standard_form: generateStandardFormQ,
  compare_numbers: generateCompareNumbersQ,
  order_numbers: generateOrderNumbersQ,
  round_number: generateRoundNumberQ,
  chart_match: generateChartMatchQ,
  word_problem: generateWordProblemQ,
};

export function generateRandomQuestion(difficulty, numberSystem = 'international') {
  const types = Object.keys(GENERATORS);
  const type = types[randomInt(0, types.length - 1)];
  return GENERATORS[type](difficulty, numberSystem);
}
