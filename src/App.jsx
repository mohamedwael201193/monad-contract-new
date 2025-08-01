import { useState, useEffect } from 'react';
import { useWeb3 } from './hooks/useWeb3.js';
import { useContractDeployment } from './hooks/useContractDeployment.js';
import { useContractInteraction } from './hooks/useContractInteraction.js';
import { WalletInfo } from './components/WalletInfo.jsx';
import { ContractDeployment } from './components/ContractDeployment.jsx';
import { ContractCard } from './components/ContractCard.jsx';
import { StatsCard } from './components/StatsCard.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { AlertCircle } from 'lucide-react';
import './App.css';

function App() {
  const {
    provider,
    signer,
    account,
    balance,
    isConnected,
    isConnecting,
    error: walletError,
    connectWallet,
    disconnectWallet,
    updateBalance
  } = useWeb3();

  const {
    deployedContracts,
    deploymentStatus,
    isDeploying,
    deploymentCount,
    deployCounter,
    deployMessageStorage,
    deploySimpleToken,
    removeContract,
    clearAllContracts
  } = useContractDeployment(signer);

  const {
    interactionStatus,
    isInteracting,
    interactionCount,
    incrementCounter,
    decrementCounter,
    resetCounter,
    setMessage,
    clearMessage,
    mintTokens,
    burnTokens,
    transferTokens,
    getContractState,
    updateContractState,
    refreshAllStates
  } = useContractInteraction(signer);

  // Update contract states when contracts are deployed
  useEffect(() => {
    if (deployedContracts.length > 0 && signer) {
      deployedContracts.forEach(contract => {
        updateContractState(contract);
      });
    }
  }, [deployedContracts, signer, updateContractState]);

  const handleRefreshAll = async () => {
    await refreshAllStates(deployedContracts);
  };

  const currentStatus = deploymentStatus || interactionStatus;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Monad Contract Deployer
          </h1>
          <p className="text-lg text-gray-600">
            Deploy and interact with smart contracts on Monad Testnet
          </p>
        </div>

        {/* Status Alert */}
        {currentStatus && (
          <div className="mb-6">
            <Alert variant={currentStatus.type === 'error' ? 'destructive' : 'default'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{currentStatus.message}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Wallet & Stats */}
          <div className="space-y-6">
            <WalletInfo
              account={account}
              balance={balance}
              isConnected={isConnected}
              isConnecting={isConnecting}
              error={walletError}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              onRefreshBalance={updateBalance}
            />
            
            <StatsCard
              deploymentCount={deploymentCount}
              interactionCount={interactionCount}
              deployedContracts={deployedContracts}
              onClearAll={clearAllContracts}
              onRefreshAll={handleRefreshAll}
            />
          </div>

          {/* Middle Column - Contract Deployment */}
          <div>
            <ContractDeployment
              onDeployCounter={deployCounter}
              onDeployMessageStorage={deployMessageStorage}
              onDeploySimpleToken={deploySimpleToken}
              deploymentStatus={deploymentStatus}
              isDeploying={isDeploying}
              isConnected={isConnected}
              deploymentCount={deploymentCount}
            />
          </div>

          {/* Right Column - Deployed Contracts */}
          <div className="space-y-6">
            {deployedContracts.length > 0 ? (
              <>
                <div className="text-lg font-semibold text-gray-900">
                  Deployed Contracts ({deployedContracts.length})
                </div>
                {deployedContracts.map((contract) => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    contractState={getContractState(contract.id)}
                    onIncrement={incrementCounter}
                    onDecrement={decrementCounter}
                    onReset={resetCounter}
                    onSetMessage={setMessage}
                    onClearMessage={clearMessage}
                    onMintTokens={mintTokens}
                    onBurnTokens={burnTokens}
                    onTransferTokens={transferTokens}
                    onRemove={removeContract}
                    onUpdateState={updateContractState}
                    isInteracting={isInteracting}
                    userAddress={account}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg font-medium mb-2">No contracts deployed</div>
                <div className="text-sm">
                  Deploy your first contract using the form on the left
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built with React + Vite + Tailwind CSS • Smart Contracts on Monad Testnet
          </p>
          <p className="mt-1">
            Connect your wallet and deploy contracts to get started!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

