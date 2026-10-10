import { useState, useEffect, useCallback, useRef } from 'react';
import { playAudio, stopNarration } from '../utils/audio';

const WONDER_QUESTIONS = [
  {
    question: "82,540 fans packed the stadium for the final! Sarah says the '8' means 8. Mike says it means 80,000. Who's right — and why does it matter?",
    subtext: "Let's find out what a digit is REALLY worth!",
    emoji: "🏟️",
    bgEmojis: ["🏟️", "🌍", "✨", "🔢"],
  }
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[0]);
  const [stage, setStage] = useState(0);
  const [page, setPage] = useState(0); // 0 = hook, 1 = topic intro
  const [particles, setParticles] = useState([]);
  const narrationRef = useRef(null);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    if (page === 0) {
      playAudio('wonder', "82,540 fans packed the stadium for the final! Sarah says the '8' means 8. Mike says it means 80,000. Who's right — and why does it matter? Let's find out what a digit is REALLY worth!", audioEnabled);
      const t1 = setTimeout(() => setStage(1), 300);
      const t2 = setTimeout(() => setStage(2), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else if (page === 1) {
      playAudio('wonder_discover', "Get ready to explore the value of every digit! Let's master reading, writing, and comparing big numbers!", audioEnabled);
    }
  }, [page, audioEnabled]);

  useEffect(() => {
    // Other states handled
  }, [stage, wonder]);

  const handleDiscover = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    setPage(1); // Go to second page instead of completing
  }, []);

  const handleCompletePhase = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    onComplete();
  }, [onComplete]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span key={p.id} className="wonder-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>
      
      {page === 0 && (
        <div className="wonder-content">
          <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
            <span className="wonder-qmark-icon">?</span>
            <div className="wonder-qmark-glow" />
          </div>
          <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
            <div className="mascot thinking">🤖</div>
            <div className="speech-bubble wonder-bubble">Hmm... I wonder... 🤔</div>
          </div>
          <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
            <div className="wonder-emoji">{wonder.emoji}</div>
            <h2 className="wonder-question-text">{wonder.question}</h2>
            <p className="wonder-subtext">{wonder.subtext}</p>
          </div>
          <button className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`} onClick={handleDiscover} id="discover-btn">
            <span className="wonder-btn-sparkle">✨</span>
            Let's Discover!
            <span className="wonder-btn-sparkle">✨</span>
          </button>
        </div>
      )}

      {page === 1 && (
        <div className="wonder-content" style={{ animation: 'slideUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
          <div className="glass-card" style={{ 
            maxWidth: 800, textAlign: 'center', padding: '60px', borderRadius: '40px',
            background: 'linear-gradient(135deg, rgba(255,107,107,0.2) 0%, rgba(78,205,196,0.2) 100%)',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)'
          }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', fontSize: '3.5rem', 
              background: 'linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 20, textShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
              Place Value Power
            </h2>
            <div style={{ fontSize: '5rem', margin: '30px 0', display: 'flex', justifyContent: 'center', gap: 20 }}>
              <span style={{ animation: 'float 3s ease-in-out infinite' }}>🌍</span>
              <span style={{ animation: 'float 3s ease-in-out infinite 0.5s' }}>🚀</span>
              <span style={{ animation: 'float 3s ease-in-out infinite 1s' }}>📊</span>
            </div>
            <p style={{ 
              fontSize: '1.4rem', lineHeight: '1.8', color: '#fff', 
              marginBottom: 40, fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.4)' 
            }}>
              Get ready to explore the value of every digit! Let's master reading, writing, and comparing big numbers!
            </p>
            <button 
              className="btn" 
              onClick={handleCompletePhase}
              style={{
                background: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)',
                color: '#1a1a2e', fontSize: '1.6rem', padding: '20px 50px', borderRadius: '100px',
                fontWeight: '900', border: 'none', boxShadow: '0 10px 20px rgba(0,201,255,0.4)',
                fontFamily: 'var(--font-display)', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start the Expedition →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
