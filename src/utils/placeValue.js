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

export function correctDigitAt(number, placeIndexFromLeft) {
    const s = String(number);
    return parseInt(s[placeIndexFromLeft], 10);
}
