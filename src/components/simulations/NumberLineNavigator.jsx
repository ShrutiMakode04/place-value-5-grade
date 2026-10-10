import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../../utils/audio';

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function snap(val) { return Math.round(val / 100000) * 100000; }
function fmt(n) { return n.toLocaleString(); }

/* ─── Challenge definitions ─── */
function genChallenge(type) {
  if (type === 'plot') {
    const target = randInt(10, 99) * 100000;
    return { type, target, start: 0, desc: `Plot ${fmt(target)} on the number line`, label: fmt(target) };
  }
  if (type === 'compare') {
    const a = randInt(10, 48) * 100000;
    const b = randInt(52, 98) * 100000;
    const greater = b;
    return { type, a, b, greater, desc: `Which number is GREATER?` };
  }
  if (type === 'round') {
    const raw = randInt(1000000, 9000000);
    const rounded = Math.round(raw / 1000000) * 1000000;
    return { type, raw, rounded, desc: `Round ${fmt(raw)} to the nearest million` };
  }
  if (type === 'jump') {
    const start = randInt(1, 5) * 1000000;
    const target = start + randInt(3, 8) * 100000;
    return { type, target, start, desc: `Jump from ${fmt(start)} to reach the target` };
  }
  return genChallenge('plot');
}

const SEQUENCE = ['plot', 'compare', 'jump'];

