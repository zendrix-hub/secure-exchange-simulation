import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-center mb-10 mt-6">
      <div className="inline-flex items-center justify-center p-3 bg-sky-500/10 rounded-2xl mb-4 border border-sky-500/20">
        <ShieldCheck className="w-8 h-8 text-sky-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400 mb-4">
        Secure Exchange Protocol
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto text-lg">
        Automated simulation of Diffie-Hellman key exchange and AES-128 symmetric encryption.
      </p>
    </header>
  );
}
