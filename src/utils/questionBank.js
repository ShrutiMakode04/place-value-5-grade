import { numberToWords } from './numberFormatter';

const sgNames = ['John', 'Mike', 'Sarah', 'Priya', 'Wei Ming', 'Ahmed', 'Sofia', 'Liam', 'Aisha', 'Carlos'];
const contexts = ['stadiums', 'cities', 'airports', 'national parks', 'oceans'];
const objects = ['fans', 'people', 'travellers', 'visitors', 'metres'];

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function generateDistractors(correct, count = 3, type = 'number') {
  const distractors = new Set();
  
  if (type === 'number') {
    while (distractors.size < count) {
      let offset = Math.pow(10, Math.floor(Math.random() * 6));
      let d = correct + (Math.random() > 0.5 ? offset : -offset);
      if (d > 0 && d !== correct) distractors.add(d);
    }
  } else if (type === 'string') {
     // For places
     const places = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
     places.forEach(p => p !== correct && distractors.add(p));
     return shuffleArray(Array.from(distractors)).slice(0, count).concat(correct);
  }
  
  return shuffleArray([correct, ...Array.from(distractors).slice(0, count)]);
}

function genNums(diff) {
  let val;
  if (diff === 1) val = Math.floor(Math.random() * 90000) + 10000; // up to 100,000
  else if (diff === 2) val = Math.floor(Math.random() * 900000) + 100000; // up to 1,000,000
  else val = Math.floor(Math.random() * 9000000) + 1000000; // up to 10,000,000
  return val;
}

const places = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];

// Q1: Identify place value of a digit
function genQ1(id, diff) {
  const num = genNums(diff);
  const str = String(num);
  const pos = Math.floor(Math.random() * str.length);
  const digit = str[pos];
  const placeIdx = str.length - 1 - pos;
  const correctPlace = places[placeIdx];
  
  return {
    id, type: 'place_value_digit', difficulty: diff, world: 0,
    questionText: `In the number ${num.toLocaleString()}, what is the place value of the digit ${digit}?`,
    visual: 'placeValueChart',
    hint1: `Look at the place value chart.`,
    hint2: `Count from the right side.`,
    explanation: `The digit ${digit} is in the ${correctPlace} place.`,
    options: shuffleArray(generateDistractors(correctPlace, 3, 'string')),
    correctAnswer: correctPlace,
  };
}

// Q2: Write numeral from words
function genQ2(id, diff) {
  const num = genNums(diff);
  const words = numberToWords(num);
  return {
    id, type: 'words_to_numeral', difficulty: diff, world: 0,
    questionText: `Write in numerals: "${words}"`,
    visual: 'plain',
    hint1: `Read the words carefully. What is the largest place value?`,
    hint2: `Think about how many zeros you need.`,
    explanation: `"${words}" is written as ${num.toLocaleString()} in numerals.`,
    options: generateDistractors(num).map(n => n.toLocaleString()),
    correctAnswer: num.toLocaleString(),
  };
}

// Q3: Write words from numeral
function genQ3(id, diff) {
  const num = genNums(diff);
  const words = numberToWords(num);
  return {
    id, type: 'numeral_to_words', difficulty: diff, world: 0,
    questionText: `How do you write ${num.toLocaleString()} in words?`,
    visual: 'plain',
    hint1: `Look at the commas to group the numbers.`,
    hint2: `Start with the largest place value on the left.`,
    explanation: `${num.toLocaleString()} is written as "${words}".`,
    options: shuffleArray([words, numberToWords(num+1000), numberToWords(num+10), numberToWords(num-1000)]),
    correctAnswer: words,
  };
}

// Q4: Expanded form -> standard form
function genQ4(id, diff) {
  const num = genNums(diff);
  const str = String(num);
  const expanded = str.split('').map((d, i) => parseInt(d) * Math.pow(10, str.length - 1 - i)).filter(n => n > 0).join(' + ');
  return {
    id, type: 'expanded_to_standard', difficulty: diff, world: 0,
    questionText: `${expanded} = ___`,
    visual: 'expandedForm',
    hint1: `Add all the parts together.`,
    hint2: `Look at the highest place value.`,
    explanation: `Adding them all up gives ${num.toLocaleString()}.`,
    options: generateDistractors(num).map(n => n.toLocaleString()),
    correctAnswer: num.toLocaleString(),
  };
}

// Q5: Standard form -> expanded form
function genQ5(id, diff) {
  const num = genNums(diff);
  const str = String(num);
  const expanded = str.split('').map((d, i) => parseInt(d) * Math.pow(10, str.length - 1 - i)).filter(n => n > 0).join(' + ');
  const fakeExpanded1 = str.split('').map((d, i) => parseInt(d) * Math.pow(10, str.length - i)).filter(n => n > 0).join(' + ');
  const fakeExpanded2 = str.split('').map((d, i) => parseInt(d) * Math.pow(10, str.length - 2 - i)).filter(n => n > 0).join(' + ');
  const fakeExpanded3 = str.split('').map((d, i) => parseInt(d) * 1).filter(n => n > 0).join(' + ');
  return {
    id, type: 'standard_to_expanded', difficulty: diff, world: 0,
    questionText: `What is the expanded form of ${num.toLocaleString()}?`,
    visual: 'expandedForm',
    hint1: `Break the number down by its place values.`,
    hint2: `Start from the largest digit on the left.`,
    explanation: `${num.toLocaleString()} is written as ${expanded} in expanded form.`,
    options: shuffleArray([expanded, fakeExpanded1, fakeExpanded2, fakeExpanded3]),
    correctAnswer: expanded,
  };
}

