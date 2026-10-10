import React, { useState, useEffect } from 'react';
import { playAudio, sounds } from '../../utils/audio';

const GEAR_COLORS = [
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
];

const ROUNDS = [
  {
    input: 45,
    output: 45000,
    options: ['× 10', '× 100', '× 1,000'],
    correctFilter: '× 1,000',
    rule: "Shift 3 places left! (Add 3 zeros)"
  },
  {
    input: 32000,
    output: 320,
    options: ['÷ 10', '÷ 100', '× 10'],
    correctFilter: '÷ 100',
    rule: "Shift 2 places right! (Remove 2 zeros)"
  },
  {
    input: 7,
    output: 700000,
    options: ['× 10,000', '× 100,000', '× 1,000'],
    correctFilter: '× 100,000',
    rule: "Shift 5 places left! (Add 5 zeros)"
  }
];

export default function NumberPatternStation({ onNext, audioEnabled }) {
  const [round, setRound] = useState(0);
  const [droppedFilter, setDroppedFilter] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'processing', 'correct', 'wrong'
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const currentRound = ROUNDS[round];

  useEffect(() => {
    if (currentRound) {
      setShuffledOptions([...currentRound.options].sort(() => Math.random() - 0.5));
      setDroppedFilter(null);
      setFeedback(null);
    }
  }, [round, currentRound]);

  if (!currentRound) return null;

  const handleDragStart = (e, opt) => {
    e.dataTransfer.setData('text/plain', opt);
    e.target.style.opacity = '0.5';
  };
  const handleDragEnd = (e) => { e.target.style.opacity = '1'; };
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (feedback === 'processing' || feedback === 'correct') return;
    const item = e.dataTransfer.getData('text/plain');
    if (!item) return;
    setDroppedFilter(item);
    sounds.badge();
  };

  const handlePullLever = () => {
    if (!droppedFilter) return;
    setFeedback('processing');
    
    // Play machine sound (simulated with setTimeout)
    sounds.badge(); // clunk

    setTimeout(() => {
      if (droppedFilter === currentRound.correctFilter) {
        sounds.correct();
        playAudio('correct', 'Correct!', audioEnabled);
        setFeedback('correct');
        setTimeout(() => {
          if (round < ROUNDS.length - 1) {
            setRound(r => r + 1);
          } else {
            onNext();
          }
        }, 1500);
      } else {
        sounds.wrong();
        playAudio('wrong', 'Wrong.', audioEnabled);
        setFeedback('wrong');
        setTimeout(() => {
          setFeedback(null);
          setDroppedFilter(null);
        }, 1500);
      }
    }, 1500); // 1.5s processing time
  };

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: 1000, animation: 'fadeIn 0.5s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', margin: 0 }}>
          Station E: Pattern Machine
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
          Round {round + 1} / 3
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 40 }}>
        Drag the correct Operation Gear into the machine to transform the number!
      </p>

      {/* The Machine Factory */}
      <div className={feedback === 'processing' ? 'shake' : ''} style={{
        background: 'linear-gradient(to bottom, #1e293b, #0f172a)', padding: '40px', borderRadius: '32px',
        border: feedback === 'correct' ? '4px solid var(--green)' : '4px solid #334155',
        boxShadow: feedback === 'correct' ? '0 0 50px rgba(76,175,80,0.5)' : '0 20px 40px rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative',
        transition: 'all 0.5s ease'
      }}>
        
        {/* Input Belt */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>INPUT</div>
          <div style={{ 
            background: 'var(--bg-card)', padding: '20px 30px', borderRadius: '16px',
            fontSize: '2.5rem', fontWeight: '900', fontFamily: 'monospace', color: 'white',
            border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
          }}>
            {currentRound.input.toLocaleString()}
          </div>
          {/* Belt styling */}
          <div style={{ width: '120px', height: '16px', background: '#334155', borderRadius: '8px', backgroundImage: 'repeating-linear-gradient(90deg, #334155, #334155 10px, #475569 10px, #475569 20px)' }} />
        </div>

        {/* The Machine Core (Drop Zone) */}
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            width: '200px', height: '200px', borderRadius: '50%',
            background: droppedFilter ? (feedback === 'wrong' ? '#ef4444' : feedback === 'correct' ? '#4ade80' : 'var(--gold)') : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: `6px dashed ${droppedFilter ? 'transparent' : '#a1c4fd'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: droppedFilter ? '0 10px 30px rgba(0,0,0,0.5), inset 0 -10px 20px rgba(0,0,0,0.2)' : '0 10px 30px rgba(118,75,162,0.5), inset 0 10px 30px rgba(0,0,0,0.3)',
            transition: 'all 0.3s', position: 'relative', zIndex: 10
          }}
        >
          {droppedFilter ? (
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a1a2e', fontFamily: 'var(--font-display)' }}>
              {droppedFilter}
            </div>
          ) : (
            <div style={{ color: '#e0c3fc', fontWeight: '900', fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Drop Gear Here</div>
          )}
        </div>

        {/* Output Belt */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>TARGET OUTPUT</div>
          <div style={{ 
            background: 'var(--bg-card)', padding: '20px 30px', borderRadius: '16px',
            fontSize: '2.5rem', fontWeight: '900', fontFamily: 'monospace', color: feedback === 'correct' ? 'var(--green-light)' : 'white',
            border: `2px solid ${feedback === 'correct' ? 'var(--green)' : 'rgba(255,255,255,0.1)'}`, 
            boxShadow: feedback === 'correct' ? '0 0 20px rgba(76,175,80,0.5)' : '0 8px 16px rgba(0,0,0,0.3)',
            transition: 'all 0.5s ease'
          }}>
            {feedback === 'processing' ? '?.???' : currentRound.output.toLocaleString()}
          </div>
          {/* Belt styling */}
          <div style={{ width: '120px', height: '16px', background: '#334155', borderRadius: '8px', backgroundImage: 'repeating-linear-gradient(90deg, #334155, #334155 10px, #475569 10px, #475569 20px)' }} />
        </div>

      </div>

      {/* Options Bank & Lever */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', marginTop: '50px' }}>
        
        {/* Gears */}
        <div style={{ display: 'flex', gap: '20px', background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {shuffledOptions.map((opt, i) => (
            <div
              key={i}
              draggable={!feedback}
              onDragStart={(e) => handleDragStart(e, opt)}
              onDragEnd={handleDragEnd}
              style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: GEAR_COLORS[i % GEAR_COLORS.length], border: '6px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', fontWeight: '900', color: 'white',
                cursor: feedback ? 'default' : 'grab', boxShadow: '0 10px 25px rgba(0,0,0,0.4), inset 0 4px 10px rgba(255,255,255,0.5)',
                transition: 'transform 0.1s', opacity: (droppedFilter === opt) ? 0.3 : 1,
                textShadow: '0 2px 5px rgba(0,0,0,0.3)'
              }}
              onMouseOver={e => { if(!feedback && droppedFilter !== opt) e.currentTarget.style.transform = 'translateY(-5px) rotate(15deg)' }}
              onMouseOut={e => { if(!feedback) e.currentTarget.style.transform = 'translateY(0) rotate(0deg)' }}
            >
              {opt}
            </div>
          ))}
        </div>

        {/* The Pull Lever */}
        <button
          onClick={handlePullLever}
          disabled={!droppedFilter || feedback}
          style={{
            padding: '30px 40px', borderRadius: '24px', fontSize: '1.8rem', fontWeight: '900',
            background: droppedFilter && !feedback ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' : '#475569', 
            color: droppedFilter && !feedback ? '#1a1a2e' : 'white', border: 'none', cursor: droppedFilter && !feedback ? 'pointer' : 'default', 
            boxShadow: droppedFilter && !feedback ? '0 10px 20px rgba(246,211,101,0.5), inset 0 4px 10px rgba(255,255,255,0.6)' : 'none',
            fontFamily: 'var(--font-display)', transition: 'all 0.2s',
            transform: feedback === 'processing' ? 'translateY(15px)' : 'translateY(0)' // lever pull effect
          }}
          onMouseDown={e => { if(droppedFilter && !feedback) e.currentTarget.style.transform = 'translateY(10px)' }}
          onMouseUp={e => { if(droppedFilter && !feedback) e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {feedback === 'processing' ? 'PROCESSING...' : 'PULL LEVER!'}
        </button>

      </div>

      {feedback === 'correct' && (
        <div style={{ marginTop: 40, animation: 'slideUp 0.5s ease' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--green-light)', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
            ✨ Success! ✨
          </div>
          <div style={{ fontSize: '1.4rem', color: 'white', marginTop: 10, background: 'rgba(76,175,80,0.2)', padding: '16px', borderRadius: '16px', display: 'inline-block' }}>
            {currentRound.rule}
          </div>
        </div>
      )}
    </div>
  );
}
