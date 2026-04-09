import React from 'react';
import { Settings, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function EnvironmentParams({ params, simState, handleInputChange, startSimulation }) {
  const isReady = params.p && params.g && params.privA && params.privB && params.message;

  return (
    <div className="card env-card">
      <div className="card-header" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="icon-wrapper bg-blue-light text-blue" style={{ padding: '0.75rem' }}>
            <Settings size={28} strokeWidth={3} />
          </div>
          <h2 className="card-title">Environment Rules</h2>
        </div>

        {simState.isSimulating ? (
          <div className="status-bar status-loading">
            <Loader2 size={24} className="animate-spin" strokeWidth={3} />
            <span>Checking...</span>
          </div>
        ) : isReady ? (
          <button 
            onClick={startSimulation}
            className="status-bar"
            style={{
              backgroundColor: '#22c55e', color: 'white', borderColor: '#16a34a',
              cursor: 'pointer', transition: 'all 0.1s', borderBottomWidth: '4px'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(2px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <CheckCircle2 size={24} strokeWidth={3} />
            <span>Start Simulation 👉</span>
          </button>
        ) : (
          <div className="status-bar status-waiting">
            <AlertCircle size={24} strokeWidth={3} />
            <span>Fill blanks</span>
          </div>
        )}
      </div>

      <div className="grid-3">
        <label className="input-label">
          <span>Prime (p) — Hardcoded</span>
          <input
            type="number" name="p" value={params.p} readOnly
            className="input-duo"
            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }}
          />
        </label>
        <label className="input-label">
          <span>Generator (g) — Hardcoded</span>
          <input
            type="number" name="g" value={params.g} readOnly
            className="input-duo" 
            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }}
          />
        </label>
        <label className="input-label" style={{ gridColumn: '1 / -1' }}>
          <span>Message — Test Case Constant</span>
          <textarea
            name="message" value={params.message} readOnly
            className="input-duo"
            rows="2"
            style={{ 
              backgroundColor: '#f3f4f6', 
              cursor: 'not-allowed', 
              color: '#6b7280',
              resize: 'none',
              paddingTop: '1rem',
              lineHeight: '1.5'
            }}
          />
        </label>
      </div>
    </div>
  );
}