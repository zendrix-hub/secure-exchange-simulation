import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Activity, ArrowRightLeft, Key, FileText, Radio, TerminalSquare } from 'lucide-react';

export default function ExecutionLog({ simState }) {
  const stepRefs = {
    1: useRef(null), 2: useRef(null), 3: useRef(null),
    4: useRef(null), 5: useRef(null)
  };

  useEffect(() => {
    if (simState.step > 0 && simState.step <= 5) {
      const el = stepRefs[simState.step].current;
      if (el) {
        // Auto scroll to active step
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [simState.step, simState.logs]);

  const steps = [
    { id: 1, icon: ArrowRightLeft, title: "Diffie-Hellman Key Exchange", color: "sky" },
    { id: 2, icon: Key, title: "AES-128 Key Transformation", color: "fuchsia" },
    { id: 3, icon: FileText, title: "Message Chunking & Padding", color: "amber" },
    { id: 4, icon: Radio, title: "Encryption & Transmission", color: "emerald" },
    { id: 5, icon: TerminalSquare, title: "Decryption & Reconstruction", color: "indigo" }
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <Activity className="w-6 h-6 text-sky-400" /> Execution Log
      </h2>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[2.25rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
        {steps.map(s => {
          const isActive = simState.step === s.id;
          const isCompleted = simState.step > s.id;
          const hasStarted = simState.step >= s.id;
          const Icon = s.icon;

          let ringColor = "border-slate-700 bg-slate-800 text-slate-500";
          if (isActive) ringColor = `border-${s.color}-500 bg-${s.color}-900/50 text-${s.color}-400 shadow-[0_0_15px_rgba(var(--tw-colors-${s.color}-500),0.5)] animate-pulse`;
          if (isCompleted) ringColor = `border-${s.color}-500 bg-${s.color}-500 text-white`;

          return (
            <div key={s.id} className={`relative flex items-start group ${!hasStarted ? 'opacity-40' : ''}`} ref={stepRefs[s.id]}>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${ringColor}`}>
                {isCompleted ? <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-5 h-5 md:w-6 md:h-6" />}
              </div>
              <div className="ml-4 md:ml-6 flex-1 min-w-0">
                <h3 className={`text-lg font-bold mb-2 ${isActive ? `text-${s.color}-400` : 'text-slate-200'}`}>
                  {s.title} {isActive && <span className="inline-block ml-2 w-2 h-2 rounded-full bg-current animate-ping"></span>}
                </h3>

                <div className={`transition-all duration-500 overflow-hidden rounded-xl border border-slate-700/50 bg-[#0a0f1c] ${hasStarted ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 border-transparent'}`}>
                  <div className="p-4 font-mono text-sm terminal-scrollbar overflow-y-auto max-h-60">
                    {simState.logs[s.id]?.length === 0 && isActive && (
                      <span className="text-slate-500 italic">Processing payload...</span>
                    )}
                    {simState.logs[s.id]?.map((log, i) => (
                      <div key={i} className="text-slate-300 leading-relaxed break-all flex">
                        <span className={`text-${s.color}-500 mr-2 select-none`}>❯</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
