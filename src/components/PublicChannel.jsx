import React from 'react';
import { Wifi } from 'lucide-react';

export default function PublicChannel({ isChannelActive, encryptedHexChunks = [] }) {
  return (
    <div className={`lg:col-span-4 rounded-3xl border-2 flex flex-col transition-all duration-300 relative overflow-hidden ${isChannelActive ? 'border-amber-400 bg-amber-50 transform -translate-y-1 shadow-[0_8px_0_rgba(251,191,36,0.2)]' : 'border-gray-200 bg-white border-b-[6px]'}`}>
      <div className="p-6 flex flex-col h-full place-items-center justify-start text-center">
        
        <div className={`p-4 rounded-3xl rounded-tr-md mb-4 inline-flex border-2 ${isChannelActive ? 'bg-amber-100 text-amber-500 border-amber-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
           <Wifi className={`w-8 h-8 ${isChannelActive ? 'animate-pulse' : ''}`} strokeWidth={3} />
        </div>
        
        <h2 className="text-xl font-black text-gray-800 mb-6 tracking-tight">The Internet</h2>

        <div className="w-full flex-1 border-[3px] border-dashed border-gray-300 rounded-2xl bg-white p-4 flex flex-col items-center justify-center overflow-hidden">
          {encryptedHexChunks.length === 0 ? (
            <div className="text-gray-400 font-extrabold uppercase tracking-widest text-sm flex gap-2 items-center">
              Awaiting data...
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 gap-3 overflow-y-auto max-h-[220px] pr-2">
              {encryptedHexChunks.map((chunk, idx) => (
                <div
                  key={idx}
                  className="bg-sky-50 border-2 border-b-[4px] border-sky-300 rounded-2xl p-3 flex flex-col items-center transform transition-transform"
                >
                  <span className="text-[11px] text-sky-500 font-black tracking-widest uppercase mb-1">
                    Package {idx + 1}
                  </span>
                  <span className="font-extrabold text-sm text-sky-800 tracking-widest">
                    {chunk.match(/.{1,4}/g).join(' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}