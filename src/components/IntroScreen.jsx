import { useEffect, useRef, useState } from 'react';
import { playAudio, stopNarration } from '../utils/audio';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A real-world big number puzzle!' },
  { icon: '📖', label: 'Story', desc: 'The Great Number Expedition' },
  { icon: '🧪', label: 'Simulate', desc: 'Place value & number lines' },
  { icon: '🎮', label: 'Practice', desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart, audioEnabled, onToggleAudio }) {
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    if (starting) return;
    setStarting(true);
    stopNarration();
    
    if (audioEnabled) {
      playAudio('intro', "Welcome to Place Value Power! Let's explore the magical world of numbers.", true);
      await new Promise(r => setTimeout(r, 5000));
    } else {
      await new Promise(r => setTimeout(r, 1000));
    }
    onStart();
  };

  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        ✨  · Grade 5 Maths
      </div>

      {/* Title */}
      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>Place Value</span>{' '}
        <span style={{ color: 'var(--coral)' }}>Power</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Grade 5 Whole Numbers
      </p>

      {/* Mascot */}
      <div className="mascot-container">
        <div className="mascot">🤖</div>
        <div className="speech-bubble">
          Let's explore huge numbers! 🌍
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to read, write, compare, and master <strong style={{ color: 'var(--gold)' }}>huge numbers</strong> using place value charts!
      </p>

      {/* Journey map */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      {/* Feature cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label">100 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">📊</div>
          <div className="feature-card-label">Place Value</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
