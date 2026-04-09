import React from 'react';
import { Unlock, Lock } from 'lucide-react';

export default function UserCard({ role, isActive, paramKey, params, handleInputChange, simState }) {
  const isSender = role === 'sender';
  const Icon = isSender ? Unlock : Lock;
  const title = isSender ? 'Sender (User A)' : 'Receiver (User B)';
  const activeBorder = isSender ? 'border-sky-500/50 shadow-[0_0_30px_rgba(14,165,233,0.15)]' : 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]';
  const iconColor = isSender ? 'text-sky-400' : 'text-indigo-400';
  const pubKey = isSender ? simState.data.pubA : simState.data.pubB;
  const sharedKey = isSender ? simState.data.sharedKey : simState.data.sharedB;
  const privKeyLabel = isSender ? 'Private Key (a)' : 'Private Key (b)';

  return (
    <div className={`lg:col-span-4 bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-6 shadow-2xl transition-all duration-500 ${isActive ? activeBorder : 'border-slate-700/50'}`}>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-100">
        <Icon className={`w-5 h-5 ${isActive ? iconColor : 'text-slate-500'}`} /> {title}
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-400 uppercase tracking-wider font-semibold">{privKeyLabel}</label>
          <input
            type="number" name={paramKey} value={params[paramKey]} onChange={handleInputChange} disabled={simState.isSimulating}
            className={`w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 font-mono outline-none transition-all disabled:opacity-50 ${isSender ? 'focus:border-sky-500' : 'focus:border-indigo-500'}`}
          />
        </div>
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Public Value:</span>
            <span className="font-mono text-sky-300">{pubKey !== undefined ? pubKey.toString() : '---'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Shared Key:</span>
            <span className="font-mono text-indigo-300">{sharedKey !== undefined ? sharedKey.toString() : '---'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">AES Key:</span>
            <span className="font-mono text-fuchsia-300 truncate w-32 text-right">{simState.data.aesKeyStr || '---'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
