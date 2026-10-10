import React, { useState, useCallback } from 'react';
import PlaceValueChart from './shared/PlaceValueChart';

function Visual({ question }) {
  if (!question.visual || question.visual === 'none') return null;

  if (question.visual === 'placeValueChart') {
    return (
      <div style={{ margin: '20px 0', overflowX: 'auto', pointerEvents: 'none' }}>
        <PlaceValueChart 
          targetNumber={question.targetNumber} 
          numberSystem={question.numberSystem} 
          highlightedPlaceIndex={question.highlightedPlaceIndex} 
          animated={false} 
        />
      </div>
    );
  }

  if (question.visual === 'picture' && question.type === 'word_problem') {
     return (
        <div style={{ margin: '20px 0', fontSize: '4rem', textAlign: 'center' }}>
           {question.unit === 'people' ? '🏙️' : question.unit === 'km' ? '🚀' : '🌟'}
        </div>
     );
  }

  return null;
}

export default function QuestionRenderer({ question, onAnswer, disabled }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = useCallback((opt) => {
    if (disabled) return;
    setSelectedOption(opt);
    const isCorrect = String(opt) === String(question.correctAnswer);
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
    }, 600);
  }, [disabled, question.correctAnswer, onAnswer]);

  return (
    <div>
      <div style={{ display: 'inline-block', background: 'var(--coral)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, letterSpacing: '0.5px' }}>
        🔢 PLACE VALUE POWER
      </div>
      <p className="question-text" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{question.questionText}</p>

      <Visual question={question} />

      {question.options && question.type !== 'chart_match' && (
        <div className="options-grid">
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt) === String(question.correctAnswer) ? ' correct' : ' wrong';
            } else if (disabled && String(opt) === String(question.correctAnswer)) {
              cls += ' correct';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOptionClick(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'chart_match' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: 20 }}>
          {question.options.map((opt, i) => {
            let renderTarget = question.targetNumber;
            if (opt !== question.correctAnswer) {
                let s = String(question.targetNumber).split('');
                s[0] = (parseInt(s[0] || '1')+1)%9 + 1; 
                renderTarget = parseInt(s.join(''), 10);
            }
            
            let bg = 'white';
            let border = '2px solid var(--border)';
            if (selectedOption === opt) {
              bg = String(opt) === String(question.correctAnswer) ? '#f0fdf4' : '#fef2f2';
              border = String(opt) === String(question.correctAnswer) ? '2px solid var(--green)' : '2px solid var(--red)';
            } else if (disabled && String(opt) === String(question.correctAnswer)) {
              bg = '#f0fdf4';
              border = '2px solid var(--green)';
            }
            
            return (
              <div key={i} onClick={() => handleOptionClick(opt)} style={{background: bg, border, borderRadius: 12, padding: 10, cursor: disabled ? 'default' : 'pointer', pointerEvents: disabled ? 'none' : 'auto'}}>
                <div style={{fontWeight: 'bold', marginBottom: 10}}>{opt}</div>
                <PlaceValueChart targetNumber={renderTarget} numberSystem={question.numberSystem} size="small" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
