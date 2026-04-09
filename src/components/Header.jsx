import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-center mb-6 mt-4 flex flex-col items-center">
      <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-[24px] rounded-br-[8px] mb-4 text-green-500 shadow-sm border-2 border-green-200">
        <ShieldCheck className="w-12 h-12" strokeWidth={3} />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
        Secure Exchange
      </h1>
      <p className="text-gray-500 font-bold max-w-lg mx-auto text-lg leading-relaxed">
        Let's learn how Diffie-Hellman & AES encryption work together to protect secrets!
      </p>
    </header>
  );
}
