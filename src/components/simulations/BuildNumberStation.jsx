import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';
import PlaceValueChart from '../shared/PlaceValueChart';
import { digitCount, digitAtPlace, PLACES } from '../../utils/placeValue';
import { formatNumber } from '../../utils/numberFormat';

const ROUNDS = [
  { target: 40800 },
  { target: 512000 },
  { target: 9000006 }
];

export default function BuildNumberStation({ onNext, audioEnabled }) {
  const [round, setRound] = useState(0);
  const currentRound = ROUNDS[round];
  
  const [placed, setPlaced] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentRound) {
      setPlaced({});
      setDone(false);
    }
  }, [round, currentRound]);

  if (!currentRound) return null;

  const target = currentRound.target;
  const numDigits = digitCount(target);
  
  // We need to render boxes for each place value from max place to 0
  const placesData = [];
  for (let i = numDigits - 1; i >= 0; i--) {
      placesData.push({
          index: i,
          name: PLACES[i].replace('_', ' '),
          reqDigit: digitAtPlace(target, i)
      });
  }

  const handlePlace = (index, val) => {
    if (done) return;
    sounds.click();
    setPlaced(prev => ({ ...prev, [index]: val }));
  };

  const handleCheck = () => {
    // Check if all are placed correctly
    let allCorrect = true;
    for (let i = 0; i < numDigits; i++) {
        if (placed[i] !== digitAtPlace(target, i)) {
            allCorrect = false;
        }
    }

    if (allCorrect) {
      setDone(true);
      sounds.correct();
    } else {
      sounds.wrong();
    }
  };

  const isAllFilled = placesData.every(p => placed[p.index] !== undefined);

  return (
    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', margin: 0 }}>
          Station B: Build the Number
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
          Round {round + 1} / 3
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: 16 }}>
        Build <strong style={{ color: 'var(--gold)' }}>{formatNumber(target, 'international')}</strong> in the place value chart!
      </p>

      {/* Manual Place Value Display */}
      <div style={{ 
          display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px', 
          alignItems: 'flex-end', flexWrap: 'wrap',
          background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: '16px', border: '2px dashed rgba(255,255,255,0.2)'
      }}>
        {placesData.map((p, i) => (
            <React.Fragment key={p.index}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button 
                    className="btn btn-outline" 
                    style={{ 
                        width: '80px', height: '80px', fontSize: '2.5rem', 
                        fontFamily: 'var(--font-display)',
                        background: placed[p.index] !== undefined ? 'rgba(255,255,255,0.1)' : 'transparent',
                        borderColor: placed[p.index] !== undefined ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
                        color: placed[p.index] !== undefined ? 'var(--gold)' : 'white'
                    }} 
                    onClick={() => handlePlace(p.index, p.reqDigit)}
                >
                    {placed[p.index] !== undefined ? placed[p.index] : '?'}
                </button>
                <div style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '80px', wordWrap: 'break-word' }}>
                    {p.name}
                </div>
              </div>
              {/* Add commas for thousands/millions if needed (International system) */}
              {(p.index === 3 || p.index === 6) && (
                  <div style={{ fontSize: '4rem', color: 'var(--text-muted)', fontWeight: 'bold', lineHeight: '1', paddingBottom: '30px' }}>,</div>
              )}
            </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
         <span style={{ color: 'var(--text-muted)' }}>Tap the empty boxes to auto-fill (Drag and drop mock)</span>
      </div>

      {!done ? (
        <button 
            className="btn btn-primary" 
            onClick={handleCheck} 
            disabled={!isAllFilled}
            style={{ padding: '15px 40px', fontSize: '1.2rem', opacity: isAllFilled ? 1 : 0.5 }}
        >
            Check Chart
        </button>
      ) : (
        <div style={{ marginTop: 20, animation: 'bounceIn 0.5s' }}>
          <div style={{ marginBottom: '20px', pointerEvents: 'none' }}>
            <PlaceValueChart targetNumber={target} numberSystem="international" animated={true} />
          </div>
          <button 
              className={`btn ${round < ROUNDS.length - 1 ? 'btn-outline' : 'btn-primary'}`} 
              onClick={() => round < ROUNDS.length - 1 ? setRound(r => r + 1) : onNext()}
              style={{ padding: '15px 40px', fontSize: '1.2rem' }}
          >
            {round < ROUNDS.length - 1 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
    </div>
  );
}
