import React from 'react';
import { Cpu, Play, RotateCcw } from 'lucide-react';

export default function EnvironmentParams({ params, simState, handleInputChange, startAutoSimulation }) {
  return (
    <div className="lg:col-span-12 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-100">
          <Cpu className="w-5 h-5 text-indigo-400" /> Environment Parameters
        </h2>
        <div className="flex gap-3">
          <button
            onClick={startAutoSimulation}
            disabled={simState.isSimulating}
            className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] disabled:shadow-none"
          >
            {simState.step > 0 && !simState.isSimulating ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {simState.isSimulating ? "Simulating..." : simState.step > 0 ? "Restart Auth" : "Start Auto-Simulation"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Prime Modulus (p)</label>
          <input
            type="number" name="p" value={params.p} onChange={handleInputChange} disabled={simState.isSimulating}
            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sky-300 font-mono focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Generator (g)</label>
          <input
            type="number" name="g" value={params.g} onChange={handleInputChange} disabled={simState.isSimulating}
            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-sky-300 font-mono focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Secret Payload</label>
          <input
            type="text" name="message" value={params.message} onChange={handleInputChange} disabled={simState.isSimulating}
            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-emerald-300 font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
