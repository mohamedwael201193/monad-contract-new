import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIGS } from '../config/web3.js';

export const useContractDeployment = (signer) => {
  const [deployedContracts, setDeployedContracts] = useState([]);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentCount, setDeploymentCount] = useState(0);

  // Deploy Counter contract
  const deployCounter = useCallback(async () => {
    if (!signer) {
      setDeploymentStatus({ type: 'error', message: 'Wallet not connected' });
      return null;
    }

    const config = CONTRACT_CONFIGS.Counter;
    if (!config) {
      setDeploymentStatus({ type: 'error', message: 'Counter contract configuration not found' });
      return null;
    }

    setIsDeploying(true);
    setDeploymentStatus({ type: 'pending', message: 'Preparing Counter contract deployment...' });

    try {
      console.log('Deploying Counter contract with args:', config.constructorArgs);

      // Create contract factory
      const factory = new ethers.ContractFactory(config.abi, config.bytecode, signer);
      
      // Estimate gas for deployment
      let estimatedGasLimit;
      try {
        const deployTx = await factory.getDeployTransaction(...config.constructorArgs);
        estimatedGasLimit = await signer.estimateGas(deployTx);
        console.log('Estimated gas for Counter deployment:', estimatedGasLimit.toString());
        // Add a buffer to the estimated gas
        estimatedGasLimit = estimatedGasLimit * 120n / 100n; // Add 20% buffer
        console.log('Adjusted gas limit with buffer:', estimatedGasLimit.toString());
      } catch (gasError) {
        console.warn('Failed to estimate gas for Counter deployment, using default. Error:', gasError);
        estimatedGasLimit = 3000000n; // Fallback to a reasonable default for Counter
      }

      setDeploymentStatus({ type: 'pending', message: 'Please confirm deployment in MetaMask...' });

      // Deploy the contract
      const contract = await factory.deploy(...config.constructorArgs, {
        gasLimit: estimatedGasLimit
      });

      setDeploymentStatus({ 
        type: 'pending', 
        message: 'Contract deployment submitted. Waiting for confirmation...',
        details: `Transaction hash: ${contract.deploymentTransaction().hash}`
      });

      // Wait for deployment to be mined
      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      console.log('Counter contract deployed at:', contractAddress);

      const newContract = {
        id: Date.now(),
        type: 'Counter',
        name: config.name,
        description: config.description,
        address: contractAddress,
        contract: contract,
        deployedAt: new Date().toISOString(),
        transactionHash: contract.deploymentTransaction().hash
      };

      setDeployedContracts(prev => [...prev, newContract]);
      setDeploymentCount(prev => prev + 1);
      setDeploymentStatus({ 
        type: 'success', 
        message: 'Counter contract deployed successfully!',
        details: `Address: ${contractAddress}`
      });

      return newContract;

    } catch (error) {
      console.error('Counter deployment failed:', error);
      setDeploymentStatus({ 
        type: 'error', 
        message: 'Counter deployment failed',
        details: error.message
      });
      return null;
    } finally {
      setIsDeploying(false);
    }
  }, [signer]);

  // Clear deployment status
  const clearStatus = useCallback(() => {
    setDeploymentStatus(null);
  }, []);

  return {
    deployedContracts,
    deploymentStatus,
    isDeploying,
    deploymentCount,
    deployCounter,
    clearStatus
  };
};

export default useContractDeployment;

