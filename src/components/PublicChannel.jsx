import React from 'react';
import { Wifi } from 'lucide-react';

export default function PublicChannel({ isChannelActive, encryptedHexChunks = [] }) {
  return (
    <div className="card channel-card" style={isChannelActive ? { borderColor: '#f59e0b', backgroundColor: '#fffbeb', transform: 'translateY(-4px)' } : {}}>
      <div className={`icon-wrapper ${isChannelActive ? 'bg-amber-light text-amber' : ''}`} style={{ alignSelf: 'center', marginBottom: '1rem', backgroundColor: !isChannelActive ? '#f3f4f6' : undefined, color: !isChannelActive ? '#9ca3af' : undefined }}>
         <Wifi size={32} className={isChannelActive ? 'animate-pulse' : ''} strokeWidth={3} />
      </div>
      
      <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>The Internet</h2>

      <div className="channel-box">
        {encryptedHexChunks.length === 0 ? (
          <div style={{ color: '#9ca3af', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Awaiting data...
          </div>
        ) : (
          <div style={{ width: '100%', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {encryptedHexChunks.map((chunk, idx) => (
              <div key={idx} className="package-item">
                <span style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  Package {idx + 1}
                </span>
                <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0369a1', letterSpacing: '0.05em' }}>
                  {chunk.match(/.{1,4}/g).join(' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}