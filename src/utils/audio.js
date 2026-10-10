import { Howl } from 'howler';

let currentAudio = null;
let currentUtterance = null;

export const playAudio = (id, text, audioEnabled) => {
  if (!audioEnabled) return;
  stopNarration();
  
  const mp3Path = `/audio/narration/${id}.mp3`;
  
  // Try to play MP3
  currentAudio = new Audio(mp3Path);
  currentAudio.play().catch((err) => {
    console.log("MP3 failed to load or play", err);
  });
};

export const stopNarration = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

// Simple Web Audio API Synthesizer
let audioCtx = null;
const initAudio = () => {
  if (!audioCtx && window.AudioContext) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
};

const playTone = (freq, type, duration, vol=0.1) => {
  initAudio();
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const sounds = {
  correct: () => {
    playTone(500, 'sine', 0.1, 0.2);
    setTimeout(() => playTone(800, 'sine', 0.3, 0.2), 100);
  },
  wrong: () => {
    playTone(300, 'sawtooth', 0.2, 0.15);
    setTimeout(() => playTone(250, 'sawtooth', 0.3, 0.15), 200);
  },
  click: () => playTone(800, 'sine', 0.05, 0.1),
  badge: () => playTone(600, 'sine', 0.1, 0.2),
};
