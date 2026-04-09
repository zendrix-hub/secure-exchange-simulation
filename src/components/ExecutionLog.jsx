import React, { useEffect, useRef } from 'react';
import { Play, Key, FileText, Wifi, Unlock, Check } from 'lucide-react';

export default function ExecutionLog({ simState }) {
  const stepRefs = {
    1: useRef(null), 2: useRef(null), 3: useRef(null),
    4: useRef(null), 5: useRef(null)
  };

  useEffect(() => {
    if (simState.step > 0 && simState.step <= 5) {
      const el = stepRefs[simState.step].current;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [simState.step, simState.logs]);

  const steps = [
    { id: 1, icon: Play, title: "Step 1: Implement Diffie-Hellman", color: "sky" },
    { id: 2, icon: Key, title: "Step 2: Transform the Shared Key", color: "purple" },
    { id: 3, icon: FileText, title: "Step 3: Process the Message", color: "orange" },
    { id: 4, icon: Wifi, title: "Step 4: Encrypt and Transmit", color: "amber" },
    { id: 5, icon: Unlock, title: "Step 5: Decrypt (Receiver Side)", color: "green" }
  ];

  return (
    <div className="card" style={{ marginBottom: '4rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="card-title" style={{ fontSize: '2rem' }}>
          Learning Path
        </h2>
        <p style={{ color: '#9ca3af', fontWeight: 800, marginTop: '0.5rem' }}>Follow the encryption journey</p>
      </div>

      <div className="path-container">
        {steps.map((s, idx) => {
          const isActive = simState.step === s.id;
          const isCompleted = simState.step > s.id;
          const hasStarted = simState.step >= s.id;
          
          let circleClass = 'node-waiting';
          if (isCompleted) circleClass = 'node-completed';
          else if (isActive) circleClass = `node-active-${s.color}`;

          const Icon = isCompleted ? Check : s.icon;
          const isLeft = idx % 2 === 0;

          return (
            <div key={s.id} className={`path-node ${isLeft ? 'path-node-left' : 'path-node-right'}`} ref={stepRefs[s.id]}>
              {idx < steps.length - 1 && (
                <div className={`path-line ${isLeft ? 'path-line-left' : 'path-line-right'}`} style={{ backgroundColor: isCompleted ? '#86efac' : '#e5e7eb' }}></div>
              )}
              
              <div className={`tooltip ${isActive ? 'show' : ''}`}>
                <div className="tooltip-title">{s.title}</div>
                <div className="tooltip-log">
                  {simState.logs[s.id]?.length === 0 && <span className="animate-pulse" style={{ display: 'block', textAlign: 'center' }}>Working on it...</span>}
                  {simState.logs[s.id]?.map((log, i) => (
                    <div key={i} className="log-item">{log}</div>
                  ))}
                </div>
                <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '16px', height: '16px', backgroundColor: 'white', borderBottom: '2px solid #e5e7eb', borderRight: '2px solid #e5e7eb' }}></div>
              </div>

              <div className={`path-circle ${circleClass} ${isActive ? 'active' : ''}`}>
                <Icon size={40} strokeWidth={isCompleted ? 4 : 3} />
              </div>
              
              {!isActive && (
                <div className="path-title" style={{ color: isCompleted ? '#9ca3af' : '#d1d5db' }}>
                  {s.title}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
