import React, { useState, useEffect } from 'react';
import { generateTargetNumber } from '../../utils/placeValue';
import { formatNumber } from '../../utils/numberFormat';
import NumberSystemToggle from '../shared/NumberSystemToggle';
import { playAudio, sounds } from '../../utils/audio';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function DigitBlocksStation({ onNext, audioEnabled }) {
  const [round, setRound] = useState(1);
  const [numberSystem, setNumberSystem] = useState('international');
  
  const [target, setTarget] = useState(() => generateTargetNumber(1));
  const [chips, setChips] = useState(() => shuffleArray(String(target).split('')));
  const [placed, setPlaced] = useState(() => Array(String(target).length).fill(null));
  
  const [shakeIndices, setShakeIndices] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    const t = generateTargetNumber(round);
    setTarget(t);
    setChips(shuffleArray(String(t).split('')));
    setPlaced(Array(String(t).length).fill(null));
    setShakeIndices([]);
    setIsSuccess(false);
  }, [round]);

  const handleDragStart = (e, val, sourceIndex, source) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ val, sourceIndex, source }));
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDropToSlot = (e, dropIndex) => {
    e.preventDefault();
    if (isSuccess) return;
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    const { val, sourceIndex, source } = JSON.parse(data);

    if (source === 'chip') {
      const newPlaced = [...placed];
      const existing = newPlaced[dropIndex];
      newPlaced[dropIndex] = val;
      
      const newChips = [...chips];
      newChips[sourceIndex] = existing;
      
      setPlaced(newPlaced);
      setChips(newChips);
      sounds.badge();
    } else if (source === 'placed' && sourceIndex !== dropIndex) {
      const newPlaced = [...placed];
      const temp = newPlaced[dropIndex];
      newPlaced[dropIndex] = val;
      newPlaced[sourceIndex] = temp;
      setPlaced(newPlaced);
      sounds.badge();
    }
  };

  const handleDropToPool = (e) => {
    e.preventDefault();
    if (isSuccess) return;
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    const { val, sourceIndex, source } = JSON.parse(data);

    if (source === 'placed') {
      const newPlaced = [...placed];
      newPlaced[sourceIndex] = null;
      
      const newChips = [...chips];
      const emptyIdx = newChips.findIndex(c => c === null);
      if (emptyIdx !== -1) newChips[emptyIdx] = val;
      else newChips.push(val);
      
      setPlaced(newPlaced);
      setChips(newChips);
      sounds.wrong();
    }
  };

  const handleCheck = () => {
    const targetStr = String(target);
    const errors = [];
    placed.forEach((p, i) => { if (p !== targetStr[i]) errors.push(i); });

    if (errors.length === 0) {
      sounds.correct();
      playAudio('correct', 'Correct!', audioEnabled);
      setIsSuccess(true);
      setTimeout(() => {
        if (round < 3) {
          setRound(r => r + 1);
        } else {
          onNext();
        }
      }, 2000);
    } else {
      sounds.wrong();
      playAudio('wrong', 'Wrong.', audioEnabled);
      setShakeIndices(errors);
      setTimeout(() => setShakeIndices([]), 800);
    }
  };

  const allPlaced = placed.every(p => p !== null);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', width: '100%', animation: 'fadeIn 0.5s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', margin: 0 }}>
          Station A: Digit Blocks
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
          Round {round} / 3
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 24 }}>
        Drag the blocks to build the number: 
        <strong style={{ fontSize: '2rem', color: 'var(--accent)', display: 'block', marginTop: 12, letterSpacing: '2px' }}>
          {formatNumber(target, numberSystem)}
        </strong>
      </p>
      
      <NumberSystemToggle value={numberSystem} onChange={setNumberSystem} />

      {/* Place Value Mat */}
      <div 
        style={{ 
          display: 'flex', gap: 16, justifyContent: 'center', marginTop: 30, marginBottom: 40, flexWrap: 'wrap',
          background: 'var(--bg-card)', padding: '40px', borderRadius: 24,
          border: isSuccess ? '3px solid var(--green)' : '2px solid rgba(255,255,255,0.1)',
          boxShadow: isSuccess ? '0 0 40px rgba(76,175,80,0.4)' : '0 10px 40px rgba(0,0,0,0.3)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isSuccess ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        {placed.map((p, i) => (
          <div 
            key={i} 
            onDrop={(e) => handleDropToSlot(e, i)}
            onDragOver={handleDragOver}
            style={{ 
              width: 80, height: 100, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: p ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'rgba(255,255,255,0.05)', 
              color: 'white', 
              boxShadow: p ? '0 10px 20px rgba(0,0,0,0.3)' : 'inset 0 4px 15px rgba(0,0,0,0.3)', 
              border: `2px dashed ${p ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
              transition: 'all 0.2s',
              animation: shakeIndices.includes(i) ? 'shake 0.4s ease' : 'none',
              cursor: p ? 'grab' : 'default'
            }}
          >
            {p !== null && (
              <div
                draggable={!isSuccess}
                onDragStart={(e) => handleDragStart(e, p, i, 'placed')}
                onDragEnd={handleDragEnd}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span style={{ fontSize: '3rem', fontWeight: '900', fontFamily: 'var(--font-display)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{p}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chip Pool or Status */}
      <div 
        onDrop={handleDropToPool}
        onDragOver={handleDragOver}
        style={{ 
          display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center', minHeight: 120, flexWrap: 'wrap',
          background: 'rgba(0,0,0,0.3)', padding: '32px', borderRadius: 24,
          border: '1px solid rgba(255,255,255,0.05)',
          animation: 'fadeIn 0.3s ease'
        }}
      >
        {!allPlaced ? (
          chips.map((c, i) => c !== null ? (
            <div 
              key={i} 
              draggable={!isSuccess}
              onDragStart={(e) => handleDragStart(e, c, i, 'chip')}
              onDragEnd={handleDragEnd}
              style={{ 
                width: 75, height: 75, borderRadius: '20px', 
                background: 'linear-gradient(135deg, #fff, #f0f0f0)', color: 'var(--blue-deep)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', fontWeight: '900', fontFamily: 'var(--font-display)',
                cursor: 'grab', boxShadow: '0 8px 16px rgba(0,0,0,0.2), inset 0 -4px 0 rgba(0,0,0,0.1)', 
                border: '2px solid var(--gold)',
                transition: 'transform 0.1s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {c}
            </div>
          ) : (
            <div key={i} style={{ width: 75, height: 75 }} />
          ))
        ) : !isSuccess ? (
          <div style={{ animation: 'slideUp 0.3s ease', width: '100%' }}>
            <button className="btn btn-primary" style={{ fontSize: '1.4rem', padding: '16px 48px', borderRadius: 100 }} onClick={handleCheck}>Check Answer</button>
          </div>
        ) : (
          <div style={{ fontSize: '2.5rem', color: 'var(--green-light)', fontWeight: 'bold', animation: 'bounceIn 0.5s', fontFamily: 'var(--font-display)' }}>
            ✨ Perfect Build! ✨
          </div>
        )}
      </div>
    </div>
  );
}
