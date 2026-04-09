import React from 'react';
import { useSimulation } from './hooks/useSimulation';
import Header from './components/Header';
import EnvironmentParams from './components/EnvironmentParams';
import UserCard from './components/UserCard';
import PublicChannel from './components/PublicChannel';
import ExecutionLog from './components/ExecutionLog';

export default function App() {
  const { params, simState, handleInputChange, startSimulation } = useSimulation();

  const isUserAActive = simState.step >= 1 && simState.step <= 4;
  const isUserBActive = simState.step === 1 || simState.step >= 5;
  const isChannelActive = simState.step === 4;

  return (
    <div className="app-container">
      <Header />

      <div className="grid-layout">
        <EnvironmentParams 
          params={params} 
          simState={simState} 
          handleInputChange={handleInputChange} 
          startSimulation={startSimulation}
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
  );
}