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
    clearStatus
  } = useContractDeployment(signer);

  const {
    interactionStatus,
    isInteracting,
    interactionCount,
    incrementCounter,
    decrementCounter,
    resetCounter,
    clearInteractionStatus
  } = useContractInteraction(signer);

  // Auto-connect wallet on page load
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, [connectWallet]);

  // Update balance when account changes
  useEffect(() => {
    if (isConnected && account) {
      updateBalance();
    }
  }, [isConnected, account, updateBalance]);

  const handleDeployCounter = async () => {
    const result = await deployCounter();
    if (result && isConnected) {
      // Update balance after deployment
      setTimeout(() => updateBalance(), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

        {/* Wallet Error Alert */}
        {walletError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {walletError}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Wallet & Deployment */}
          <div className="lg:col-span-1 space-y-6">
            <WalletInfo
              account={account}
              balance={balance}
              isConnected={isConnected}
              isConnecting={isConnecting}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
            />

            <StatsCard
              deploymentCount={deploymentCount}
              interactionCount={interactionCount}
              contractsDeployed={deployedContracts.length}
            />

            <ContractDeployment
              onDeployCounter={handleDeployCounter}
              deploymentStatus={deploymentStatus}
              isDeploying={isDeploying}
              isConnected={isConnected}
              deploymentCount={deploymentCount}
            />
          </div>

          {/* Right Column - Deployed Contracts */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Deployed Contracts ({deployedContracts.length})
                </h2>
              </div>

              {deployedContracts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <div className="text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No contracts deployed yet</p>
                    <p className="text-sm">Deploy your first Counter contract to get started!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {deployedContracts.map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      onIncrement={() => incrementCounter(contract.contract)}
                      onDecrement={() => decrementCounter(contract.contract)}
                      onReset={() => resetCounter(contract.contract)}
                      interactionStatus={interactionStatus}
                      isInteracting={isInteracting}
                      isConnected={isConnected}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Built for Monad Testnet • Chain ID: 10143 • 
            <a 
              href="https://testnet-explorer.monad.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 ml-1"
            >
              Explorer
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

