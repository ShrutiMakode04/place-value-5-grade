import { useState, useEffect, useCallback, useRef } from 'react';
import { playAudio, stopNarration } from '../utils/audio';

const STORY_SLIDES = [
  {
    image: '/wonder_bg.png',
    title: "A Massive Crowd!",
    text: "Look at this massive stadium! There are 82,540 screaming fans cheering for their team. But how do we know exactly how big that number is? Which digit tells us the most about the size of the crowd?",
    highlight: '"Which digit is the most important?"',
    mascotText: "Let's use a Place Value Chart! 📊",
  },
  {
    image: '/story_john.png',
    title: "The Place Value Chart",
    text: "A place-value chart slides in, lighting up column by column. The '2' in the hundred-thousands place represents 200,000! Every digit has a special place.",
    highlight: '"247,600 has 6 digits!"',
    mascotText: "Every place has a value! ✨",
  },
  {
    image: '/story_sarah.png',
    title: "Sarah's Distance Fact",
    text: "Sarah's booth: the moon is 384,400 km away. Which is bigger — the population digit or the distance digit in the same column?",
    highlight: '"Same digit, same column — but a completely different number!"',
    mascotText: "Compare the columns! 🚀",
  },
  {
    image: '/story_expanded_magic.png',
    title: "Breaking Numbers Apart",
    text: "Numbers can be broken apart into glowing, magical pieces! Expanded form shows the exact value of each and every digit clearly.",
    highlight: '"Every digit has its own glowing value!"',
    mascotText: "Breaking numbers apart is fun! 🧩",
  },
  {
    image: '/story_india_crore.png',
    title: "A Big Number in India",
    text: "Mike's booth is about India: 'This beautiful futuristic city has 1.3 crore people!' Wait — what's a crore?",
    highlight: '"Wait — what is a crore?"',
    mascotText: "Let's look at the Indian system! 🇮🇳",
  }
];

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const narrationRef = useRef(null);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    playAudio(`story_${slide}`, s.text, audioEnabled);
  }, [slide, audioEnabled, s.text]);

  const goNext = useCallback(() => {
    if (anim) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { isLast ? onComplete() : setSlide(i => i + 1); setAnim(false); }, 350);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => { setSlide(i => i - 1); setAnim(false); }, 350);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar"><div className="story-progress-fill" style={{ width: `${pct}%` }} /></div>
        <span className="story-progress-label">{slide + 1} / {STORY_SLIDES.length}</span>
      </div>

      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        {/* key=slide forces React to remount the img element, re-triggering CSS slide-in animation */}
        <div className="story-image-section">
          <img key={slide} src={s.image} alt={s.title} className="story-image story-image-enter"
            onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="story-image-overlay" />
        </div>

        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className="story-text revealed">{s.text}</p>
          <div className="story-highlight visible">
            <span>✨</span><span className="story-highlight-text">{s.highlight}</span><span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 54, height: 54, fontSize: '1.5rem' }}>🤖</div>
            <div className="speech-bubble" style={{ fontSize: '0.9rem', padding: '10px 16px', maxWidth: 200 }}>{s.mascotText}</div>
          </div>
        </div>
      </div>

      <div className="story-nav" style={{ maxWidth: 900 }}>
        <button className="btn btn-outline btn-sm" onClick={goPrev} disabled={slide === 0} style={{ opacity: slide === 0 ? 0.3 : 1 }}>← Back</button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (<div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
