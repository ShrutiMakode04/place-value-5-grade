import React, { useState, useEffect } from 'react';
import { generateTargetNumber } from '../../utils/placeValue';
import PlaceValueChart from '../shared/PlaceValueChart';
import { playAudio, sounds } from '../../utils/audio';

function generateChartCards(target) {
  const correctCard = { target, isCorrect: true };
  const distractors = [];

  for(let i=0; i<3; i++) {
    let distTarget = target + (Math.floor(Math.random() * 50000) + 10000) * (Math.random() > 0.5 ? 1 : -1);
    if (distTarget < 100000) distTarget += 100000;
    distractors.push({ target: distTarget, isCorrect: false });
  }

  const arr = [correctCard, ...distractors];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ChartMatchStation({ onNext, audioEnabled }) {
  const [round, setRound] = useState(1);
  const [target, setTarget] = useState(() => generateTargetNumber(1));
  const [cards, setCards] = useState(() => generateChartCards(target));
  
  const [selected, setSelected] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeIndex, setShakeIndex] = useState(null);

  useEffect(() => {
    const t = generateTargetNumber(round);
    setTarget(t);
    setCards(generateChartCards(t));
    setSelected(null);
    setIsSuccess(false);
    setShakeIndex(null);
  }, [round]);

  const handleSelect = (index, isCorrect) => {
    if (isSuccess) return;
    setSelected(index);
    if (isCorrect) {
      sounds.correct();
      playAudio('correct', 'Correct!', audioEnabled);
      setIsSuccess(true);
      setTimeout(() => {
        if (round < 3) {
          setRound(r => r + 1);
        } else {
          onNext();
        }
      }, 2500);
    } else {
      sounds.wrong();
      playAudio('wrong', 'Wrong.', audioEnabled);
      setShakeIndex(index);
      setTimeout(() => setShakeIndex(null), 800);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', width: '100%', animation: 'fadeIn 0.5s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', margin: 0 }}>
          Station B: Chart Match
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
          Round {round} / 3
        </div>
      </div>
      
      <p style={{ fontSize: '1.2rem', marginBottom: 30, color: 'var(--text-secondary)' }}>
        Which place-value chart correctly shows the number 
        <strong style={{ fontSize: '2rem', color: 'var(--accent)', display: 'block', marginTop: 12, letterSpacing: '2px' }}>
          {target.toLocaleString('en-US')}
        </strong>
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        {cards.map((c, i) => {
          const isSelected = selected === i;
          const showSuccess = isSuccess && c.isCorrect;
          
          return (
            <div key={i} 
                 onClick={() => handleSelect(i, c.isCorrect)}
                 className={`${shakeIndex === i ? 'shake' : ''}`}
                 style={{
                   border: `4px solid ${showSuccess ? 'var(--green)' : isSelected ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
                   borderRadius: '24px',
                   padding: '24px',
                   cursor: 'pointer',
                   background: showSuccess ? 'rgba(76,175,80,0.1)' : isSelected ? 'rgba(244,67,54,0.1)' : 'var(--bg-card)',
                   transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                   transform: showSuccess ? 'scale(1.05)' : isSelected && !c.isCorrect ? 'scale(0.98)' : 'scale(1)',
                   boxShadow: showSuccess ? '0 10px 40px rgba(76,175,80,0.3)' : '0 10px 30px rgba(0,0,0,0.2)'
                 }}
                 onMouseOver={e => { if(!isSuccess && !isSelected) { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--gold)'; } }}
                 onMouseOut={e => { if(!isSuccess && !isSelected) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; } }}
            >
              <PlaceValueChart targetNumber={c.target} size="small" />
            </div>
          );
        })}
      </div>
      
      {isSuccess && (
        <div style={{ marginTop: 40, fontSize: '2.5rem', color: 'var(--green)', fontWeight: 'bold', animation: 'bounceIn 0.5s', fontFamily: 'var(--font-display)' }}>
          ✨ Spot on! ✨
        </div>
      )}
    </div>
  );
}
