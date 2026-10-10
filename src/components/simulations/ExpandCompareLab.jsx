import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export default function ExpandCompareLab({ audioEnabled, onComplete }) {
  const [round, setRound] = useState(0);
  const [mode, setMode] = useState('expand'); // expand, compare
  const [target, setTarget] = useState(0);
  const [parts, setParts] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const modes = ['expand', 'compare', 'expand'];
    const currentMode = modes[round];
    setMode(currentMode);

    if (currentMode === 'expand') {
      const mag = round === 0 ? 100000 : 1000000;
      const t = randInt(1, 9) * mag + randInt(1, 9) * (mag/10) + randInt(1, 9) * (mag/100);
      setTarget(t);
      
      const trueParts = [
        Math.floor(t / mag) * mag,
        Math.floor((t % mag) / (mag/10)) * (mag/10),
        Math.floor((t % (mag/10)) / (mag/100)) * (mag/100)
      ].filter(x => x > 0);
      
      setParts(trueParts);
      
      const distractors = [trueParts[0] + (mag/10), trueParts[1] * 10];
      setOptions([...trueParts, ...distractors].sort(() => Math.random() - 0.5));
      setSelectedParts([]);
    } else {
      const val1 = randInt(10, 99) * 100000;
      const val2 = val1 + (randInt(1, 9) * 10000);
      setTarget({ val1, val2, symbol: '<' });
      setOptions(['>', '<', '=']);
    }
    setDone(false);
  }, [round]);

  const handleSelectExpand = (val) => {
    if (done) return;
    if (selectedParts.includes(val)) return;
    const newSel = [...selectedParts, val];
    setSelectedParts(newSel);
    sounds.click();

    if (newSel.length === parts.length) {
      const sum = newSel.reduce((a, b) => a + b, 0);
      if (sum === target) {
        setDone(true);
        sounds.correct();
      } else {
        sounds.wrong();
        setTimeout(() => setSelectedParts([]), 500);
      }
    }
  };

  const handleCompare = (symbol) => {
    if (done) return;
    if (symbol === target.symbol) {
      setDone(true);
      sounds.correct();
    } else {
      sounds.wrong();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🧪 Expand & Compare Lab</h2></div>

      {mode === 'expand' && (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
            Build <strong style={{ color: 'var(--gold)' }}>{target.toLocaleString()}</strong> in expanded form:
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {selectedParts.map((p, i) => (
              <React.Fragment key={i}>
                <span style={{ fontSize: '1.2rem', padding: '10px 20px', background: 'var(--surface-color)', borderRadius: 8 }}>{p.toLocaleString()}</span>
                {i < parts.length - 1 && <span style={{ fontSize: '1.5rem', alignSelf: 'center' }}>+</span>}
              </React.Fragment>
            ))}
            {Array(parts.length - selectedParts.length).fill(0).map((_, i) => (
              <React.Fragment key={`empty-${i}`}>
                <span style={{ fontSize: '1.2rem', padding: '10px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px dashed #64748B' }}>___</span>
                {i < parts.length - selectedParts.length - 1 + selectedParts.length && <span style={{ fontSize: '1.5rem', alignSelf: 'center' }}>+</span>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {options.map((opt, i) => (
              <button key={i} className="btn btn-outline" 
                      onClick={() => handleSelectExpand(opt)}
                      disabled={selectedParts.includes(opt)}>
                {opt.toLocaleString()}
              </button>
            ))}
          </div>
        </>
      )}

      {mode === 'compare' && (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
            Compare the numbers:
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, fontSize: '1.5rem', fontWeight: 'bold' }}>
            <span>{target.val1.toLocaleString()}</span>
            <span style={{ width: 60, height: 60, background: done ? 'var(--green)' : 'var(--surface-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {done ? target.symbol : '?'}
            </span>
            <span>{target.val2.toLocaleString()}</span>
          </div>
          {!done && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
              {options.map(sym => (
                <button key={sym} className="btn btn-outline" onClick={() => handleCompare(sym)} style={{ fontSize: '1.5rem', width: 60 }}>
                  {sym}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {done && (
        <div style={{ marginTop: 20, animation: 'bounceIn 0.5s' }}>
          {round < 2 ? (
            <button className="btn btn-outline" onClick={() => setRound(r => r + 1)}>Try Another →</button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={onComplete}>🎉 Complete Simulation!</button>
          )}
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}
