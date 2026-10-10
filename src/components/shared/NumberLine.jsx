import React from 'react';

export default function NumberLine({ min = 0, max = 10000000, markers = [], zoomLevel = 1, onMarkerDrag }) {
  const tickInterval = zoomLevel === 1 ? 1000000 : zoomLevel === 2 ? 100000 : 10000;
  const numTicks = Math.floor((max - min) / tickInterval) + 1;
  const svgWidth = 1000;
  const scaleX = (value) => ((value - min) / (max - min)) * (svgWidth - 40) + 20;

  return (
    <svg viewBox={`0 0 ${svgWidth} 140`} xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto', overflow: 'visible' }}>
      <line x1="20" y1="70" x2={svgWidth - 20} y2="70" stroke="#94A3B8" strokeWidth="3" />
      {Array.from({ length: numTicks }, (_, i) => {
        const value = min + i * tickInterval;
        const x = scaleX(value);
        // Determine if this tick gets a label. If zoomLevel is 2, only label every 500k or 1M to avoid overlap.
        const isMajor = zoomLevel === 1 || value % 1000000 === 0;
        const isMedium = value % 500000 === 0;
        const showLabel = zoomLevel === 1 || isMajor || (zoomLevel === 2 && isMedium && svgWidth > 800);
        
        return (
          <g key={value}>
            <line x1={x} y1={isMajor ? "50" : "60"} x2={x} y2="80" stroke={isMajor ? "#475569" : "#94A3B8"} strokeWidth={isMajor ? "3" : "2"} />
            {showLabel && (
              <text x={x} y="100" textAnchor="middle" fontSize="11" fontWeight={isMajor ? "bold" : "normal"} fill={isMajor ? "#334155" : "#64748B"}>
                {value >= 1000000 ? `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M` : value === 0 ? '0' : `${value/1000}k`}
              </text>
            )}
          </g>
        );
      })}
      {markers.map((m, i) => {
        const xPos = scaleX(m.value);
        return (
          <g key={i} transform={`translate(${xPos}, 40)`} className="marker-pulse">
            <line x1="0" y1="10" x2="0" y2="30" stroke={m.color || '#F59E0B'} strokeWidth="2" strokeDasharray="2,2" />
            <circle r="10" fill={m.color || '#F59E0B'} stroke="#fff" strokeWidth="2" />
            <text y="-16" textAnchor="middle" fontSize="14" fontWeight="600" fill="#1E293B">
              {m.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
