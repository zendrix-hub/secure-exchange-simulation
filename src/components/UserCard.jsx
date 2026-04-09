import React from 'react';
import { User, Shield } from 'lucide-react';

export default function UserCard({ role, isActive, paramKey, params, handleInputChange, simState }) {
  const isSender = role === 'sender';
  const Icon = isSender ? User : Shield;
  const title = isSender ? 'Alice' : 'Bob';
  
  const activeBorder = isActive ? 'border-sky-400 shadow-[0_8px_0_rgba(56,189,248,0.2)] transform -translate-y-1' : 'border-gray-200 border-b-[6px]';
  const headerBg = isSender ? 'bg-orange-100 text-orange-500 border-2 border-orange-200' : 'bg-purple-100 text-purple-500 border-2 border-purple-200';
  const pubKey = isSender ? simState.data.pubA : simState.data.pubB;
  const sharedKey = isSender ? simState.data.sharedKey : simState.data.sharedB;

  return (
    <div className={`lg:col-span-4 bg-white rounded-3xl border-2 transition-all duration-300 p-6 flex flex-col ${activeBorder}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-4 rounded-[20px] rounded-bl-[6px] ${headerBg}`}>
          <Icon className="w-8 h-8" strokeWidth={3} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h2>
      </div>
      
      <div className="space-y-6 flex-1">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-extrabold text-gray-400 uppercase tracking-widest pl-2">Private Key</span>
          <input
            type="number" name={paramKey} value={params[paramKey]} onChange={handleInputChange}
            disabled={simState.isSimulating}
            className="input-duo"
            placeholder="Type key..."
          />
        </label>

        <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 space-y-3 font-semibold text-gray-600 mt-4 h-full relative overflow-hidden">
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border-2 border-gray-100">
             <span className="text-xs text-gray-400 uppercase font-black tracking-widest">Public</span>
             <span className="text-sky-500 font-black text-lg">{pubKey !== undefined ? pubKey.toString() : '?'}</span>
          </div>
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border-2 border-gray-100">
             <span className="text-xs text-gray-400 uppercase font-black tracking-widest">Shared</span>
             <span className="text-green-500 font-black text-lg">{sharedKey !== undefined ? sharedKey.toString() : '?'}</span>
          </div>
          <div className="flex flex-col gap-1 bg-white p-3 rounded-xl border-2 border-gray-100">
             <span className="text-xs text-gray-400 uppercase font-black tracking-widest text-center mb-1">AES Key</span>
             <span className="text-purple-500 font-black truncate text-center bg-purple-50 rounded-lg py-1 px-2 border border-purple-100">{simState.data.aesKeyStr || '???'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
