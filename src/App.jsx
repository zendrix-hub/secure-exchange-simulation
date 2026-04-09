import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import Header from './components/Header';
import EnvironmentParams from './components/EnvironmentParams';
import UserCard from './components/UserCard';
import PublicChannel from './components/PublicChannel';
import ExecutionLog from './components/ExecutionLog';

export default function App() {
  const { params, simState, handleInputChange, startAutoSimulation } = useSimulation();

  const isUserAActive = simState.step >= 1 && simState.step <= 4;
  const isUserBActive = simState.step === 1 || simState.step >= 5;
  const isChannelActive = simState.step === 4;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans relative overflow-x-hidden p-4 md:p-8">
      <style>{`
        .glow { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.12; pointer-events: none; z-index: 0; }
        .glow-1 { top: -10%; right: -5%; width: 600px; height: 600px; background: #0ea5e9; }
        .glow-2 { bottom: -10%; left: -10%; width: 700px; height: 700px; background: #8b5cf6; }
        
        .terminal-scrollbar::-webkit-scrollbar { width: 6px; }
        .terminal-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 4px; }
        .terminal-scrollbar::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.3); border-radius: 4px; }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(56, 189, 248, 0.6); }

        .pulse-channel { animation: channelPulse 2s infinite; }
        @keyframes channelPulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); border-color: rgba(16, 185, 129, 0.8); }
          70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); border-color: rgba(16, 185, 129, 0.3); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); border-color: rgba(16, 185, 129, 0.8); }
        }

        .data-stream {
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent);
          background-size: 200% 100%;
          animation: dataStream 1.5s infinite linear;
        }
        @keyframes dataStream {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <EnvironmentParams
            params={params}
            simState={simState}
            handleInputChange={handleInputChange}
            startAutoSimulation={startAutoSimulation}
          />

          <UserCard
            role="sender"
            isActive={isUserAActive}
            paramKey="privA"
            params={params}
            handleInputChange={handleInputChange}
            simState={simState}
          />

          <PublicChannel
            isChannelActive={isChannelActive}
            fullPayloadHex={simState.data.fullPayloadHex}
          />

          <UserCard
            role="receiver"
            isActive={isUserBActive}
            paramKey="privB"
            params={params}
            handleInputChange={handleInputChange}
            simState={simState}
          />
        </div>

        <ExecutionLog simState={simState} />
      </div>
    </div>
  );
}