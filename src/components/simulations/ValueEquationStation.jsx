import React, { useState, useEffect } from 'react';
import { playAudio, sounds } from '../../utils/audio';

const ROUNDS = [
  {
    type: 'digit',
    target: 252636, system: 'international',
    question: "Drag the DIGIT that is in the Ten Thousands place:",
    correctValue: "5",
    options: ["2", "5", "6"]
  },
  {
    type: 'place',
    target: 1407892, system: 'international',
    question: "Drag the PLACE NAME for the digit 4:",
    correctValue: "Hundred Thousands",
    options: ["Millions", "Hundred Thousands", "Ten Thousands"]
  },
  {
    type: 'value',
    target: 3500000, system: 'indian',
    question: "Drag the VALUE of the digit 3:",
    correctValue: "30,00,000", // Note: It's Ten Lakhs in Indian system, value is 30,00,000
    options: ["3,00,00,000", "30,00,000", "3,00,000"]
  }
];

export default function ValueEquationStation({ onNext, audioEnabled }) {
  const [round, setRound] = useState(0);
  const [droppedItem, setDroppedItem] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const currentRound = ROUNDS[round];

  const [shuffledOptions, setShuffledOptions] = useState([]);
  useEffect(() => {
    if (currentRound) {
      setShuffledOptions([...currentRound.options].sort(() => Math.random() - 0.5));
      setDroppedItem(null);
      setFeedback(null);
    }
  }, [round, currentRound]);

  if (!currentRound) return null;

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ item }));
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    const { item } = JSON.parse(data);
    
    setDroppedItem(item);
    
    if (item === currentRound.correctValue) {
      sounds.correct();
      playAudio('correct', 'Correct!', audioEnabled);
      setFeedback('correct');
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
      setFeedback('wrong');
      setTimeout(() => {
        setDroppedItem(null);
        setFeedback(null);
      }, 1000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: 900, animation: 'fadeIn 0.5s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', margin: 0 }}>
          Station C: The Missing Piece
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
          Round {round + 1} / 3
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 32 }}>
        Read the sentence and drop the correct piece into the box!
      </p>

      {/* Target Number Display */}
      <div style={{ 
        fontSize: '3rem', fontWeight: '900', fontFamily: 'var(--font-display)', color: 'white',
        letterSpacing: '4px', textShadow: '0 4px 10px rgba(0,0,0,0.5)', marginBottom: 40 
      }}>
        {currentRound.target.toLocaleString(currentRound.system === 'indian' ? 'en-IN' : 'en-US')}
      </div>

      {/* Question & Drop Zone Container */}
      <div style={{
        background: 'var(--bg-card)', padding: '40px', borderRadius: 24,
        border: feedback === 'correct' ? '3px solid var(--green)' : feedback === 'wrong' ? '3px solid var(--red)' : '2px solid rgba(255,255,255,0.1)', 
        boxShadow: feedback === 'correct' ? '0 0 40px rgba(76,175,80,0.3)' : '0 10px 40px rgba(0,0,0,0.3)',
        marginBottom: 40, transition: 'all 0.3s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30
      }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>
          {currentRound.question}
        </div>
        
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={feedback === 'wrong' ? 'shake' : ''}
          style={{
            width: 300, height: 100, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: droppedItem ? (feedback === 'correct' ? 'var(--green)' : 'var(--red)') : 'rgba(255,255,255,0.05)',
            border: `3px dashed ${droppedItem ? 'transparent' : 'var(--gold)'}`,
            fontSize: '1.8rem', fontWeight: 'bold', color: 'white',
            transition: 'all 0.3s', boxShadow: droppedItem ? '0 10px 20px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          {droppedItem ? droppedItem : 'Drop Here'}
        </div>
      </div>

      {/* Draggable Options Bank */}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        {shuffledOptions.map((opt, i) => (
          <div
            key={i}
            draggable={!feedback}
            onDragStart={(e) => handleDragStart(e, opt)}
            onDragEnd={handleDragEnd}
            style={{
              background: 'linear-gradient(135deg, #1e3c72, #2a5298)', padding: '20px 40px', borderRadius: 16,
              fontWeight: 'bold', fontSize: '1.4rem', color: 'white',
              border: '2px solid rgba(255,255,255,0.2)', cursor: feedback ? 'default' : 'grab',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)', userSelect: 'none',
              transition: 'transform 0.1s', opacity: (droppedItem && droppedItem === opt && feedback === 'correct') ? 0 : 1
            }}
            onMouseOver={e => { if(!feedback) e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)' }}
            onMouseOut={e => { if(!feedback) e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
          >
            {opt}
          </div>
        ))}
      </div>

      {feedback === 'correct' && (
        <div style={{ marginTop: 40, fontSize: '2.5rem', color: 'var(--green-light)', fontWeight: 'bold', animation: 'bounceIn 0.5s', fontFamily: 'var(--font-display)' }}>
          ✨ Excellent! ✨
        </div>
      )}
    </div>
  );
}
