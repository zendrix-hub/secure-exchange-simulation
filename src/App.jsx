import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import Header from './components/Header';
import EnvironmentParams from './components/EnvironmentParams';
import UserCard from './components/UserCard';
import PublicChannel from './components/PublicChannel';
import ExecutionLog from './components/ExecutionLog';

export default function App() {
  const { params, simState, handleInputChange } = useSimulation();

  const isUserAActive = simState.step >= 1 && simState.step <= 4;
  const isUserBActive = simState.step === 1 || simState.step >= 5;
  const isChannelActive = simState.step === 4;

  return (
    <div className="min-h-screen bg-white text-gray-700 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto relative z-10">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 mt-8">
          <EnvironmentParams
            params={params}
            simState={simState}
            handleInputChange={handleInputChange}
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
            encryptedHexChunks={simState.data.encryptedHexChunks || []}
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