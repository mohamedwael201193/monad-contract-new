import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  Wallet, 
  Plus, 
  Activity, 
  Hash, 
  MessageSquare, 
  Coins, 
  Eye, 
  Minus, 
  RotateCcw, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { COUNTER_ABI, MESSAGE_STORAGE_ABI, SIMPLE_TOKEN_ABI } from './contracts/contractABIs';

// Monad Testnet configuration
const MONAD_TESTNET = {
  chainId: '0x27a7', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-4">
              <Hash className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Monad Smart Contract Deployer
            </h1>
          </div>
          <p className="text-xl text-purple-200">
            Deploy and interact with smart contracts on Monad Testnet
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Connected to Monad Testnet</span>
          </div>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-6 bg-gradient-to-r from-purple-800/50 to-indigo-800/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wallet className="h-5 w-5 text-purple-400" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!account ? (
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                {isConnecting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect MetaMask
                  </div>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-800/30 to-emerald-800/30 rounded-lg border border-green-500/30">
                  <div>
                    <p className="text-sm text-green-300">Connected Account</p>
                    <p className="font-mono text-sm text-white bg-black/30 px-2 py-1 rounded">{account}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={disconnectWallet}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    Disconnect
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-lg border border-blue-500/30">
                    <p className="text-sm text-blue-300">Balance</p>
                    <p className="font-semibold text-xl text-white">{parseFloat(balance).toFixed(4)} MON</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-lg border border-purple-500/30">
                    <p className="text-sm text-purple-300">Network</p>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Monad Testnet</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-500/50 bg-red-900/50 backdrop-blur-sm">
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-emerald-800/50 to-green-800/50 border-emerald-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-300">Contracts Deployed</p>
                  <p className="text-3xl font-bold text-white">{contractsDeployed}</p>
                </div>
                <div className="p-3 bg-emerald-500/20 rounded-full">
                  <Plus className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-cyan-800/50 to-blue-800/50 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-300">Total Interactions</p>
                  <p className="text-3xl font-bold text-white">{totalInteractions}</p>
                </div>
                <div className="p-3 bg-cyan-500/20 rounded-full">
                  <Activity className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {account && (
          <Tabs defaultValue="deploy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm border border-purple-500/30">
              <TabsTrigger 
                value="deploy" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-purple-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Deploy Contracts
              </TabsTrigger>
              <TabsTrigger 
                value="interact"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white text-blue-200"
              >
                <Activity className="h-4 w-4 mr-2" />
                Interact with Contracts
              </TabsTrigger>
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

  const contractIcons = {
    Counter: <Hash className="h-6 w-6" />,
    MessageStorage: <MessageSquare className="h-6 w-6" />,
    SimpleToken: <Coins className="h-6 w-6" />
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-800/50 to-purple-800/50 border-indigo-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <div className="p-2 bg-indigo-500/20 rounded-lg mr-3">
            <Plus className="h-6 w-6 text-indigo-400" />
          </div>
          Deploy Smart Contracts
        </CardTitle>
        <CardDescription className="text-indigo-200">
          Choose a contract type and deploy it to Monad Testnet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="contract-type" className="text-white mb-3 block">Contract Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Counter', 'MessageStorage', 'SimpleToken'].map((contractType) => (
              <div
                key={contractType}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedContract === contractType
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-gray-600 bg-gray-800/30 hover:border-purple-500/50'
                }`}
                onClick={() => setSelectedContract(contractType)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedContract === contractType
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {contractIcons[contractType]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{contractType}</h3>
                    <p className="text-sm text-gray-300">
                      {contractType === 'Counter' && 'Simple counter with increment/decrement'}
                      {contractType === 'MessageStorage' && 'Store and retrieve messages'}
                      {contractType === 'SimpleToken' && 'Basic ERC-20 token contract'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contract-specific parameters */}
        {selectedContract === 'MessageStorage' && (
          <div className="space-y-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <Label htmlFor="initial-message" className="text-blue-200">Initial Message</Label>
            <Input
              id="initial-message"
              placeholder="Enter initial message"
              value={deployParams.initialMessage || ''}
              onChange={(e) => setDeployParams(prev => ({
                ...prev,
                initialMessage: e.target.value
              }))}
              className="bg-black/30 border-blue-500/50 text-white placeholder-blue-300"
            />
          </div>
        )}

        {selectedContract === 'SimpleToken' && (
          <div className="space-y-4 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="token-name" className="text-green-200">Token Name</Label>
                <Input
                  id="token-name"
                  placeholder="My Token"
                  value={deployParams.name || ''}
                  onChange={(e) => setDeployParams(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  className="bg-black/30 border-green-500/50 text-white placeholder-green-300"
                />
              </div>
              <div>
                <Label htmlFor="token-symbol" className="text-green-200">Token Symbol</Label>
                <Input
                  id="token-symbol"
                  placeholder="MTK"
                  value={deployParams.symbol || ''}
                  onChange={(e) => setDeployParams(prev => ({
                    ...prev,
                    symbol: e.target.value
                  }))}
                  className="bg-black/30 border-green-500/50 text-white placeholder-green-300"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="initial-supply" className="text-green-200">Initial Supply</Label>
              <Input
                id="initial-supply"
                type="number"
                placeholder="1000"
                value={deployParams.initialSupply || ''}
                onChange={(e) => setDeployParams(prev => ({
                  ...prev,
                  initialSupply: e.target.value
                }))}
                className="bg-black/30 border-green-500/50 text-white placeholder-green-300"
              />
            </div>
          </div>
        )}

        <Button 
          onClick={handleDeploy} 
          disabled={isDeploying}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeploying ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Deploying {selectedContract}...
            </div>
          ) : (
            <div className="flex items-center">
              {contractIcons[selectedContract]}
              <span className="ml-2">Deploy {selectedContract}</span>
            </div>
          )}
        </Button>

        {deployedAddress && (
          <Alert className="border-green-500/50 bg-green-900/50 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <AlertDescription className="text-green-200">
                <strong>Contract deployed successfully!</strong>
                <br />
                <span className="font-mono text-sm bg-black/30 px-2 py-1 rounded mt-2 inline-block">
                  {deployedAddress}
                </span>
              </AlertDescription>
            </div>
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

  const contractIcons = {
    Counter: <Hash className="h-5 w-5" />,
    MessageStorage: <MessageSquare className="h-5 w-5" />,
    SimpleToken: <Coins className="h-5 w-5" />
  };

  if (contracts.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 border-gray-500/30 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-700/50 rounded-full">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">No Contracts Deployed</h3>
            <p className="text-gray-400 max-w-md">
              Deploy your first smart contract to start interacting with it. 
              Switch to the "Deploy Contracts" tab to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-800/50 to-blue-800/50 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <div className="p-2 bg-cyan-500/20 rounded-lg mr-3">
              <Activity className="h-6 w-6 text-cyan-400" />
            </div>
            Select Contract
          </CardTitle>
          <CardDescription className="text-cyan-200">
            Choose a deployed contract to interact with
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {contracts.map((contract, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedContract?.address === contract.address
                    ? 'border-cyan-400 bg-cyan-500/20'
                    : 'border-gray-600 bg-gray-800/30 hover:border-cyan-500/50'
                }`}
                onClick={() => setSelectedContract(contract)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedContract?.address === contract.address
                        ? 'bg-cyan-500/30 text-cyan-300'
                        : 'bg-gray-700/50 text-gray-400'
                    }`}>
                      {contractIcons[contract.type]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{contract.type}</p>
                      <p className="text-sm text-gray-300 font-mono bg-black/30 px-2 py-1 rounded">
                        {contract.address}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${
                    selectedContract?.address === contract.address
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      : 'bg-gray-600'
                  } text-white`}>
                    {contract.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedContract && (
        <Card className="bg-gradient-to-r from-emerald-800/50 to-teal-800/50 border-emerald-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <div className="p-2 bg-emerald-500/20 rounded-lg mr-3">
                {contractIcons[selectedContract.type]}
              </div>
              Interact with {selectedContract.type}
            </CardTitle>
            <CardDescription className="text-emerald-200">
              Execute functions on the selected contract
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContractMethods
              contractType={selectedContract.type}
              onInteract={handleInteraction}
              isInteracting={isInteracting}
            />
            
            {interactionResult && (
              <Alert className="mt-6 border-blue-500/50 bg-blue-900/50 backdrop-blur-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-2"></div>
                  <AlertDescription className="text-blue-200">
                    <strong>Result:</strong>
                    <br />
                    <span className="font-mono text-sm bg-black/30 px-2 py-1 rounded mt-2 inline-block">
                      {interactionResult}
                    </span>
                  </AlertDescription>
                </div>
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

  const ActionButton = ({ method, params = [], isWrite = false, icon, label, description }) => (
    <div className={`p-4 rounded-lg border ${
      isWrite 
        ? 'border-orange-500/50 bg-orange-900/30' 
        : 'border-blue-500/50 bg-blue-900/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${
            isWrite ? 'bg-orange-500/20' : 'bg-blue-500/20'
          }`}>
            {icon}
          </div>
          <div>
            <h4 className="font-semibold text-white">{label}</h4>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        </div>
        <Badge className={`${
          isWrite 
            ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' 
            : 'bg-blue-500/20 text-blue-300 border-blue-500/50'
        }`}>
          {isWrite ? 'Write' : 'Read'}
        </Badge>
      </div>
      
      {params.length > 0 && (
        <div className="space-y-2 mb-3">
          {params.map((param, index) => (
            <Input
              key={index}
              placeholder={param.placeholder}
              value={inputValues[param.key] || ''}
              onChange={(e) => updateInput(param.key, e.target.value)}
              className="bg-black/30 border-gray-500/50 text-white placeholder-gray-400"
            />
          ))}
        </div>
      )}
      
      <Button
        onClick={() => onInteract(method, params.map(p => inputValues[p.key] || (p.default || '')))}
        disabled={isInteracting}
        className={`w-full ${
          isWrite
            ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        } text-white font-semibold py-2 px-4 rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isInteracting ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {icon}
            <span className="ml-2">{label}</span>
          </div>
        )}
      </Button>
    </div>
  );

  const renderCounterMethods = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ActionButton
        method="getCount"
        icon={<Eye className="h-4 w-4 text-blue-400" />}
        label="Get Count"
        description="Read current counter value"
      />
      <ActionButton
        method="increment"
        isWrite={true}
        icon={<Plus className="h-4 w-4 text-orange-400" />}
        label="Increment"
        description="Increase counter by 1"
      />
      <ActionButton
        method="decrement"
        isWrite={true}
        icon={<Minus className="h-4 w-4 text-orange-400" />}
        label="Decrement"
        description="Decrease counter by 1"
      />
      <ActionButton
        method="reset"
        isWrite={true}
        icon={<RotateCcw className="h-4 w-4 text-orange-400" />}
        label="Reset"
        description="Reset counter to 0"
      />
    </div>
  );

  const renderMessageStorageMethods = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ActionButton
        method="getMessage"
        icon={<Eye className="h-4 w-4 text-blue-400" />}
        label="Get Message"
        description="Read stored message"
      />
      <ActionButton
        method="getMessageCount"
        icon={<Hash className="h-4 w-4 text-blue-400" />}
        label="Get Message Count"
        description="Read total message updates"
      />
      <ActionButton
        method="setMessage"
        params={[{ key: 'message', placeholder: "Enter new message" }]}
        isWrite={true}
        icon={<Edit className="h-4 w-4 text-orange-400" />}
        label="Set Message"
        description="Update stored message"
      />
      <ActionButton
        method="clearMessage"
        isWrite={true}
        icon={<Trash2 className="h-4 w-4 text-orange-400" />}
        label="Clear Message"
        description="Clear stored message"
      />
    </div>
  );

  const renderSimpleTokenMethods = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ActionButton
        method="name"
        icon={<Eye className="h-4 w-4 text-blue-400" />}
        label="Token Name"
        description="Read token name"
      />
      <ActionButton
        method="symbol"
        icon={<Eye className="h-4 w-4 text-blue-400" />}
        label="Token Symbol"
        description="Read token symbol"
      />
      <ActionButton
        method="totalSupply"
        icon={<Eye className="h-4 w-4 text-blue-400" />}
        label="Total Supply"
        description="Read total token supply"
      />
      <ActionButton
        method="decimals"
        icon={<Eye className="h-4 w-4 text-blue-400" />}
        label="Decimals"
        description="Read token decimals"
      />
      <div className="md:col-span-2">
        <ActionButton
          method="mint"
          params={[
            { key: 'mintAddress', placeholder: "Recipient address (0x...)" },
            { key: 'mintAmount', placeholder: "Amount to mint", default: '0' }
          ]}
          isWrite={true}
          icon={<Plus className="h-4 w-4 text-orange-400" />}
          label="Mint Tokens"
          description="Create new tokens (owner only)"
        />
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
      return <div className="text-gray-400">Unknown contract type</div>;
  }
}

export default App;

