import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with Alice's Voice ID
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';

// We'll read the .env file manually in case dotenv isn't installed
const envPath = path.join(__dirname, '../.env');
let API_KEY = process.env.VITE_ELEVENLABS_API_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/VITE_ELEVENLABS_API_KEY=(.*)/);
  if (match) API_KEY = match[1].trim();
}

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.log("VITE_ELEVENLABS_API_KEY is not set. Generating audio skipped.");
  process.exit(0);
}

const AUDIO_DIR = path.join(__dirname, '../public/audio/narration');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

const TEXTS = {
  'intro': "Welcome to Place Value Power! Let's explore the magical world of numbers.",
  'wonder': "82,540 fans packed the stadium for the final! Sarah says the '8' means 8. Mike says it means 80,000. Who's right — and why does it matter? Let's find out what a digit is REALLY worth!",
  'wonder_discover': "Get ready to explore the value of every digit! Let's master reading, writing, and comparing big numbers!",
  'story_0': "Look at this massive stadium! There are 82,540 screaming fans cheering for their team. But how do we know exactly how big that number is? Which digit tells us the most about the size of the crowd?",
  'story_1': "A place-value chart slides in, lighting up column by column. The '2' in the hundred-thousands place represents 200,000! Every digit has a special place.",
  'story_2': "Sarah's booth: the moon is 384,400 kilometers away. Which is bigger — the population digit or the distance digit in the same column?",
  'story_3': "Numbers can be broken apart into glowing, magical pieces! Expanded form shows the exact value of each and every digit clearly.",
  'story_4': "Mike's booth is about India: 'This beautiful futuristic city has 1.3 crore people!' Wait — what is a crore?",
  'sim_0': "Station A: Digit Blocks",
  'sim_1': "Station B: Chart Match",
  'sim_2': "Station C: The Missing Piece",
  'sim_3': "Station D: Token Drop",
  'sim_4': "Station E: Pattern Machine",
  'sim_inst_0': "Drag the expanded form cards into the Fusion Core to build the target number!",
  'sim_inst_1': "Tap the empty boxes to build the number in the place value chart!",
  'sim_inst_2': "Read the sentence and drop the correct piece into the box!",
  'sim_inst_3': "Drag the glowing tokens into the correct columns to build the target number!",
  'sim_inst_4': "Drag the correct Operation Gear into the machine to transform the number!",
  'correct': "Correct!",
  'wrong': "Wrong.",
  'play': "Let's play and test your knowledge! Select the correct answer.",
  'reflect': "Think about what we learned today! Numbers are like a secret code. Depending on where a digit is placed, its value changes completely! Why do you think place value is important in our daily lives?"
};

async function generateAudio(id, text) {
  const filePath = path.join(AUDIO_DIR, `${id}.mp3`);
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${id}, already exists.`);
    return;
  }

  const data = JSON.stringify({
    text: text,
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.5, similarity_boost: 0.75 }
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${VOICE_ID}`,
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errBody = '';
        res.on('data', chunk => errBody += chunk);
        res.on('end', () => {
          console.error(`Failed to generate ${id}: HTTP ${res.statusCode} - ${errBody}`);
          resolve();
        });
        return;
      }
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Generated ${id}.mp3`);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Error generating ${id}: ${e.message}`);
      resolve();
    });

    req.write(data);
    req.end();
  });
}

async function run() {
  for (const [id, text] of Object.entries(TEXTS)) {
    await generateAudio(id, text);
    await new Promise(r => setTimeout(r, 500));
  }
}

run();
