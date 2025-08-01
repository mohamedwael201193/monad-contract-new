import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Rocket, Hash, MessageSquare, Coins, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export const ContractDeployment = ({ 
  onDeployCounter,
  onDeployMessageStorage,
  onDeploySimpleToken,
  deploymentStatus,
  isDeploying,
  isConnected,
  deploymentCount
}) => {
  const [messageStorageForm, setMessageStorageForm] = useState({
    initialMessage: 'Hello, Monad!'
  });

  const [tokenForm, setTokenForm] = useState({
    name: 'MyToken',
    symbol: 'MTK',
    decimals: 18,
    initialSupply: 1000
  });

  const handleDeployCounter = async () => {
    await onDeployCounter();
  };

  const handleDeployMessageStorage = async () => {
    await onDeployMessageStorage(messageStorageForm.initialMessage);
  };

  const handleDeployToken = async () => {
    await onDeploySimpleToken(
      tokenForm.name,
      tokenForm.symbol,
      parseInt(tokenForm.decimals),
      parseInt(tokenForm.initialSupply)
    );
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'success': return 'bg-green-50 text-green-700 border-green-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'pending': return <Hash className="h-4 w-4 animate-spin" />;
      case 'success': return <Rocket className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Rocket className="mr-2 h-5 w-5" />
            Deploy Smart Contracts
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {deploymentCount} Deployed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deployment Status */}
        {deploymentStatus && (
          <div className={`p-3 rounded-md border flex items-center space-x-2 ${getStatusColor(deploymentStatus.type)}`}>
            {getStatusIcon(deploymentStatus.type)}
            <span className="text-sm font-medium">{deploymentStatus.message}</span>
          </div>
        )}

        {!isConnected && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
            Please connect your wallet to deploy smart contracts.
          </div>
        )}

        <Tabs defaultValue="counter" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="counter" className="flex items-center space-x-1">
              <Hash className="h-4 w-4" />
              <span>Counter</span>
            </TabsTrigger>
            <TabsTrigger value="message" className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>Message</span>
            </TabsTrigger>
            <TabsTrigger value="token" className="flex items-center space-x-1">
              <Coins className="h-4 w-4" />
              <span>Token</span>
            </TabsTrigger>
          </TabsList>

          {/* Counter Contract */}
          <TabsContent value="counter" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Counter Contract</h3>
              <p className="text-sm text-gray-600">
                A simple counter that can be incremented, decremented, and reset. Perfect for testing basic contract interactions.
              </p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Features:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Increment counter by 1</li>
                <li>• Decrement counter by 1 (if > 0)</li>
                <li>• Reset counter to 0 (owner only)</li>
                <li>• View current count</li>
              </ul>
            </div>

            <Button 
              onClick={handleDeployCounter}
              disabled={!isConnected || isDeploying}
              className="w-full"
            >
              {isDeploying ? 'Deploying...' : 'Deploy Counter Contract'}
            </Button>
          </TabsContent>

          {/* MessageStorage Contract */}
          <TabsContent value="message" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">MessageStorage Contract</h3>
              <p className="text-sm text-gray-600">
                Store and retrieve messages on the blockchain. Includes message history and owner controls.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialMessage">Initial Message</Label>
              <Textarea
                id="initialMessage"
                placeholder="Enter initial message..."
                value={messageStorageForm.initialMessage}
                onChange={(e) => setMessageStorageForm(prev => ({
                  ...prev,
                  initialMessage: e.target.value
                }))}
                rows={3}
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Features:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Set new messages</li>
                <li>• Get current message</li>
                <li>• Clear message (owner only)</li>
                <li>• Track message count</li>
              </ul>
            </div>

            <Button 
              onClick={handleDeployMessageStorage}
              disabled={!isConnected || isDeploying || !messageStorageForm.initialMessage.trim()}
              className="w-full"
            >
              {isDeploying ? 'Deploying...' : 'Deploy MessageStorage Contract'}
            </Button>
          </TabsContent>

          {/* SimpleToken Contract */}
          <TabsContent value="token" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">SimpleToken Contract</h3>
              <p className="text-sm text-gray-600">
                A basic ERC20-like token with mint and burn functionality. Includes standard token features.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tokenName">Token Name</Label>
                <Input
                  id="tokenName"
                  placeholder="e.g., MyToken"
                  value={tokenForm.name}
                  onChange={(e) => setTokenForm(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Symbol</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="e.g., MTK"
                  value={tokenForm.symbol}
                  onChange={(e) => setTokenForm(prev => ({
                    ...prev,
                    symbol: e.target.value.toUpperCase()
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tokenDecimals">Decimals</Label>
                <Input
                  id="tokenDecimals"
                  type="number"
                  min="0"
                  max="18"
                  value={tokenForm.decimals}
                  onChange={(e) => setTokenForm(prev => ({
                    ...prev,
                    decimals: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialSupply">Initial Supply</Label>
                <Input
                  id="initialSupply"
                  type="number"
                  min="1"
                  value={tokenForm.initialSupply}
                  onChange={(e) => setTokenForm(prev => ({
                    ...prev,
                    initialSupply: e.target.value
                  }))}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Features:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Transfer tokens between addresses</li>
                <li>• Approve spending allowances</li>
                <li>• Mint new tokens (owner only)</li>
                <li>• Burn tokens from your balance</li>
              </ul>
            </div>

            <Button 
              onClick={handleDeployToken}
              disabled={!isConnected || isDeploying || !tokenForm.name.trim() || !tokenForm.symbol.trim()}
              className="w-full"
            >
              {isDeploying ? 'Deploying...' : 'Deploy SimpleToken Contract'}
            </Button>
          </TabsContent>
        </Tabs>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Each deployment requires gas fees paid in MON</p>
          <p>• Contracts are deployed to Monad Testnet</p>
          <p>• You can interact with deployed contracts below</p>
        </div>
      </CardContent>
    </Card>
  );
};

