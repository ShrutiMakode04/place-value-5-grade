import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SYMBOLS = {
  1000000: { emoji: '💠', label: '1 Million' },
  100000: { emoji: '⚪', label: '100 Thousand' },
  10000: { emoji: '🌟', label: '10 Thousand' },
};

function generateRound() {
  const m = randInt(1, 5); // 1-5 Millions
  const ht = randInt(1, 5); // 1-5 Hundred Thousands
  const tt = randInt(1, 4); // 1-4 Ten Thousands
  
  const target = (m * 1000000) + (ht * 100000) + (tt * 10000);
  
  const correctOption = { m, ht, tt, correct: true };
  
  // Option 1: Swap m and ht. If m === ht, tweak ht so it's different.
  let w1m = ht;
  let w1ht = m;
  if (w1m === m && w1ht === ht) {
    w1ht = (ht % 5) + 1;
  }
  const wrong1 = { m: w1m, ht: w1ht, tt, correct: false };

  // Option 2: Change m and ht differently
  let w2m = (m % 5) + 1; // Guarantees w2m != m
  let w2ht = ht === 1 ? 2 : ht - 1;
  // Ensure w2 is not accidentally the same as w1
  if (w2m === w1m && w2ht === w1ht) {
    w2m = (w2m % 5) + 1;
  }
  const wrong2 = { m: w2m, ht: w2ht, tt, correct: false };
  
  return {
    target,
    options: shuffleArray([correctOption, wrong1, wrong2])
  };
}

export default function SymbolDecoder({ audioEnabled, onNext }) {
  const [roundData, setRoundData] = useState(() => generateRound());
  const [round, setRound] = useState(1);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleOptionClick = (opt) => {
    if (answered) return;
    setAnswered(true);
    if (opt.correct) {
      sounds.correct();
      if (audioEnabled) import('../../utils/audio').then(m => m.speak("Correct", true));
      setFeedback('correct');
      setTimeout(() => {
        if (round < 3) {
          setRound(r => r + 1);
          setRoundData(generateRound());
          setAnswered(false);
          setFeedback(null);
        } else {
          onNext();
        }
      }, 1500);
    } else {
      sounds.wrong();
      if (audioEnabled) import('../../utils/audio').then(m => m.speak("Wrong", true));
      setFeedback('wrong');
      setTimeout(() => {
        setAnswered(false);
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="symbol-decoder" style={{ textAlign: 'center', width: '100%', padding: '0 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>
          🌟 Ancient Symbol Decoder
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 12 }}>
          Find the ancient tablet that matches the number!
        </p>
        <div style={{ 
          display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap'
        }}>
          {Object.entries(SYMBOLS).reverse().map(([val, s]) => (
            <div key={val} style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: 8 }}>
              <span style={{ fontSize: '1.5rem', marginRight: 8 }}>{s.emoji}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>= {s.label}</span>
            </div>
          ))}
        </div>
        
        <div style={{
          display: 'inline-block', background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
          padding: '16px 40px', borderRadius: 16, fontSize: '3rem', fontWeight: 900,
          color: '#fff', letterSpacing: 2, boxShadow: '0 8px 32px rgba(30,60,114,0.5)',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          {roundData.target.toLocaleString()}
        </div>
        <div style={{ marginTop: 12, color: 'var(--text-secondary)', fontWeight: 'bold' }}>
          Round {round} / 3
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        {roundData.options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleOptionClick(opt)}
            disabled={answered}
            style={{
              flex: '1 1 200px', maxWidth: 300, minHeight: 150,
              background: 'rgba(20,20,30,0.8)', padding: '16px', borderRadius: 16,
              border: `2px solid ${answered && opt.correct ? '#4caf50' : answered && !opt.correct && feedback === 'wrong' ? '#f44336' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: answered && opt.correct ? '0 0 20px rgba(76,175,80,0.4)' : 'none',
              cursor: answered ? 'default' : 'pointer', transition: 'all 0.2s ease',
              display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'stretch', justifyContent: 'center'
            }}
            className="hover-lift"
          >
            {opt.m > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '30px', textAlign: 'right', color: 'white' }}>{opt.m}</span>
                <span style={{ margin: '0 8px', color: 'var(--text-secondary)' }}>×</span>
                <span style={{ fontSize: '1.5rem', marginRight: 8 }}>{SYMBOLS[1000000].emoji}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Millions</span>
              </div>
            )}
            {opt.ht > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '30px', textAlign: 'right', color: 'white' }}>{opt.ht}</span>
                <span style={{ margin: '0 8px', color: 'var(--text-secondary)' }}>×</span>
                <span style={{ fontSize: '1.5rem', marginRight: 8 }}>{SYMBOLS[100000].emoji}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hundred Thou.</span>
              </div>
            )}
            {opt.tt > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 8 }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '30px', textAlign: 'right', color: 'white' }}>{opt.tt}</span>
                <span style={{ margin: '0 8px', color: 'var(--text-secondary)' }}>×</span>
                <span style={{ fontSize: '1.5rem', marginRight: 8 }}>{SYMBOLS[10000].emoji}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ten Thou.</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
