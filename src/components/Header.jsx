import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header style={{ textAlign: 'center', marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="icon-wrapper bg-green-light text-green" style={{ marginBottom: '1.5rem' }}>
        <ShieldCheck size={48} strokeWidth={3} />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#1f2937', margin: '0 0 1rem 0' }}>
        Secure Exchange
      </h1>
      <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
        Let's learn how Diffie-Hellman & AES encryption work together to protect secrets!
      </p>
    </header>
  );
}