import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
const voiceId = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const audioDir = path.join(__dirname, '../public/assets/audio');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

const getElevenLabsSettings = (style) => {
    switch (style) {
        case 'celebration': return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
        case 'encouragement': return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
        case 'question': return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
        case 'emphasis': return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
        case 'thinking': return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
        default: return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
    }
};

const phrases = [
    // Intro
    { text: "Welcome to Equal Groups!", style: 'encouragement' },
    { text: "Today, we are going to learn about equal groups for multiplication and division.", style: 'statement' },
    { text: "What happens when we put the same number of things into every group? Can we find how many there are altogether?", style: 'question' },
    { text: "Are you ready to explore equal groups and solve some fun challenges? Let us get started on our learning journey!", style: 'encouragement' },
    // Wonder
    { text: "Mia has 12 strawberries and 3 plates. Can she put the same number on every plate?", style: 'question' },
    { text: "When every group gets the same amount, we call them equal groups!", style: 'statement' },
    { text: "There are 4 tables. Each table has 3 bowls. How many bowls altogether?", style: 'question' },
    { text: "Equal groups help us count lots of things quickly!", style: 'statement' },
    { text: "If every bag has 5 oranges, and there are 3 bags, how many oranges are there?", style: 'question' },
    { text: "Putting the same number in every bag — that is equal groups!", style: 'statement' },
    { text: "Can you share 10 stickers fairly among 5 friends?", style: 'question' },
    { text: "Fair sharing means making equal groups — everyone gets the same!", style: 'statement' },
    { text: "3 groups of 4 — is that the same as 4 + 4 + 4?", style: 'question' },
    { text: "Equal groups and repeated addition are best friends!", style: 'statement' },
    // Story
    { text: "Mia has twelve strawberries. She wants to put the same number on every plate.", style: 'statement' },
    { text: "Can she do it? How many strawberries will go on each plate?", style: 'question' },
    { text: "Let us find out what equal groups really means!", style: 'encouragement' },
    { text: "Wei Ming visits the hawker centre with his family.", style: 'statement' },
    { text: "There are three tables. Each table has four bowls of noodles.", style: 'statement' },
    { text: "Every table gets the same number of bowls. That is what we call equal groups!", style: 'emphasis' },
    { text: "Three groups of four. Count with me: four, eight, twelve. Altogether equals twelve!", style: 'statement' },
    { text: "When every group has the same number, we call them equal groups.", style: 'emphasis' },
    { text: "Now Wei Ming's family shares ten apples equally into five bags.", style: 'statement' },
    { text: "Each bag gets two apples. Fair sharing means equal groups!", style: 'emphasis' },
    { text: "Equal groups help us multiply. Three groups of four means four plus four plus four.", style: 'statement' },
    { text: "That is called repeated addition!", style: 'emphasis' },
    { text: "And when we share equally, that is the start of division!", style: 'statement' },
    { text: "Now you know what equal groups are!", style: 'celebration' },
    { text: "Let us practice making equal groups ourselves!", style: 'encouragement' },
    // Simulate
    { text: "Drag the objects into the circles. Put the same number in each group!", style: 'instruction' },
    { text: "Make sure every group has the same number. Can you do it?", style: 'question' },
    { text: "Look at these arrangements. Which ones show equal groups? Tap to choose!", style: 'instruction' },
    { text: "Now fill in the missing number. Use the number pad!", style: 'question' },
    // Reflect
    { text: "What did you learn about equal groups?", style: 'question' },
    { text: "How confident do you feel about equal groups?", style: 'question' },
];

async function generate() {
    const mapData = {};

    for (let i = 0; i < phrases.length; i++) {
        const { text, style } = phrases[i];
        const safeName = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
        const filename = `audio_${safeName}_${i}.mp3`;
        const filepath = path.join(audioDir, filename);

        mapData[text] = `/assets/audio/${filename}`;

        if (fs.existsSync(filepath)) {
            console.log(`Skipping (already exists): ${filename}`);
            continue;
        }

        console.log(`Generating: ${filename}`);

        const settings = getElevenLabsSettings(style);

        try {
            const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: settings
                })
            });

            if (!res.ok) {
                console.error(`Failed to generate ${filename}: ${res.statusText}`);
                const textErr = await res.text();
                console.error(textErr);
                continue;
            }

            const buffer = await res.arrayBuffer();
            fs.writeFileSync(filepath, Buffer.from(buffer));
            console.log(`Saved: ${filename}`);
        } catch (err) {
            console.error(`Error with ${filename}:`, err.message);
        }

        await new Promise(r => setTimeout(r, 500));
    }

    const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
    fs.writeFileSync(mapFile, `export const audioMap = ${JSON.stringify(mapData, null, 2)};\n`);
    console.log('Done generating! Map saved to src/utils/audioMap.js');
}

generate();
