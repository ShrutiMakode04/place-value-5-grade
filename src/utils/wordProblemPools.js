const NAMES = ['John', 'Mike', 'Sarah', 'Emma', 'Alex', 'Zara', 'Leo', 'Maya', 'Noah', 'Ava'];

const CONTEXTS = [
  { context: "the population of their city", unit: "people" },
  { context: "the distance to a landmark", unit: "km" },
  { context: "a concert attendance", unit: "fans" },
  { context: "a charity fundraiser step-count", unit: "steps" },
  { context: "books read by their school", unit: "books" },
  { context: "tickets sold for a big event", unit: "tickets" },
  { context: "a viral video", unit: "views" },
  { context: "trees planted worldwide", unit: "trees" },
];

export function pickName() {
  return NAMES[Math.floor(Math.random() * NAMES.length)];
}

export function pickContext() {
  return CONTEXTS[Math.floor(Math.random() * CONTEXTS.length)];
}
