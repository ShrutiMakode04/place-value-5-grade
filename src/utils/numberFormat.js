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
