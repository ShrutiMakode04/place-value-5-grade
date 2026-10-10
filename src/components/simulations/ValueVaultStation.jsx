import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { formatNumber } from '../../utils/numberFormat';

const ROUNDS = [
  {
    target: 40800,
    digits: 5, // 040800
    clue: "I am a 5-digit number. My Ten-Thousands digit is 4. My Hundreds digit is 8. All other digits are 0."
  },
  {
    target: 512000,
    digits: 6,
    clue: "I have 5 in the Hundred-Thousands place, 1 in the Ten-Thousands place, and 2 in the Thousands place. The rest are zeros."
  },
  {
    target: 9000006,
    digits: 7,
    clue: "I am a massive number! I have 9 in the Millions place and 6 in the Ones place. All my other digits are completely empty (zero)."
  }
];

export default function ValueVaultStation({ onNext }) {
  const [round, setRound] = useState(0);
  const currentRound = ROUNDS[round];
  
  const [dials, setDials] = useState([]);
  const [feedback, setFeedback] = useState(null);
  
  useEffect(() => {
    if (currentRound) {
      setDials(Array(currentRound.digits).fill(0));
      setFeedback(null);
    }
  }, [round, currentRound]);

  if (!currentRound) return null;

  const changeDial = (index, delta) => {
    if (feedback === 'correct') return;
    setDials(prev => {
      const newDials = [...prev];
      let val = newDials[index] + delta;
      if (val > 9) val = 0;
      if (val < 0) val = 9;
      newDials[index] = val;
      return newDials;
    });
    // Optional click sound for dial
    const audio = new Audio('/audio/click.mp3'); // placeholder
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const handleUnlock = () => {
    const entered = parseInt(dials.join(''), 10);
    if (entered === currentRound.target) {
      sounds.correct();
      setFeedback('correct');
      setTimeout(() => {
        if (round < ROUNDS.length - 1) {
          setRound(r => r + 1);
        } else {
          onNext();
        }
      }, 3000);
    } else {
      sounds.wrong();
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: 1000, animation: 'fadeIn 0.5s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', margin: 0 }}>
          Station D: Value Vault
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
          Round {round + 1} / 3
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 32 }}>
        Crack the code to unlock the vault! Read the clue and set the dials.
      </p>

      {/* The Clue */}
      <div style={{
        background: 'rgba(255,193,7,0.1)', border: '2px solid rgba(255,193,7,0.3)',
        padding: '24px', borderRadius: '16px', marginBottom: '40px',
        fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--gold-light)'
      }}>
        " {currentRound.clue} "
      </div>

      {/* The Vault UI */}
      <div className={feedback === 'wrong' ? 'shake' : ''} style={{
        background: 'linear-gradient(135deg, #2a0845 0%, #6441a5 100%)', padding: '40px', borderRadius: '30px',
        border: feedback === 'correct' ? '6px solid #00ff87' : '6px solid #60a5fa',
        boxShadow: feedback === 'correct' ? '0 0 50px rgba(0,255,135,0.8), inset 0 0 30px rgba(0,255,135,0.4)' : '0 20px 50px rgba(96,165,250,0.4), inset 0 0 20px rgba(96,165,250,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.5s ease',
        position: 'relative', overflow: 'hidden'
      }}>
        
        {/* Vault Display Screen */}
        <div style={{
          background: '#0f172a', width: '100%', height: '80px', borderRadius: '12px', marginBottom: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.8)', border: '2px solid #334155'
        }}>
          {feedback === 'correct' ? (
            <span style={{ color: '#4ade80', fontSize: '2.5rem', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '4px', textShadow: '0 0 10px #4ade80' }}>
              ACCESS GRANTED
            </span>
          ) : (
            <span style={{ color: '#ef4444', fontSize: '2.5rem', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '4px', textShadow: '0 0 10px rgba(239,68,68,0.5)' }}>
              {feedback === 'wrong' ? 'ACCESS DENIED' : 'LOCKED'}
            </span>
          )}
        </div>

        {/* Dials */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {dials.map((val, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => changeDial(i, 1)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '1.5rem', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >▲</button>
              
              <div style={{
                width: '70px', height: '90px', background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3.5rem', fontWeight: '900', fontFamily: 'monospace', color: '#1a1a2e',
                boxShadow: 'inset 0 4px 10px rgba(255,255,255,0.4), 0 4px 15px rgba(0,242,254,0.5)',
                border: '3px solid #fff'
              }}>
                {val}
              </div>
              
              <button 
                onClick={() => changeDial(i, -1)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '1.5rem', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >▼</button>
            </div>
          ))}
        </div>

        <button 
          onClick={handleUnlock}
          style={{
            marginTop: '40px', padding: '20px 60px', borderRadius: '100px', fontSize: '1.8rem', fontWeight: '900',
            background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#1a1a2e',
            border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(246,211,101,0.6), inset 0 4px 10px rgba(255,255,255,0.5)',
            transition: 'transform 0.1s', fontFamily: 'var(--font-display)',
            opacity: feedback === 'correct' ? 0 : 1, pointerEvents: feedback === 'correct' ? 'none' : 'auto'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          UNLOCK VAULT
        </button>
      </div>

    </div>
  );
}
