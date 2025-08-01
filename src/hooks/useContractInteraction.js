import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

export const useContractInteraction = (signer) => {
  const [interactionStatus, setInteractionStatus] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [contractStates, setContractStates] = useState({});

  // Generic contract interaction function
  const interactWithContract = useCallback(async (contractInfo, functionName, args = [], value = null) => {
    if (!signer || !contractInfo) {
      setInteractionStatus({ type: 'error', message: 'Wallet not connected or contract not found' });
      return null;
    }

    setIsInteracting(true);
    setInteractionStatus({ type: 'pending', message: `Calling ${functionName}...` });

    try {
      // Create contract instance
      const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
      
      console.log(`Calling ${functionName} on contract ${contractInfo.address} with args:`, args);

      setInteractionStatus({ type: 'pending', message: 'Please confirm transaction in MetaMask...' });

      // Prepare transaction options
      const txOptions = {
        gasLimit: 500000 // Set a reasonable gas limit
      };

      if (value) {
        txOptions.value = ethers.parseEther(value.toString());
      }

      // Call contract function
      const tx = await contract[functionName](...args, txOptions);
      
      setInteractionStatus({ 
        type: 'pending', 
        message: `Transaction submitted: ${tx.hash.slice(0, 10)}...` 
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      console.log(`${functionName} transaction confirmed:`, receipt);

      if (receipt.status === 1) {
        setInteractionStatus({ 
          type: 'success', 
          message: `${functionName} executed successfully!` 
        });
        
        // Increment interaction count
        setInteractionCount(prev => prev + 1);

        // Update contract state after successful interaction
        await updateContractState(contractInfo);

        return receipt;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error(`${functionName} failed:`, error);
      
      let errorMessage = `${functionName} failed`;
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction';
      } else if (error.message.includes('user rejected') || error.message.includes('User denied')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('gas')) {
        errorMessage = 'Gas estimation failed. Please try again.';
      } else if (error.message.includes('revert')) {
        // Extract revert reason if available
        const revertMatch = error.message.match(/revert (.+)/);
        if (revertMatch) {
          errorMessage = `Transaction reverted: ${revertMatch[1]}`;
        } else {
          errorMessage = 'Transaction reverted';
        }
      }

      setInteractionStatus({ type: 'error', message: errorMessage });
      return null;
    } finally {
      setIsInteracting(false);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setInteractionStatus(null);
      }, 5000);
    }
  }, [signer]);

  // Update contract state by reading current values
  const updateContractState = useCallback(async (contractInfo) => {
    if (!signer || !contractInfo) return;

    try {
      const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, signer);
      const state = {};

      // Read state based on contract type
      switch (contractInfo.type) {
        case 'Counter':
          try {
            state.count = await contract.count();
            state.owner = await contract.owner();
          } catch (error) {
            console.error('Error reading Counter state:', error);
          }
          break;

        case 'MessageStorage':
          try {
            state.message = await contract.message();
            state.messageCount = await contract.messageCount();
            state.owner = await contract.owner();
          } catch (error) {
            console.error('Error reading MessageStorage state:', error);
          }
          break;

        case 'SimpleToken':
          try {
            state.name = await contract.name();
            state.symbol = await contract.symbol();
            state.decimals = await contract.decimals();
            state.totalSupply = await contract.totalSupply();
            state.owner = await contract.owner();
            // Get user's balance
            const userAddress = await signer.getAddress();
            state.userBalance = await contract.balanceOf(userAddress);
          } catch (error) {
            console.error('Error reading SimpleToken state:', error);
          }
          break;
      }

      setContractStates(prev => ({
        ...prev,
        [contractInfo.id]: state
      }));
    } catch (error) {
      console.error('Error updating contract state:', error);
    }
  }, [signer]);

  // Counter contract interactions
  const incrementCounter = useCallback(async (contractInfo) => {
    return await interactWithContract(contractInfo, 'increment');
  }, [interactWithContract]);

  const decrementCounter = useCallback(async (contractInfo) => {
    return await interactWithContract(contractInfo, 'decrement');
  }, [interactWithContract]);

  const resetCounter = useCallback(async (contractInfo) => {
    return await interactWithContract(contractInfo, 'reset');
  }, [interactWithContract]);

  // MessageStorage contract interactions
  const setMessage = useCallback(async (contractInfo, message) => {
    return await interactWithContract(contractInfo, 'setMessage', [message]);
  }, [interactWithContract]);

  const clearMessage = useCallback(async (contractInfo) => {
    return await interactWithContract(contractInfo, 'clearMessage');
  }, [interactWithContract]);

  // SimpleToken contract interactions
  const mintTokens = useCallback(async (contractInfo, to, amount) => {
    return await interactWithContract(contractInfo, 'mint', [to, ethers.parseUnits(amount.toString(), 18)]);
  }, [interactWithContract]);

  const burnTokens = useCallback(async (contractInfo, amount) => {
    return await interactWithContract(contractInfo, 'burn', [ethers.parseUnits(amount.toString(), 18)]);
  }, [interactWithContract]);

  const transferTokens = useCallback(async (contractInfo, to, amount) => {
    return await interactWithContract(contractInfo, 'transfer', [to, ethers.parseUnits(amount.toString(), 18)]);
  }, [interactWithContract]);

  // Get contract state
  const getContractState = useCallback((contractId) => {
    return contractStates[contractId] || {};
  }, [contractStates]);

  // Refresh all contract states
  const refreshAllStates = useCallback(async (contracts) => {
    for (const contract of contracts) {
      await updateContractState(contract);
    }
  }, [updateContractState]);

  return {
    interactionStatus,
    isInteracting,
    interactionCount,
    contractStates,
    interactWithContract,
    updateContractState,
    incrementCounter,
    decrementCounter,
    resetCounter,
    setMessage,
    clearMessage,
    mintTokens,
    burnTokens,
    transferTokens,
    getContractState,
    refreshAllStates
  };
};

