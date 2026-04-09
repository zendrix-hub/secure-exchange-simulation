import React from 'react';
import { Radio } from 'lucide-react';

export default function PublicChannel({ isChannelActive, fullPayloadHex }) {
  return (
    <div className={`lg:col-span-4 bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-6 shadow-2xl flex flex-col transition-all duration-500 ${isChannelActive ? 'pulse-channel' : 'border-slate-700/50'}`}>
      <h2 className="text-xl font-semibold flex items-center justify-center gap-2 mb-6 text-slate-100">
        <Radio className={`w-5 h-5 ${isChannelActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} /> Public Channel
      </h2>
      <div className={`flex-1 flex items-center justify-center rounded-xl border border-dashed ${isChannelActive ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-700 bg-slate-950/50'} p-4 text-center relative overflow-hidden`}>
        {isChannelActive && <div className="absolute inset-0 data-stream opacity-50"></div>}
        <div className={`font-mono text-sm break-all relative z-10 transition-colors duration-300 ${fullPayloadHex ? 'text-emerald-400' : 'text-slate-500'}`}>
          {fullPayloadHex || 'Awaiting transmission...'}
        </div>
      </div>
    </div>
  );
}