// Q6: Compare two numbers
function genQ6(id, diff) {
  const num1 = genNums(diff);
  const num2 = num1 + (Math.random() > 0.5 ? Math.pow(10, diff) : -Math.pow(10, diff));
  const symbol = num1 > num2 ? '>' : '<';
  return {
    id, type: 'compare_numbers', difficulty: diff, world: 0,
    questionText: `Compare: ${num1.toLocaleString()} ___ ${num2.toLocaleString()}`,
    visual: 'plain',
    hint1: `Compare the highest place value first.`,
    hint2: `If they are the same, look at the next digit to the right.`,
    explanation: `${num1.toLocaleString()} is ${symbol === '>' ? 'greater than' : 'less than'} ${num2.toLocaleString()}.`,
    options: ['>', '<', '='],
    correctAnswer: symbol,
  };
}

// Q7: Order numbers
function genQ7(id, diff) {
  const n1 = genNums(diff);
  const n2 = genNums(diff);
  const n3 = genNums(diff);
  const arr = [n1, n2, n3];
  const sorted = [...arr].sort((a,b) => a-b).map(n => n.toLocaleString()).join(', ');
  const fake1 = [...arr].sort((a,b) => b-a).map(n => n.toLocaleString()).join(', ');
  const fake2 = [arr[1], arr[0], arr[2]].map(n => n.toLocaleString()).join(', ');
  const fake3 = [arr[2], arr[1], arr[0]].map(n => n.toLocaleString()).join(', ');
  return {
    id, type: 'order_numbers', difficulty: diff, world: 0,
    questionText: `Arrange in ASCENDING order (smallest to largest): ${n1.toLocaleString()}, ${n2.toLocaleString()}, ${n3.toLocaleString()}`,
    visual: 'plain',
    hint1: `Find the smallest number first.`,
    hint2: `Compare the highest place value digits.`,
    explanation: `The correct order from smallest to largest is ${sorted}.`,
    options: shuffleArray([sorted, fake1, fake2, fake3]),
    correctAnswer: sorted,
  };
}

// Q8: Round numbers
function genQ8(id, diff) {
  const num = genNums(diff);
  const place = diff === 1 ? 1000 : diff === 2 ? 100000 : 1000000;
  const placeName = diff === 1 ? "thousand" : diff === 2 ? "hundred thousand" : "million";
  const rounded = Math.round(num / place) * place;
  return {
    id, type: 'round_number', difficulty: diff, world: 0,
    questionText: `Round ${num.toLocaleString()} to the nearest ${placeName}.`,
    visual: 'numberLine',
    hint1: `Look at the digit right after the ${placeName} place.`,
    hint2: `If it is 5 or more, round up. If it is 4 or less, round down.`,
    explanation: `${num.toLocaleString()} rounded to the nearest ${placeName} is ${rounded.toLocaleString()}.`,
    options: generateDistractors(rounded).map(n => n.toLocaleString()),
    correctAnswer: rounded.toLocaleString(),
  };
}

// Q9: Number line MCQ
function genQ9(id, diff) {
  const num = genNums(diff);
  const rounded = Math.round(num / 100000) * 100000;
  return {
    id, type: 'number_line_mcq', difficulty: diff, world: 0,
    questionText: `Which point on the number line best shows ${rounded.toLocaleString()}?`,
    visual: 'numberLine',
    hint1: `Look at the millions and hundred thousands.`,
    hint2: `Find the marks that it should be between.`,
    explanation: `The point represents ${rounded.toLocaleString()}.`,
    options: generateDistractors(rounded).map(n => n.toLocaleString()),
    correctAnswer: rounded.toLocaleString(),
  };
}

// Q10: Word problem
function genQ10(id, diff) {
  const num1 = genNums(diff);
  const num2 = num1 + 36000;
  const name = pick(sgNames);
  return {
    id, type: 'word_problem', difficulty: diff, world: 0,
    questionText: `${name} found that City A has ${num1.toLocaleString()} people, while City B has ${num2.toLocaleString()} people. Which city is larger, and by how much?`,
    visual: 'plain',
    hint1: `Compare the millions and hundred thousands digits first.`,
    hint2: `City B is larger. Subtract City A from City B to find the difference.`,
    explanation: `City B (${num2.toLocaleString()}) is larger than City A (${num1.toLocaleString()}) by 36,000.`,
    options: shuffleArray([`City B by 36,000`, `City A by 36,000`, `City B by 3,600`, `They are equal`]),
    correctAnswer: `City B by 36,000`,
  };
}

const generators = [genQ1, genQ2, genQ3, genQ4, genQ5, genQ6, genQ7, genQ8, genQ9, genQ10];

const diffDist = {
  q1:  [1,1,1,1,2,2,2,3,3,3],
  q2:  [1,1,1,2,2,2,2,3,3,3],
  q3:  [1,1,1,2,2,2,2,3,3,3],
  q4:  [1,1,1,1,2,2,2,3,3,3],
  q5:  [1,1,1,2,2,2,2,3,3,3],
  q6:  [1,1,1,1,2,2,2,3,3,3],
  q7:  [1,1,1,2,2,2,2,3,3,3],
  q8:  [1,1,1,2,2,2,2,3,3,3],
  q9:  [1,1,1,1,2,2,2,3,3,3],
  q10: [1,1,2,2,2,2,3,3,3,3],
};

export function generateSessionQuestions() {
  const bank = [];
  let qid = 1;
  const qKeys = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10'];

  generators.forEach((gen, gi) => {
    const diffs = diffDist[qKeys[gi]];
    diffs.forEach(diff => {
      bank.push(gen(`Q${gi + 1}_${String(qid).padStart(3, '0')}`, diff));
      qid++;
    });
  });

  const selected = shuffleArray(bank);
  selected.forEach((q, index) => {
    q.world = Math.floor(index / 10);
  });

  return selected;
}

export { sgNames };
