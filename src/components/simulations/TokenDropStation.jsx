import React, { useState, useEffect } from 'react';
import { playAudio, sounds } from '../../utils/audio';

const COL_COLORS = [
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
  'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)'
];

const ROUNDS = [
  { target: 43200, columns: ['Ten\nThousands', 'Thousands', 'Hundreds', 'Tens', 'Ones'] },
  { target: 105400, columns: ['Hundred\nThousands', 'Ten\nThousands', 'Thousands', 'Hundreds', 'Tens', 'Ones'] },
  { target: 3200000, columns: ['Millions', 'Hundred\nThousands', 'Ten\nThousands', 'Thousands', 'Hundreds', 'Tens', 'Ones'] }
];

export default function TokenDropStation({ onNext, audioEnabled }) {
  const [round, setRound] = useState(0);
  const currentRound = ROUNDS[round];

  const [counts, setCounts] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeIndices, setShakeIndices] = useState([]);

  useEffect(() => {
    if (currentRound) {
      setCounts(Array(currentRound.columns.length).fill(0));
      setIsSuccess(false);
      setShakeIndices([]);
    }
  }, [round, currentRound]);

  if (!currentRound) return null;

  const targetDigits = String(currentRound.target).split('').map(Number);
  // targetDigits might be shorter than columns if leading zeros? No, we mapped columns specifically.
  // Actually, target 43200 has 5 digits. columns has 5. Correct.

  const handleDragStart = (e, val) => {
    e.dataTransfer.setData('text/plain', val);
    e.target.style.opacity = '0.5';
  };
  const handleDragEnd = (e) => { e.target.style.opacity = '1'; };
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, colIndex) => {
    e.preventDefault();
    if (isSuccess) return;
    
    // We don't actually care what they dragged, dropping ANY token increments the counter for that place value column.
    // In a real physical app, they drag a "100" token into "Hundreds". 
    // To make it foolproof, if they drop the WRONG token, we can shake it.
    const tokenVal = e.dataTransfer.getData('text/plain');
    if (!tokenVal) return;

    // The column represents a power of 10.
    const power = currentRound.columns.length - 1 - colIndex;
    const expectedTokenVal = Math.pow(10, power).toString();

    if (tokenVal === expectedTokenVal) {
      setCounts(prev => {
        const newC = [...prev];
        if (newC[colIndex] < 9) newC[colIndex]++;
        return newC;
      });
      sounds.badge(); // soft pop
    } else {
      sounds.wrong();
      playAudio('wrong', 'Wrong.', audioEnabled);
      setShakeIndices(prev => [...prev, colIndex]);
      setTimeout(() => setShakeIndices(prev => prev.filter(i => i !== colIndex)), 500);
    }
  };

  const handleRemove = (colIndex) => {
    if (isSuccess) return;
    setCounts(prev => {
      if (prev[colIndex] > 0) {
        sounds.click();
        const newC = [...prev];
        newC[colIndex]--;
        return newC;
      }
      return prev;
    });
  };

  const handleCheck = () => {
    let correct = true;
    const errors = [];
    counts.forEach((c, i) => {
      if (c !== targetDigits[i]) {
        correct = false;
        errors.push(i);
      }
    });

    if (correct) {
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
    } else {
      sounds.wrong();
      playAudio('wrong', 'Wrong.', audioEnabled);
      setShakeIndices(errors);
      setTimeout(() => setShakeIndices([]), 800);
    }
  };

  const tokensAvailable = currentRound.columns.map((_, i) => Math.pow(10, currentRound.columns.length - 1 - i).toString());

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: 1000, animation: 'fadeIn 0.5s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', margin: 0 }}>
          Station D: Token Drop
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
          Round {round + 1} / 3
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 10 }}>
        Drag the glowing tokens into the correct columns to build the target number!
      </p>
      
      <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent)', fontFamily: 'monospace', letterSpacing: '2px', marginBottom: 30 }}>
        {currentRound.target.toLocaleString()}
      </div>

      {/* Place Value Chart Drop Zones */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap',
        background: 'var(--bg-card)', padding: '30px', borderRadius: '24px',
        border: isSuccess ? '3px solid var(--green)' : '2px solid rgba(255,255,255,0.1)',
        boxShadow: isSuccess ? '0 0 40px rgba(76,175,80,0.3)' : '0 10px 30px rgba(0,0,0,0.2)',
        transition: 'all 0.3s'
      }}>
        {currentRound.columns.map((colName, i) => (
          <div 
            key={i}
            onDrop={(e) => handleDrop(e, i)}
            onDragOver={handleDragOver}
            onClick={() => handleRemove(i)}
            className={shakeIndices.includes(i) ? 'shake' : ''}
            style={{
              width: '100px', height: '160px', borderRadius: '16px',
              background: COL_COLORS[i % COL_COLORS.length], border: '2px solid rgba(0,0,0,0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px', cursor: counts[i] > 0 ? 'pointer' : 'default',
              boxShadow: counts[i] > 0 ? 'inset 0 0 20px rgba(255,255,255,0.8)' : '0 4px 10px rgba(0,0,0,0.2)',
              position: 'relative', transition: 'all 0.3s'
            }}
          >
            <div style={{ color: '#1a1a2e', fontSize: '0.85rem', fontWeight: '900', height: '40px', display: 'flex', alignItems: 'center', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>
              {colName.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
            </div>
            
            {/* Tokens visual stack */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
              {counts[i] > 0 ? (
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.5)'
                }}>
                  {counts[i]}
                </div>
              ) : (
                <div style={{ color: 'rgba(0,0,0,0.4)', fontSize: '0.9rem', fontWeight: 'bold' }}>Drop Here</div>
              )}
            </div>
            {counts[i] > 0 && <div style={{ fontSize: '0.75rem', color: '#1a1a2e', fontWeight: 'bold', marginTop: 5, background: 'rgba(255,255,255,0.5)', padding: '2px 6px', borderRadius: 10 }}>Tap to remove</div>}
          </div>
        ))}
      </div>

      {/* Token Pool */}
      <div style={{ 
        display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap',
        background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '24px'
      }}>
        {tokensAvailable.map((val, i) => (
          <div
            key={i}
            draggable={!isSuccess}
            onDragStart={(e) => handleDragStart(e, val)}
            onDragEnd={handleDragEnd}
            style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3c72, #2a5298)', border: '4px solid #94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: val.length > 5 ? '0.9rem' : val.length > 3 ? '1.1rem' : '1.4rem', fontWeight: 'bold', color: 'white',
              cursor: 'grab', boxShadow: '0 8px 15px rgba(0,0,0,0.4), inset 0 4px 10px rgba(255,255,255,0.2)',
              transition: 'transform 0.1s'
            }}
            onMouseOver={e => { if(!isSuccess) e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)' }}
            onMouseOut={e => { if(!isSuccess) e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
          >
            {Number(val).toLocaleString()}
          </div>
        ))}
      </div>

      {!isSuccess ? (
        <div style={{ marginTop: 40 }}>
          <button className="btn" style={{ padding: '16px 48px', fontSize: '1.4rem', borderRadius: 100, background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#1a1a2e', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 20px rgba(246, 211, 101, 0.4)' }} onClick={handleCheck}>
            Check Build
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 40, fontSize: '2.5rem', color: 'var(--green-light)', fontWeight: 'bold', animation: 'bounceIn 0.5s', fontFamily: 'var(--font-display)' }}>
          ✨ Perfect! ✨
        </div>
      )}
    </div>
  );
}