/* ─── Number Line SVG ─── */
function NumberLineViz({ min, max, markers, width = 760 }) {
  const H = 110, lineY = 65, tickH = 16, labelY = 95;
  const pad = 40;
  const range = max - min;
  const toX = (v) => pad + ((v - min) / range) * (width - pad * 2);

  const step = range <= 2000000 ? 100000 : range <= 5000000 ? 500000 : 1000000;
  const ticks = [];
  for (let v = min; v <= max; v += step) ticks.push(v);

  return (
    <svg viewBox={`0 0 ${width} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      {/* Gradient track */}
      <defs>
        <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        {markers.map((m, i) => (
          <radialGradient key={`mg${i}`} id={`mg${i}`}>
            <stop offset="0%" stopColor={m.color || '#f59e0b'} stopOpacity="0.6" />
            <stop offset="100%" stopColor={m.color || '#f59e0b'} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {/* Track background */}
      <rect x={pad - 4} y={lineY - 6} width={width - pad * 2 + 8} height={12} rx={6}
        fill="rgba(255,255,255,0.08)" />
      <rect x={pad} y={lineY - 4} width={width - pad * 2} height={8} rx={4}
        fill="url(#trackGrad)" opacity={0.35} />

      {/* Ticks */}
      {ticks.map((v, i) => {
        const x = toX(v);
        const isMajor = v % 1000000 === 0;
        const label = v === 0 ? '0' : v >= 1000000
          ? `${(v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1)}M`
          : `${v / 1000}k`;
        return (
          <g key={v}>
            <line x1={x} y1={lineY - (isMajor ? 14 : 8)} x2={x} y2={lineY + (isMajor ? 14 : 8)}
              stroke={isMajor ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'} strokeWidth={isMajor ? 2 : 1} />
            {isMajor && (
              <text x={x} y={labelY} textAnchor="middle" fontSize={11} fontWeight="bold"
                fill="rgba(255,255,255,0.6)">{label}</text>
            )}
            {!isMajor && v % (step * 2) === 0 && (
              <text x={x} y={labelY} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.35)">{label}</text>
            )}
          </g>
        );
      })}

      {/* Markers */}
      {markers.map((m, i) => {
        const x = toX(m.value);
        const col = m.color || '#f59e0b';
        return (
          <g key={i}>
            {/* Glow halo */}
            <circle cx={x} cy={lineY} r={22} fill={`url(#mg${i})`} />
            {/* Stem */}
            <line x1={x} y1={20} x2={x} y2={lineY - 14} stroke={col} strokeWidth={2} strokeDasharray="4 2" />
            {/* Bubble */}
            <circle cx={x} cy={lineY} r={14} fill={col} stroke="#fff" strokeWidth={2.5}
              style={{ filter: `drop-shadow(0 0 8px ${col})` }} />
            <text x={x} y={lineY + 5} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#fff">
              {m.label || ''}
            </text>
            {/* Label above */}
            <rect x={x - 30} y={2} width={60} height={18} rx={5}
              fill="rgba(0,0,0,0.55)" />
            <text x={x} y={15} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill={col}>
              {m.value >= 1000000
                ? `${(m.value / 1000000).toFixed(2)}M`
                : `${(m.value / 1000).toFixed(0)}k`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Main Component ─── */
export default function NumberLineNavigator({ audioEnabled, onNext }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [challenge, setChallenge] = useState(() => genChallenge(SEQUENCE[0]));
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [selectedCompare, setSelectedCompare] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);

  useEffect(() => {
    const c = genChallenge(SEQUENCE[roundIdx % SEQUENCE.length]);
    setChallenge(c);
    setCurrent(c.start || 0);
    setDone(false);
    setFeedback(null);
    setSelectedCompare(null);
    setSelectedRound(null);
  }, [roundIdx]);

  const flash = (isCorrect) => {
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) { sounds.correct(); setDone(true); }
    else { sounds.wrong(); setTimeout(() => setFeedback(null), 800); }
  };

  const handleMove = (delta) => {
    if (done) return;
    const next = Math.max(0, Math.min(10000000, current + delta));
    setCurrent(next);
    sounds.click();
  };

  const handlePlotCheck = () => {
    if (done) return;
    flash(current === challenge.target);
  };

  const handleCompare = (val) => {
    if (done) return;
    setSelectedCompare(val);
    flash(val === challenge.greater);
  };

  const handleRoundSelect = (val) => {
    if (done) return;
    setSelectedRound(val);
    flash(val === challenge.rounded);
  };

  // Number line range
  const nlMin = challenge.type === 'jump' ? challenge.start - 500000 : 0;
  const nlMax = 10000000;

  const roundOptions = challenge.type === 'round' ? [
    challenge.rounded,
    challenge.rounded + 1000000,
    challenge.rounded - 1000000,
    challenge.rounded + 500000,
  ].filter(v => v > 0 && v <= 10000000)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4) : [];

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 6 }}>
          📍 Number Line Navigator
        </h2>
        <div style={{
          display: 'inline-block', background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.4)', borderRadius: 24,
          padding: '6px 20px', fontSize: '0.95rem', color: '#a5b4fc'
        }}>
          {challenge.desc}
        </div>
      </div>

      {/* Number Line */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, padding: '20px 16px', marginBottom: 20,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}>
        {challenge.type === 'plot' && (
          <NumberLineViz min={0} max={10000000}
            markers={[{ value: current, label: 'YOU', color: '#f59e0b' }]} />
        )}
        {challenge.type === 'compare' && (
          <NumberLineViz min={0} max={10000000}
            markers={[
              { value: challenge.a, label: 'A', color: '#6366f1' },
              { value: challenge.b, label: 'B', color: '#10b981' },
            ]} />
        )}
        {challenge.type === 'round' && (
          <NumberLineViz min={0} max={10000000}
            markers={[{ value: challenge.raw, label: '?', color: '#f43f5e' }]} />
        )}
        {challenge.type === 'jump' && (
          <NumberLineViz min={0} max={10000000}
            markers={[
              { value: challenge.start, label: 'START', color: '#6366f1' },
              { value: current, label: 'YOU', color: '#f59e0b' },
              { value: challenge.target, label: 'TARGET', color: '#10b981' },
            ]} />
        )}
      </div>

      {/* Controls */}
      {(challenge.type === 'plot' || challenge.type === 'jump') && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {[-1000000, -500000, -100000].map(d => (
              <button key={d} className="btn btn-outline btn-sm" onClick={() => handleMove(d)}
                style={{ minWidth: 64, background: 'rgba(99,102,241,0.1)', borderColor: '#6366f1', color: '#a5b4fc' }}>
                {d >= 0 ? '+' : ''}{d >= -1000 ? `${d / 1000}k` : `${d / 1000000}M`}
              </button>
            ))}
            <div style={{
              padding: '8px 20px', background: '#1e1b4b', borderRadius: 12,
              fontSize: '1.4rem', fontWeight: 900, color: '#fff', minWidth: 140,
              border: '2px solid rgba(99,102,241,0.5)', letterSpacing: 1,
            }}>{fmt(current)}</div>
            {[100000, 500000, 1000000].map(d => (
              <button key={d} className="btn btn-outline btn-sm" onClick={() => handleMove(d)}
                style={{ minWidth: 64, background: 'rgba(16,185,129,0.1)', borderColor: '#10b981', color: '#6ee7b7' }}>
                +{d >= 1000000 ? `${d / 1000000}M` : `${d / 1000}k`}
              </button>
            ))}
          </div>
          {!done && (challenge.type === 'plot' || challenge.type === 'jump') && (
            <button className="btn btn-primary" onClick={handlePlotCheck} style={{ marginBottom: 8 }}>
              ✅ Check My Answer
            </button>
          )}
        </>
      )}

      {challenge.type === 'compare' && (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {[{ val: challenge.a, label: 'A', col: '#6366f1' }, { val: challenge.b, label: 'B', col: '#10b981' }].map(({ val, label, col }) => (
            <button key={label} onClick={() => handleCompare(val)}
              style={{
                padding: '16px 32px', borderRadius: 16, border: `2px solid ${col}`,
                background: selectedCompare === val ? col : 'rgba(255,255,255,0.05)',
                color: '#fff', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: 'var(--font-display)',
                boxShadow: selectedCompare === val ? `0 6px 20px ${col}66` : 'none',
              }}>
              {label}: {fmt(val)}
            </button>
          ))}
        </div>
      )}

      {challenge.type === 'round' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 400, margin: '0 auto 16px' }}>
          {roundOptions.map(v => (
            <button key={v} onClick={() => handleRoundSelect(v)}
              style={{
                padding: '14px 16px', borderRadius: 14, border: '2px solid rgba(255,255,255,0.15)',
                background: selectedRound === v ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)',
                color: '#fff', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: 'var(--font-display)',
              }}>
              {fmt(v)}
            </button>
          ))}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div style={{
          padding: '10px 24px', borderRadius: 24, display: 'inline-block',
          background: feedback === 'correct' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
          border: `1px solid ${feedback === 'correct' ? '#10b981' : '#ef4444'}`,
          color: feedback === 'correct' ? '#6ee7b7' : '#fca5a5',
          fontWeight: 700, fontSize: '1.1rem', marginBottom: 12, animation: 'bounceIn 0.4s',
        }}>
          {feedback === 'correct' ? '🎉 Correct!' : '❌ Try again!'}
        </div>
      )}

      {done && (
        <div style={{ marginTop: 16, animation: 'bounceIn 0.5s' }}>
          <button className={`btn ${roundIdx < SEQUENCE.length - 1 ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => roundIdx < SEQUENCE.length - 1 ? setRoundIdx(r => r + 1) : onNext()}>
            {roundIdx < SEQUENCE.length - 1 ? 'Next Challenge →' : 'Next Station →'}
          </button>
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Challenge {Math.min(roundIdx + 1, SEQUENCE.length)} / {SEQUENCE.length}
      </div>
    </div>
  );
}
