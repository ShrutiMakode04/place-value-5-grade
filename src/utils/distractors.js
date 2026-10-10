import { PLACE_VALUES, randomInt } from './placeValue';

export function generateValueDistractors(digit, placeIndex, correctValue) {
  const distractors = new Set();
  const tryAdd = (v) => { if (v !== correctValue && v >= 0) distractors.add(v); };
  
  tryAdd(digit); // face-value confusion
  
  if (placeIndex + 1 < PLACE_VALUES.length) {
    tryAdd(digit * PLACE_VALUES[placeIndex + 1]); // off-by-one-column (too high)
  }
  
  if (placeIndex - 1 >= 0) {
    tryAdd(digit * PLACE_VALUES[placeIndex - 1]); // off-by-one-column (too low)
  }
  
  let guard = 0;
  while (distractors.size < 3 && guard < 40) {
    guard++;
    tryAdd(correctValue + randomInt(1, 9) * PLACE_VALUES[Math.max(0, placeIndex - 1)]);
  }
  
  return Array.from(distractors).slice(0, 3);
}

export function generateNumberDistractors(correctAnswer, divisor) {
  return [
    correctAnswer + divisor,
    correctAnswer - divisor,
    correctAnswer + (divisor / 2) // this could be a float, but we only round to powers of 10 > 10, so it's an int
  ].filter(d => d >= 0 && d !== correctAnswer);
}
