import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const COLUMNS = [
  { label: 'Millions',       short: 'M',   mag: 1000000,  color: '#7C3AED', glow: 'rgba(124,58,237,0.5)' },
  { label: 'Hundred Thou.', short: '100k', mag: 100000,   color: '#2563EB', glow: 'rgba(37,99,235,0.5)'  },
  { label: 'Ten Thou.',     short: '10k',  mag: 10000,    color: '#0891B2', glow: 'rgba(8,145,178,0.5)'  },
  { label: 'Thousands',     short: '1k',   mag: 1000,     color: '#059669', glow: 'rgba(5,150,105,0.5)'  },
  { label: 'Hundreds',      short: '100',  mag: 100,      color: '#D97706', glow: 'rgba(217,119,6,0.5)'  },
  { label: 'Tens',          short: '10',   mag: 10,       color: '#DC2626', glow: 'rgba(220,38,38,0.5)'  },
  { label: 'Ones',          short: '1',    mag: 1,        color: '#DB2777', glow: 'rgba(219,39,119,0.5)' },
];

function genTarget() {
  // 7-digit number: 1,000,000 – 9,999,999
  return randInt(1000000, 9999999);
}

function numToDigits(num) {
  // Returns array of 7 digits (millions → ones)
  return String(num).padStart(7, '0').split('').map(Number);
}

export default function PlaceValuePalace({ audioEnabled, onNext }) {
  const [target, setTarget] = useState(() => genTarget());
  const [targetDigits, setTargetDigits] = useState([]);
  const [placed, setPlaced] = useState(Array(7).fill(0));
  const [shakeCol, setShakeCol] = useState(null);
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  const [correctCols, setCorrectCols] = useState([]);

  useEffect(() => {
    const t = genTarget();
    setTarget(t);
    setTargetDigits(numToDigits(t));
    setPlaced(Array(7).fill(0));
    setDone(false);
    setCorrectCols([]);
  }, [round]);

  const currentNum = placed.reduce((sum, d, i) => sum + d * COLUMNS[i].mag, 0);

  const handleAdd = (colIdx) => {
    if (done) return;
    const need = targetDigits[colIdx];
    if (placed[colIdx] < need) {
      const np = [...placed];
      np[colIdx]++;
      setPlaced(np);
      sounds.click();
      const newCorrect = [...correctCols];
      if (np[colIdx] === need && !newCorrect.includes(colIdx)) newCorrect.push(colIdx);
      setCorrectCols(newCorrect);
      if (np.every((v, i) => v === targetDigits[i])) {
        setDone(true);
        sounds.correct();
      }
    } else {
      sounds.wrong();
      setShakeCol(colIdx);
      setTimeout(() => setShakeCol(null), 500);
    }
  };

  const handleReset = () => {
    setPlaced(Array(7).fill(0));
    setCorrectCols([]);
  };

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 8 }}>
          🏰 Place Value Palace
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 12 }}>
          Click the place value columns to build the target number
        </p>
        <div style={{
          display: 'inline-block', background: 'linear-gradient(135deg,#7C3AED,#2563EB)',
          padding: '12px 32px', borderRadius: 16, fontSize: '2rem', fontWeight: 900,
          color: '#fff', letterSpacing: 4, boxShadow: '0 6px 24px rgba(124,58,237,0.5)'
        }}>
          {target.toLocaleString()}
        </div>
      </div>

      {/* Column cards */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        {COLUMNS.map((col, i) => {
          const isCorrect = correctCols.includes(i);
          const isShaking = shakeCol === i;
          const digit = placed[i];
          const targetDig = targetDigits[i];
          return (
            <div key={col.label} onClick={() => handleAdd(i)}
              className={isShaking ? 'place-disc' : 'place-disc'}
              style={{
                width: 90, minHeight: 160,
                background: isCorrect
                  ? `linear-gradient(180deg, ${col.color}cc, ${col.color}55)`
                  : 'rgba(255,255,255,0.06)',
                border: `2px solid ${isCorrect ? col.color : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 16,
                cursor: done ? 'default' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '12px 6px',
                transition: 'all 0.2s ease',
                boxShadow: isCorrect ? `0 0 20px ${col.glow}` : '0 4px 12px rgba(0,0,0,0.3)',
                animation: isShaking ? 'shake 0.4s ease' : 'none',
              }}>
              {/* Discs stacked */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', gap: 3, width: '100%', alignItems: 'center', minHeight: 80 }}>
                {Array.from({ length: digit }).map((_, di) => (
                  <div key={di} style={{
                    width: 52, height: 22, borderRadius: 11,
                    background: col.color, border: '2px solid rgba(255,255,255,0.3)',
                    boxShadow: `0 2px 6px ${col.glow}`,
                    animation: 'bounceIn 0.3s ease',
                  }} />
                ))}
              </div>
              {/* Digit display */}
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: isCorrect ? col.color : 'rgba(255,255,255,0.1)',
                border: `2px solid ${col.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', fontWeight: 900, color: '#fff',
                boxShadow: isCorrect ? `0 4px 16px ${col.glow}` : 'none',
                transition: 'all 0.3s',
                margin: '6px 0',
              }}>{digit}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: isCorrect ? '#fff' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
                {col.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: isCorrect ? 'rgba(255,255,255,0.8)' : col.color, marginTop: 4, fontWeight: 700 }}>
                {col.short}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Number display */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 16,
        background: 'rgba(255,255,255,0.07)', borderRadius: 16,
        padding: '12px 28px', border: '1px solid rgba(255,255,255,0.12)',
        marginBottom: 16
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Current:</span>
        <span style={{
          fontSize: '2rem', fontWeight: 900,
          color: done ? 'var(--green)' : currentNum === 0 ? 'var(--text-muted)' : '#fff',
          letterSpacing: 2
        }}>{currentNum.toLocaleString()}</span>
        {done && <span style={{ fontSize: '1.5rem' }}>✅</span>}
      </div>

      {!done && (
        <div style={{ marginBottom: 16 }}>
          <button className="btn btn-outline btn-sm" onClick={handleReset}>🔄 Reset</button>
        </div>
      )}

      {done && (
        <div style={{ marginTop: 16, animation: 'bounceIn 0.5s' }}>
          <div style={{ fontSize: '1.1rem', color: 'var(--green)', fontWeight: 700, marginBottom: 12 }}>
            🎉 Excellent! You built {target.toLocaleString()} perfectly!
          </div>
          <button className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => round < 2 ? setRound(r => r + 1) : onNext()}>
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}
