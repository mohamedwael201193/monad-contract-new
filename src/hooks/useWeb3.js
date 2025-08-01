import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { MONAD_TESTNET_CONFIG } from '../config/web3.js';

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }, []);

  // Format balance for display
  const formatBalance = useCallback((balance) => {
    try {
      const balanceInEth = ethers.formatEther(balance);
      return parseFloat(balanceInEth).toFixed(4);
    } catch (error) {
      console.error('Error formatting balance:', error);
      return '0.0000';
    }
  }, []);

  // Get user balance
  const updateBalance = useCallback(async (address, provider) => {
    if (!address || !provider) return;
    
    try {
      const balance = await provider.getBalance(address);
      setBalance(formatBalance(balance));
    } catch (error) {
      console.error('Error getting balance:', error);
      setBalance('0.0000');
    }
  }, [formatBalance]);

  // Switch to Monad Testnet
  const switchToMonadTestnet = useCallback(async () => {
    if (!window.ethereum) return false;

    try {
      // Try to switch to Monad Testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${MONAD_TESTNET_CONFIG.chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${MONAD_TESTNET_CONFIG.chainId.toString(16)}`,
                chainName: MONAD_TESTNET_CONFIG.name,
                nativeCurrency: {
                  name: MONAD_TESTNET_CONFIG.currency,
                  symbol: MONAD_TESTNET_CONFIG.currency,
                  decimals: 18,
                },
                rpcUrls: [MONAD_TESTNET_CONFIG.rpcUrl],
                blockExplorerUrls: [MONAD_TESTNET_CONFIG.explorerUrl],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Monad Testnet:', addError);
          setError('Failed to add Monad Testnet to MetaMask');
          return false;
        }
      } else {
        console.error('Error switching to Monad Testnet:', switchError);
        setError('Failed to switch to Monad Testnet');
        return false;
      }
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      // Check if we're on Monad Testnet
      if (Number(network.chainId) !== MONAD_TESTNET_CONFIG.chainId) {
        const switched = await switchToMonadTestnet();
        if (!switched) {
          throw new Error('Please switch to Monad Testnet');
        }
        // Refresh provider after network switch
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        setProvider(newProvider);
        setSigner(newSigner);
      } else {
        setProvider(provider);
        setSigner(signer);
      }

      const address = accounts[0];
      setAccount(address);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Update balance
      await updateBalance(address, provider);

      console.log('Wallet connected:', address);
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskInstalled, switchToMonadTestnet, updateBalance]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setBalance('0');
    setIsConnected(false);
    setChainId(null);
    setError(null);
    console.log('Wallet disconnected');
  }, []);

  // Handle account changes
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      if (provider) {
        updateBalance(accounts[0], provider);
      }
    }
  }, [account, provider, updateBalance, disconnectWallet]);

  // Handle chain changes
  const handleChainChanged = useCallback((chainId) => {
    const newChainId = parseInt(chainId, 16);
    setChainId(newChainId);
    
    if (newChainId !== MONAD_TESTNET_CONFIG.chainId) {
      setError('Please switch to Monad Testnet');
    } else {
      setError(null);
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged, isMetaMaskInstalled]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          
          if (Number(network.chainId) === MONAD_TESTNET_CONFIG.chainId) {
            const signer = await provider.getSigner();
            setProvider(provider);
            setSigner(signer);
            setAccount(accounts[0]);
            setChainId(Number(network.chainId));
            setIsConnected(true);
            await updateBalance(accounts[0], provider);
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, [isMetaMaskInstalled, updateBalance]);

  // Refresh balance periodically
  useEffect(() => {
    if (!isConnected || !account || !provider) return;

    const interval = setInterval(() => {
      updateBalance(account, provider);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isConnected, account, provider, updateBalance]);

  return {
    provider,
    signer,
    account,
    balance,
    isConnected,
    isConnecting,
    chainId,
    error,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connectWallet,
    disconnectWallet,
    switchToMonadTestnet,
    updateBalance: () => updateBalance(account, provider)
  };
};

