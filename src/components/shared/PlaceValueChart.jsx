import React from 'react';
import { formatNumber } from '../../utils/numberFormat';

const PLACE_LABELS = {
  international: ['Ones','Tens','Hundreds','Thousands','Ten\nThousands','Hundred\nThousands','Millions','Ten\nMillions'],
  indian:        ['Ones','Tens','Hundreds','Thousands','Ten\nThousands','Lakhs','Ten\nLakhs','Crores'],
};

export default function PlaceValueChart({
  targetNumber,
  numberSystem = 'international',   // 'international' | 'indian'
  highlightedPlaceIndex,             // which column to highlight/mark as "?"
  animated = false,
  size = 'medium',                   // 'small' | 'medium' | 'large'
}) {
  const digitsStr = String(targetNumber);
  const digits = digitsStr.split('').reverse(); // index 0 = ones
  const colWidth = size === 'large' ? 64 : size === 'medium' ? 52 : 40;
  const colHeight = colWidth * 1.3;
  const labels = PLACE_LABELS[numberSystem];
  const svgWidth = digits.length * (colWidth + 10) + 20;
  const svgHeight = colHeight + 70;

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}
         xmlns="http://www.w3.org/2000/svg"
         style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}>
      {digits.map((digit, i) => {
        const cx = (digits.length - 1 - i) * (colWidth + 10) + 10;
        const isHighlighted = i === highlightedPlaceIndex;
        return (
          <g key={i} className={isHighlighted ? 'pv-col-highlight' : (animated ? 'digit-slot-in' : '')}
             style={{ animationDelay: `${i * 100}ms` }}>
            <rect x={cx} y="20" width={colWidth} height={colHeight} rx="10"
                  fill={isHighlighted ? '#FCD34D' : '#F8FAFC'}
                  stroke={isHighlighted ? '#F59E0B' : '#CBD5E1'}
                  strokeWidth="2.5"
                  strokeDasharray={isHighlighted && highlightedPlaceIndex === undefined ? '6,3' : '0'} />
            <text x={cx + colWidth / 2} y={20 + colHeight / 2 + 10}
                  textAnchor="middle" fontSize={colWidth * 0.55} fontWeight="700">
              {isHighlighted && highlightedPlaceIndex === undefined ? '?' : digit}
            </text>
            <text x={cx + colWidth / 2} y={colHeight + 42}
                  textAnchor="middle" fontSize="11" fill="#cbd5e1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
              {labels[i]?.split('\n').map((line, idx) => (
                <tspan x={cx + colWidth / 2} dy={idx === 0 ? 0 : 12} key={idx}>{line}</tspan>
              ))}
            </text>
          </g>
        );
      })}
      <text x={svgWidth / 2} y={svgHeight - 6}
            textAnchor="middle" fontSize="20" fontWeight="700" fill="#1E293B">
        {formatNumber(targetNumber, numberSystem)}
      </text>
    </svg>
  );
}
