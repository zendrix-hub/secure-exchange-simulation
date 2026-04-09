import React from 'react';
import { User, Shield } from 'lucide-react';

export default function UserCard({ role, isActive, paramKey, params, handleInputChange, simState }) {
  const isSender = role === 'sender';
  const Icon = isSender ? User : Shield;
  const title = isSender ? 'Alice' : 'Bob';
  
  const headerBg = isSender ? 'bg-orange-light text-orange' : 'bg-purple-light text-purple';
  const pubKey = isSender ? simState.data.pubA : simState.data.pubB;
  const sharedKey = isSender ? simState.data.sharedKey : simState.data.sharedB;

  return (
    <div className="card user-card" style={isActive ? { borderColor: '#38bdf8', transform: 'translateY(-4px)' } : {}}>
      <div className="card-header">
        <div className={`icon-wrapper ${headerBg}`}>
          <Icon size={32} strokeWidth={3} />
        </div>
        <h2 className="card-title">{title}</h2>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <label className="input-label">
          <span>Private Key</span>
          <input
            type="number" name={paramKey} value={params[paramKey]} onChange={handleInputChange}
            disabled={simState.isSimulating}
            className="input-duo"
            placeholder="Type key..."
          />
        </label>

        <div className="readonly-container" style={{ marginTop: '1rem' }}>
          <div className="readonly-row">
             <span className="readonly-label">Public</span>
             <span className="readonly-value text-sky">{pubKey !== undefined ? pubKey.toString() : '?'}</span>
          </div>
          <div className="readonly-row">
             <span className="readonly-label">Shared</span>
             <span className="readonly-value text-green">{sharedKey !== undefined ? sharedKey.toString() : '?'}</span>
          </div>
          <div className="readonly-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
             <span className="readonly-label" style={{ textAlign: 'center' }}>AES Key</span>
             <span className="readonly-value text-purple truncate" style={{ fontSize: '0.9rem', textAlign: 'center', backgroundColor: '#f3e8ff', color: '#a855f7', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
               {simState.data.aesKeyStr || '???'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}
