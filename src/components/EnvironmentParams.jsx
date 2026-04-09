import React from 'react';
import { Settings, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function EnvironmentParams({ params, simState, handleInputChange }) {
  const isReady = params.p && params.g && params.privA && params.privB && params.message;

  return (
    <div className="lg:col-span-12 card-duo p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-extrabold flex items-center gap-3 text-gray-800">
          <div className="p-2 bg-blue-100 text-blue-500 border-2 border-blue-200 rounded-xl">
            <Settings className="w-6 h-6" strokeWidth={3} />
          </div>
          Environment Rules
        </h2>

        <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-[3px] font-black tracking-wide ${
          simState.isSimulating ? 'bg-sky-50 border-sky-200 text-sky-500' : 
          isReady ? 'bg-green-50 border-green-200 text-green-500' : 'bg-gray-50 border-gray-200 text-gray-400'
        }`}>
          {simState.isSimulating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
              <span>Checking...</span>
            </>
          ) : isReady ? (
            <>
              <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
              <span>Perfect!</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" strokeWidth={3} />
              <span>Fill blanks</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-extrabold text-gray-400 uppercase tracking-widest pl-2">Prime (p)</span>
          <input
            type="number" name="p" value={params.p} onChange={handleInputChange} disabled={simState.isSimulating}
            className="input-duo" placeholder="Enter Prime..."
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-extrabold text-gray-400 uppercase tracking-widest pl-2">Generator (g)</span>
          <input
            type="number" name="g" value={params.g} onChange={handleInputChange} disabled={simState.isSimulating}
            className="input-duo" placeholder="Enter Generator..."
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-extrabold text-gray-400 uppercase tracking-widest pl-2">Message</span>
          <input
            type="text" name="message" value={params.message} onChange={handleInputChange} disabled={simState.isSimulating}
            className="input-duo" placeholder="Write something secret..."
          />
        </label>
      </div>
    </div>
  );
}