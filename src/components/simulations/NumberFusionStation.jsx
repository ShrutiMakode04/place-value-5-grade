import React, { useState, useEffect } from 'react';
import { playAudio, sounds } from '../../utils/audio';

const ROUNDS = [
  { target: 45200, pieces: [40000, 5000, 200] },
  { target: 308050, pieces: [300000, 8000, 50] },
  { target: 6200009, pieces: [6000000, 200000, 9] }
];

const CARD_COLORS = [
  'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
];

export default function NumberFusionStation({ onNext, audioEnabled }) {
  const [round, setRound] = useState(0);
  const currentRound = ROUNDS[round];

  const [availablePieces, setAvailablePieces] = useState([]);
  const [fusedSum, setFusedSum] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (currentRound) {
      setAvailablePieces([...currentRound.pieces].sort(() => Math.random() - 0.5));
      setFusedSum(0);
      setIsSuccess(false);
      setShake(false);
    }
  }, [round, currentRound]);

  if (!currentRound) return null;

  const handleDragStart = (e, val) => {
    e.dataTransfer.setData('text/plain', val.toString());
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (isSuccess) return;
    const valStr = e.dataTransfer.getData('text/plain');
    if (!valStr) return;
    const val = parseInt(valStr, 10);

    // If piece is not in available list, ignore
    if (!availablePieces.includes(val)) return;

    sounds.badge();
    const newSum = fusedSum + val;
    setFusedSum(newSum);
    setAvailablePieces(prev => prev.filter(p => p !== val));

    // Check if newSum is target
    if (newSum === currentRound.target) {
      // Small delay to let the UI update before success state
      setTimeout(() => {
        sounds.correct();
        playAudio('correct', 'Correct!', audioEnabled);
        setIsSuccess(true);
        setTimeout(() => {
          if (round < ROUNDS.length - 1) {
            setRound(r => r + 1);
          } else {
            onNext();
          }
        }, 2500);
      }, 300);
    } else if (newSum > currentRound.target) {
      // Overshot (shouldn't happen if they drag correct pieces, but just in case)
      sounds.wrong();
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: 1000, animation: 'fadeIn 0.5s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', margin: 0 }}>
          Station A: Number Fusion
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
          Round {round + 1} / 3
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 40 }}>
        Drag the glowing expanded form cards into the Fusion Core to build the target number!
      </p>

      {/* Target Number */}
      <div style={{ 
        fontSize: '3rem', fontWeight: '900', color: 'white', fontFamily: 'var(--font-display)',
        textShadow: '0 4px 15px rgba(255,255,255,0.3)', marginBottom: 40, letterSpacing: '4px'
      }}>
        TARGET: {currentRound.target.toLocaleString()}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '50px' }}>
        
        {/* The Fusion Core */}
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={shake ? 'shake' : ''}
          style={{
            width: '250px', height: '250px', borderRadius: '50%',
            background: isSuccess 
              ? 'linear-gradient(135deg, #00b09b, #96c93d)' 
              : 'radial-gradient(circle, #3b0066 0%, #1a0033 100%)',
            border: `6px solid ${isSuccess ? 'var(--green-light)' : '#a18cd1'}`,
            boxShadow: isSuccess 
              ? '0 0 60px rgba(150,201,61,0.8), inset 0 0 30px rgba(255,255,255,0.8)' 
              : '0 0 40px rgba(161,140,209,0.5), inset 0 0 20px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative', zIndex: 10,
            transform: isSuccess ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <div style={{ color: isSuccess ? '#1a1a2e' : '#a18cd1', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>
            FUSION CORE
          </div>
          <div style={{ 
            fontSize: '2.5rem', fontWeight: '900', color: isSuccess ? '#fff' : 'var(--gold)', 
            fontFamily: 'monospace', textShadow: isSuccess ? 'none' : '0 0 10px rgba(255,193,7,0.5)'
          }}>
            {fusedSum.toLocaleString()}
          </div>
        </div>

        {/* Floating Expanded Cards */}
        <div style={{ 
          display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap',
          background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)', minHeight: '140px'
        }}>
          {availablePieces.length === 0 && !isSuccess && (
            <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>All pieces fused!</div>
          )}
          {availablePieces.map((val, i) => (
            <div
              key={val}
              draggable={!isSuccess}
              onDragStart={(e) => handleDragStart(e, val)}
              onDragEnd={handleDragEnd}
              style={{
                background: CARD_COLORS[i % CARD_COLORS.length],
                padding: '20px 30px', borderRadius: '16px', color: '#1a1a2e',
                fontSize: '1.8rem', fontWeight: '900', fontFamily: 'var(--font-display)',
                cursor: 'grab', boxShadow: '0 10px 20px rgba(0,0,0,0.4), inset 0 2px 10px rgba(255,255,255,0.5)',
                border: '2px solid rgba(255,255,255,0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)' }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
            >
              {val.toLocaleString()}
            </div>
          ))}
        </div>
      </div>

      {isSuccess && (
        <div style={{ marginTop: 40, animation: 'slideUp 0.5s ease' }}>
          <div style={{ fontSize: '3rem', color: 'var(--green-light)', fontWeight: 'bold', fontFamily: 'var(--font-display)', textShadow: '0 4px 15px rgba(76,175,80,0.5)' }}>
            ✨ FUSION COMPLETE! ✨
          </div>
        </div>
      )}
    </div>
  );
}
