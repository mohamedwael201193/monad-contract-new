import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Wallet, Plus, Activity, Coins, MessageSquare, Hash } from 'lucide-react';
import { COUNTER_ABI, MESSAGE_STORAGE_ABI, SIMPLE_TOKEN_ABI } from './contracts/contractABIs';

// Monad Testnet configuration
const MONAD_TESTNET = {
  chainId: '0x29a', // 666 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet1.monad.xyz'],
  blockExplorerUrls: ['https://testnet1.monad.xyz'],
};

function App() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [deployedContracts, setDeployedContracts] = useState([]);
  const [contractsDeployed, setContractsDeployed] = useState(0);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Switch to Monad Testnet
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: MONAD_TESTNET.chainId }],
        });
      } catch (switchError) {
        // If the chain doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET],
          });
        } else {
          throw switchError;
        }
      }

      // Set up provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      
      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);

      // Get balance
      const balance = await web3Provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(balance));

    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount('');
    setBalance('0');
    setProvider(null);
    setSigner(null);
    setDeployedContracts([]);
    setError('');
  };

  // Deploy contract
  const deployContract = async (contractType, params = {}) => {
    if (!signer) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setError('');
      let factory;
      let contractArgs = [];

      switch (contractType) {
        case 'Counter':
          // Simple bytecode for Counter contract
          const counterBytecode = "0x608060405234801561001057600080fd5b50600080556001805433600160a01b0260a01b60ff60a01b19909116179055610267806100406000396000f3fe";
          factory = new ethers.ContractFactory(COUNTER_ABI, counterBytecode, signer);
          break;
        case 'MessageStorage':
          const messageBytecode = "0x608060405234801561001057600080fd5b506040516107a83803806107a8833981810160405281019061003291906101c2565b80600090805190602001906100489291906100a3565b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600281905550506101f3565b8280546100af906101c2565b90600052602060002090601f0160209004810192826100d15760008555610118565b82601f106100ea57805160ff1916838001178555610118565b82800160010185558215610118579182015b828111156101175782518255916020019190600101906100fc565b5b5090506101259190610129565b5090565b5b8082111561014257600081600090555060010161012a565b5090565b600061015961015483610208565b6101e3565b90508281526020810184848401111561017157600080fd5b61017c848285610239565b509392505050565b60008151905061019381610279565b92915050565b600082601f8301126101aa57600080fd5b81516101ba848260208601610146565b91505092915050565b6000602082840312156101d557600080fd5b600082015167ffffffffffffffff8111156101ef57600080fd5b6101fb84828501610199565b91505092915050565b600067ffffffffffffffff82111561021f5761021e61024a565b5b610228826102a1565b9050602081019050919050565b60005b8381101561025357808201518184015260208101905061023a565b83811115610262576000848401525b50505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b61028281610279565b811461028d57600080fd5b5056fe";
          factory = new ethers.ContractFactory(MESSAGE_STORAGE_ABI, messageBytecode, signer);
          contractArgs = [params.initialMessage || "Hello World"];
          break;
        case 'SimpleToken':
          const tokenBytecode = "0x608060405234801561001057600080fd5b506040516107a83803806107a8833981810160405281019061003291906101c2565b80600090805190602001906100489291906100a3565b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600281905550506101f3565b";
          factory = new ethers.ContractFactory(SIMPLE_TOKEN_ABI, tokenBytecode, signer);
          contractArgs = [
            params.name || "MyToken",
            params.symbol || "MTK", 
            params.decimals || 18,
            params.initialSupply || 1000
          ];
          break;
        default:
          throw new Error('Unknown contract type');
      }

      const contract = await factory.deploy(...contractArgs);
      await contract.waitForDeployment();
      
      const contractAddress = await contract.getAddress();
      
      const newContract = {
        type: contractType,
        address: contractAddress,
        contract: contract,
        deployedAt: new Date().toISOString()
      };

      setDeployedContracts(prev => [...prev, newContract]);
      setContractsDeployed(prev => prev + 1);
      
      return contractAddress;
    } catch (error) {
      console.error('Error deploying contract:', error);
      setError(error.message || 'Failed to deploy contract');
      throw error;
    }
  };

  // Interact with contract
  const interactWithContract = async (contractAddress, contractType, method, params = []) => {
    if (!signer) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setError('');
      let abi;
      
      switch (contractType) {
        case 'Counter':
          abi = COUNTER_ABI;
          break;
        case 'MessageStorage':
          abi = MESSAGE_STORAGE_ABI;
          break;
        case 'SimpleToken':
          abi = SIMPLE_TOKEN_ABI;
          break;
        default:
          throw new Error('Unknown contract type');
      }

      const contract = new ethers.Contract(contractAddress, abi, signer);
      
      let result;
      if (method === 'getCount' || method === 'getMessage' || method === 'balanceOf') {
        // Read-only methods
        result = await contract[method](...params);
      } else {
        // Write methods
        const tx = await contract[method](...params);
        await tx.wait();
        result = tx.hash;
        setTotalInteractions(prev => prev + 1);
      }
      
      return result;
    } catch (error) {
      console.error('Error interacting with contract:', error);
      setError(error.message || 'Failed to interact with contract');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Monad Smart Contract Deployer
          </h1>
          <p className="text-lg text-gray-600">
            Deploy and interact with smart contracts on Monad Testnet
          </p>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!account ? (
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Connected Account</p>
                    <p className="font-mono text-sm">{account}</p>
                  </div>
                  <Button variant="outline" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="font-semibold">{parseFloat(balance).toFixed(4)} MON</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Network</p>
                    <Badge variant="secondary">Monad Testnet</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Contracts Deployed</p>
                  <p className="text-2xl font-bold">{contractsDeployed}</p>
                </div>
                <Plus className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Interactions</p>
                  <p className="text-2xl font-bold">{totalInteractions}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {account && (
          <Tabs defaultValue="deploy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deploy">Deploy Contracts</TabsTrigger>
              <TabsTrigger value="interact">Interact with Contracts</TabsTrigger>
            </TabsList>

            <TabsContent value="deploy">
              <ContractDeployer onDeploy={deployContract} />
            </TabsContent>

            <TabsContent value="interact">
              <ContractInteraction 
                contracts={deployedContracts}
                onInteract={interactWithContract}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

// Contract Deployer Component
function ContractDeployer({ onDeploy }) {
  const [selectedContract, setSelectedContract] = useState('Counter');
  const [deployParams, setDeployParams] = useState({});
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployedAddress('');
    
    try {
      const address = await onDeploy(selectedContract, deployParams);
      setDeployedAddress(address);
      setDeployParams({});
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deploy Smart Contracts</CardTitle>
        <CardDescription>
          Choose a contract type and deploy it to Monad Testnet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="contract-type">Contract Type</Label>
          <select
            id="contract-type"
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          >
            <option value="Counter">Counter</option>
            <option value="MessageStorage">Message Storage</option>
            <option value="SimpleToken">Simple Token</option>
          </select>
        </div>

        {/* Contract-specific parameters */}
        {selectedContract === 'MessageStorage' && (
          <div>
            <Label htmlFor="initial-message">Initial Message</Label>
            <Input
              id="initial-message"
              placeholder="Enter initial message"
              value={deployParams.initialMessage || ''}
              onChange={(e) => setDeployParams(prev => ({
                ...prev,
                initialMessage: e.target.value
              }))}
            />
          </div>
        )}

        {selectedContract === 'SimpleToken' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="token-name">Token Name</Label>
              <Input
                id="token-name"
                placeholder="My Token"
                value={deployParams.name || ''}
                onChange={(e) => setDeployParams(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              />
            </div>
            <div>
              <Label htmlFor="token-symbol">Token Symbol</Label>
              <Input
                id="token-symbol"
                placeholder="MTK"
                value={deployParams.symbol || ''}
                onChange={(e) => setDeployParams(prev => ({
                  ...prev,
                  symbol: e.target.value
                }))}
              />
            </div>
            <div>
              <Label htmlFor="initial-supply">Initial Supply</Label>
              <Input
                id="initial-supply"
                type="number"
                placeholder="1000"
                value={deployParams.initialSupply || ''}
                onChange={(e) => setDeployParams(prev => ({
                  ...prev,
                  initialSupply: e.target.value
                }))}
              />
            </div>
          </div>
        )}

        <Button 
          onClick={handleDeploy} 
          disabled={isDeploying}
          className="w-full"
        >
          {isDeploying ? 'Deploying...' : `Deploy ${selectedContract}`}
        </Button>

        {deployedAddress && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              Contract deployed successfully at: {deployedAddress}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Contract Interaction Component
function ContractInteraction({ contracts, onInteract }) {
  const [selectedContract, setSelectedContract] = useState(null);
  const [interactionResult, setInteractionResult] = useState('');
  const [isInteracting, setIsInteracting] = useState(false);

  const handleInteraction = async (method, params = []) => {
    if (!selectedContract) return;
    
    setIsInteracting(true);
    setInteractionResult('');
    
    try {
      const result = await onInteract(
        selectedContract.address,
        selectedContract.type,
        method,
        params
      );
      setInteractionResult(result?.toString() || 'Transaction completed');
    } catch (error) {
      setInteractionResult(`Error: ${error.message}`);
    } finally {
      setIsInteracting(false);
    }
  };

  if (contracts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No contracts deployed yet. Deploy a contract first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {contracts.map((contract, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedContract?.address === contract.address
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedContract(contract)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{contract.type}</p>
                    <p className="text-sm text-gray-600 font-mono">
                      {contract.address}
                    </p>
                  </div>
                  <Badge variant="outline">{contract.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedContract && (
        <Card>
          <CardHeader>
            <CardTitle>Interact with {selectedContract.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <ContractMethods
              contractType={selectedContract.type}
              onInteract={handleInteraction}
              isInteracting={isInteracting}
            />
            
            {interactionResult && (
              <Alert className="mt-4">
                <AlertDescription>
                  {interactionResult}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Contract Methods Component
function ContractMethods({ contractType, onInteract, isInteracting }) {
  const [inputValues, setInputValues] = useState({});

  const updateInput = (key, value) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
  };

  const renderCounterMethods = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={() => onInteract('increment')} disabled={isInteracting}>
          Increment
        </Button>
        <Button onClick={() => onInteract('decrement')} disabled={isInteracting}>
          Decrement
        </Button>
        <Button onClick={() => onInteract('getCount')} disabled={isInteracting}>
          Get Count
        </Button>
        <Button onClick={() => onInteract('reset')} disabled={isInteracting}>
          Reset
        </Button>
      </div>
    </div>
  );

  const renderMessageStorageMethods = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="new-message">New Message</Label>
        <Input
          id="new-message"
          placeholder="Enter new message"
          value={inputValues.message || ''}
          onChange={(e) => updateInput('message', e.target.value)}
        />
        <Button 
          className="mt-2 w-full"
          onClick={() => onInteract('setMessage', [inputValues.message || ''])}
          disabled={isInteracting}
        >
          Set Message
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={() => onInteract('getMessage')} disabled={isInteracting}>
          Get Message
        </Button>
        <Button onClick={() => onInteract('clearMessage')} disabled={isInteracting}>
          Clear Message
        </Button>
      </div>
    </div>
  );

  const renderSimpleTokenMethods = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mint-address">Mint To Address</Label>
        <Input
          id="mint-address"
          placeholder="0x..."
          value={inputValues.mintAddress || ''}
          onChange={(e) => updateInput('mintAddress', e.target.value)}
        />
        <Label htmlFor="mint-amount">Amount</Label>
        <Input
          id="mint-amount"
          type="number"
          placeholder="100"
          value={inputValues.mintAmount || ''}
          onChange={(e) => updateInput('mintAmount', e.target.value)}
        />
        <Button 
          className="mt-2 w-full"
          onClick={() => onInteract('mint', [
            inputValues.mintAddress || '',
            inputValues.mintAmount || '0'
          ])}
          disabled={isInteracting}
        >
          Mint Tokens
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={() => onInteract('name')} disabled={isInteracting}>
          Get Name
        </Button>
        <Button onClick={() => onInteract('symbol')} disabled={isInteracting}>
          Get Symbol
        </Button>
        <Button onClick={() => onInteract('totalSupply')} disabled={isInteracting}>
          Total Supply
        </Button>
        <Button onClick={() => onInteract('decimals')} disabled={isInteracting}>
          Get Decimals
        </Button>
      </div>
    </div>
  );

  switch (contractType) {
    case 'Counter':
      return renderCounterMethods();
    case 'MessageStorage':
      return renderMessageStorageMethods();
    case 'SimpleToken':
      return renderSimpleTokenMethods();
    default:
      return <p>Unknown contract type</p>;
  }
}

export default App;

