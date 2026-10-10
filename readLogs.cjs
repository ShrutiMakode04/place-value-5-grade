const fs = require('fs');

const data = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/cf4699e4-fe22-42a5-b3c9-bfce4a32ebe0/.system_generated/logs/overview.txt', 'utf8');

const matches = [...data.matchAll(/const STATIONS[^;]+;/g)];
if (matches.length > 0) {
   console.log(matches[matches.length - 1][0]);
} else {
   console.log("Not found.");
}
