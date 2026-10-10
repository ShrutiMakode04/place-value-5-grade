import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, '../public/assets/audio');

if (fs.existsSync(audioDir)) {
  const files = fs.readdirSync(audioDir);
  files.forEach(f => {
    fs.unlinkSync(path.join(audioDir, f));
    console.log(`Deleted: ${f}`);
  });
  console.log(`Cleaned ${files.length} audio files.`);
} else {
  console.log('No audio directory found.');
}

// Reset audioMap
const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
fs.writeFileSync(mapFile, 'export const audioMap = {};\n');
console.log('Reset audioMap.js');
