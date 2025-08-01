import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIGS } from '../config/web3.js';

export const useContractDeployment = (signer) => {
  const [deployedContracts, setDeployedContracts] = useState([]);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentCount, setDeploymentCount] = useState(0);

  // Deploy a contract
  const deployContract = useCallback(async (contractType, customArgs = null) => {
    if (!signer) {
      setDeploymentStatus({ type: 'error', message: 'Wallet not connected' });
      return null;
    }

    const config = CONTRACT_CONFIGS[contractType];
    if (!config) {
      setDeploymentStatus({ type: 'error', message: 'Invalid contract type' });
      return null;
    }

    setIsDeploying(true);
    setDeploymentStatus({ type: 'pending', message: 'Preparing contract deployment...' });

    try {
      // Use custom args if provided, otherwise use default constructor args
      const finalConstructorArgs = customArgs !== null ? customArgs : config.constructorArgs;
      
      console.log(`Deploying ${contractType} contract with final args:`, finalConstructorArgs);

      // Create contract factory
      const factory = new ethers.ContractFactory(config.abi, config.bytecode, signer);
      
      setDeploymentStatus({ type: 'pending', message: 'Please confirm deployment in MetaMask...' });

      // Deploy contract
      const contract = await factory.deploy(...finalConstructorArgs, {
        gasLimit: 2000000 // Set a reasonable gas limit
      });

      setDeploymentStatus({ 
        type: 'pending', 
        message: `Deployment submitted: ${contract.target.slice(0, 10)}...` 
      });

      // Wait for deployment
      await contract.waitForDeployment();
      
      console.log(`${contractType} deployed at:`, contract.target);

      // Create contract info object
      const contractInfo = {
        id: Date.now().toString(),
        type: contractType,
        name: config.name,
        description: config.description,
        address: contract.target,
        abi: config.abi,
        deployedAt: new Date().toISOString(),
        constructorArgs,
        contract: contract
      };

      // Add to deployed contracts list
      setDeployedContracts(prev => [...prev, contractInfo]);
      setDeploymentCount(prev => prev + 1);

      setDeploymentStatus({ 
        type: 'success', 
        message: `${contractType} deployed successfully!` 
      });

      return contractInfo;
    } catch (error) {
      console.error('Contract deployment failed:', error);
      
      let errorMessage = 'Deployment failed';
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = 'Deployment rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for deployment';
      } else if (error.message.includes('user rejected') || error.message.includes('User denied')) {
        errorMessage = 'Deployment rejected by user';
      } else if (error.message.includes('gas')) {
        errorMessage = 'Gas estimation failed. Please try again.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setDeploymentStatus({ type: 'error', message: errorMessage });
      return null;
    } finally {
      setIsDeploying(false);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setDeploymentStatus(null);
      }, 5000);
    }
  }, [signer]);

  // Deploy Counter contract
  const deployCounter = useCallback(async () => {
    return await deployContract('Counter');
  }, [deployContract]);

  // Deploy MessageStorage contract
  const deployMessageStorage = useCallback(async (initialMessage = 'Hello, Monad!') => {
    return await deployContract('MessageStorage', [initialMessage]);
  }, [deployContract]);

  // Deploy SimpleToken contract
  const deploySimpleToken = useCallback(async (name = 'MyToken', symbol = 'MTK', decimals = 18, initialSupply = 1000) => {
    return await deployContract('SimpleToken', [name, symbol, decimals, initialSupply]);
  }, [deployContract]);

  // Remove a deployed contract from the list
  const removeContract = useCallback((contractId) => {
    setDeployedContracts(prev => prev.filter(contract => contract.id !== contractId));
  }, []);

  // Clear all deployed contracts
  const clearAllContracts = useCallback(() => {
    setDeployedContracts([]);
    setDeploymentCount(0);
  }, []);

  // Get contract by ID
  const getContract = useCallback((contractId) => {
    return deployedContracts.find(contract => contract.id === contractId);
  }, [deployedContracts]);

  // Get contracts by type
  const getContractsByType = useCallback((contractType) => {
    return deployedContracts.filter(contract => contract.type === contractType);
  }, [deployedContracts]);

  return {
    deployedContracts,
    deploymentStatus,
    isDeploying,
    deploymentCount,
    deployContract,
    deployCounter,
    deployMessageStorage,
    deploySimpleToken,
    removeContract,
    clearAllContracts,
    getContract,
    getContractsByType
  };
};

