import React from 'react';

export default function NumberSystemToggle({ value, onChange }) {
  return (
    <div className="toggle-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '15px 0' }}>
      <span style={{ fontWeight: value === 'international' ? '700' : '400', opacity: value === 'international' ? 1 : 0.6, fontSize: '0.9rem' }}>International</span>
      <button 
        style={{
          width: 50, height: 26, borderRadius: 13, background: 'var(--primary)', border: 'none', position: 'relative', cursor: 'pointer'
        }}
        onClick={() => onChange(value === 'international' ? 'indian' : 'international')}
      >
        <div style={{
          position: 'absolute', top: 3, left: value === 'international' ? 3 : 27, width: 20, height: 20, borderRadius: 10, background: 'white', transition: 'left 0.2s'
        }} />
      </button>
      <span style={{ fontWeight: value === 'indian' ? '700' : '400', opacity: value === 'indian' ? 1 : 0.6, fontSize: '0.9rem' }}>Indian</span>
      <span style={{ fontSize: '1.2rem' }}>🌍</span>
    </div>
  );
}
