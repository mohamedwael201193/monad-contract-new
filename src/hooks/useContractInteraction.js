import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

export const useContractInteraction = (signer) => {
  const [interactionStatus, setInteractionStatus] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  // Generic contract interaction function
  const interactWithContract = useCallback(async (contract, functionName, args = []) => {
    if (!signer || !contract) {
      setInteractionStatus({ type: 'error', message: 'Wallet not connected or contract not found' });
      return null;
    }

    setIsInteracting(true);
    setInteractionStatus({ type: 'pending', message: `Calling ${functionName}...` });

    try {
      console.log(`Calling ${functionName} on contract with args:`, args);

      setInteractionStatus({ type: 'pending', message: 'Please confirm transaction in MetaMask...' });

      // Prepare transaction options
      const txOptions = {
        gasLimit: 300000 // Set a reasonable gas limit for Counter operations
      };

      // Call contract function
      const tx = await contract[functionName](...args, txOptions);
      
      setInteractionStatus({ 
        type: 'pending', 
        message: `Transaction submitted. Waiting for confirmation...`,
        details: `Hash: ${tx.hash.slice(0, 10)}...`
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      console.log(`${functionName} transaction confirmed:`, receipt);

      if (receipt.status === 1) {
        setInteractionCount(prev => prev + 1);
        setInteractionStatus({ 
          type: 'success', 
          message: `${functionName} executed successfully!`,
          details: `Gas used: ${receipt.gasUsed.toString()}`
        });
        return receipt;
      } else {
        setInteractionStatus({ 
          type: 'error', 
          message: `${functionName} transaction failed`,
          details: 'Transaction was reverted'
        });
        return null;
      }

    } catch (error) {
      console.error(`${functionName} failed:`, error);
      
      let errorMessage = `${functionName} failed`;
      let errorDetails = error.message;

      // Handle specific error types
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction rejected by user';
        errorDetails = 'You cancelled the transaction in MetaMask';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds';
        errorDetails = 'Not enough MON to pay for gas fees';
      } else if (error.message.includes('gas')) {
        errorMessage = 'Gas estimation failed';
        errorDetails = 'Try increasing gas limit or check contract state';
      }

      setInteractionStatus({ 
        type: 'error', 
        message: errorMessage,
        details: errorDetails
      });
      return null;
    } finally {
      setIsInteracting(false);
    }
  }, [signer]);

  // Counter-specific functions
  const incrementCounter = useCallback(async (contract) => {
    return await interactWithContract(contract, 'increment');
  }, [interactWithContract]);

  const decrementCounter = useCallback(async (contract) => {
    return await interactWithContract(contract, 'decrement');
  }, [interactWithContract]);

  const resetCounter = useCallback(async (contract) => {
    return await interactWithContract(contract, 'reset');
  }, [interactWithContract]);

  // Clear interaction status
  const clearInteractionStatus = useCallback(() => {
    setInteractionStatus(null);
  }, []);

  return {
    interactionStatus,
    isInteracting,
    interactionCount,
    incrementCounter,
    decrementCounter,
    resetCounter,
    clearInteractionStatus
  };
};

export default useContractInteraction;

