import { useState, useCallback, useEffect } from 'react';
import NumberFusionStation from './simulations/NumberFusionStation';
import BuildNumberStation from './simulations/BuildNumberStation';
import ValueEquationStation from './simulations/ValueEquationStation';
import TokenDropStation from './simulations/TokenDropStation';
import NumberPatternStation from './simulations/NumberPatternStation';
import { playAudio, sounds } from '../utils/audio';

const STATIONS = [
  { id: 'fusion', title: 'Number Fusion', icon: '⚛️', comp: NumberFusionStation, inst: "Drag the expanded form cards into the Fusion Core to build the target number!" },
  { id: 'build', title: 'Build Decimal', icon: '🔢', comp: BuildNumberStation, inst: "Tap the empty boxes to build the number in the place value chart!" },
  { id: 'equation', title: 'Value Equation', icon: '🧩', comp: ValueEquationStation, inst: "Read the sentence and drop the correct piece into the box!" },
  { id: 'token', title: 'Token Drop', icon: '🎯', comp: TokenDropStation, inst: "Drag the glowing tokens into the correct columns to build the target number!" },
  { id: 'pattern', title: 'Number Patterns', icon: '🏭', comp: NumberPatternStation, inst: "Drag the correct Operation Gear into the machine to transform the number!" },
];

export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [activeStation, setActiveStation] = useState(0);

  useEffect(() => {
    playAudio(`sim_inst_${activeStation}`, STATIONS[activeStation].inst, audioEnabled);
  }, [activeStation, audioEnabled]);

  const handleStationComplete = useCallback(() => {
    sounds.badge();
    if (activeStation < STATIONS.length - 1) {
      setActiveStation(a => a + 1);
    } else {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [activeStation, onComplete]);

  const StationComp = STATIONS[activeStation].comp;

  return (
    <div className="simulate-phase" style={{ padding: '80px 24px 40px', width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Linear Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, width: '100%', maxWidth: 600, background: 'rgba(255,255,255,0.05)', padding: '16px 24px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.1)' }}>
        {STATIONS.map((station, i) => (
          <div key={station.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              background: i === activeStation ? 'var(--gold)' : i < activeStation ? 'var(--green)' : 'rgba(255,255,255,0.1)',
              color: i === activeStation ? '#1a1a2e' : 'white',
              boxShadow: i === activeStation ? '0 0 15px rgba(255,193,7,0.5)' : 'none',
              transition: 'all 0.3s ease',
              border: `2px solid ${i === activeStation ? 'var(--gold)' : i < activeStation ? 'var(--green)' : 'rgba(255,255,255,0.2)'}`
            }}>
              {i < activeStation ? '✓' : station.icon}
            </div>
            {i < STATIONS.length - 1 && (
              <div style={{ flex: 1, height: 4, background: i < activeStation ? 'var(--green)' : 'rgba(255,255,255,0.1)', margin: '0 8px', borderRadius: 2, transition: 'all 0.3s ease' }} />
            )}
          </div>
        ))}
      </div>

      {/* Active Station Container */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', animation: 'fadeIn 0.5s ease' }}>
        <StationComp audioEnabled={audioEnabled} onNext={handleStationComplete} simRound={activeStation} />
      </div>

    </div>
  );
}
