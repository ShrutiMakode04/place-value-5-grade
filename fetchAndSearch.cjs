const fs = require('fs');

const data = fs.readFileSync('decimal.js', 'utf8');
const matches = [...data.matchAll(/.{0,50}title:\s*['"]Station.{0,100}/gi)];

if (matches.length > 0) {
  console.log("Found matches:");
  matches.forEach(m => console.log(m[0]));
} else {
  // Let's just search for Station B or Station 2
  const m2 = [...data.matchAll(/.{0,100}Station 2.{0,100}/gi)];
  const m3 = [...data.matchAll(/.{0,100}Station B.{0,100}/gi)];
  
  if (m2.length > 0 || m3.length > 0) {
      console.log("Station 2/B matches:");
      m2.forEach(m => console.log(m[0]));
      m3.forEach(m => console.log(m[0]));
  } else {
      // Find all components in STATIONS
      const m4 = [...data.matchAll(/.{0,50}icon:.{0,100}/gi)];
      m4.slice(0,20).forEach(m => console.log(m[0]));
  }
}
