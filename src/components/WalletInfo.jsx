import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Wallet, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export const WalletInfo = ({ 
  account, 
  balance, 
  isConnected, 
  isConnecting, 
  error,
  onConnect, 
  onDisconnect,
  onRefreshBalance 
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openExplorer = () => {
    if (account) {
      window.open(`https://testnet-explorer.monad.xyz/address/${account}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            Connect your MetaMask wallet to deploy and interact with smart contracts on Monad Testnet.
          </div>
          
          <Button 
            onClick={onConnect} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Monad Testnet
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 text-sm bg-gray-100 px-3 py-2 rounded-md font-mono">
              {formatAddress(account)}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openExplorer}
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          {copied && (
            <div className="text-xs text-green-600">Address copied to clipboard!</div>
          )}
        </div>

        {/* Balance */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Balance</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 text-lg font-mono bg-gray-100 px-3 py-2 rounded-md">
              {balance} MON
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshBalance}
              className="shrink-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            onClick={onDisconnect}
            className="flex-1"
          >
            Disconnect
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('https://testnet-faucet.monad.xyz', '_blank')}
            className="flex-1"
          >
            Get Test MON
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Make sure you're connected to Monad Testnet</p>
          <p>• Get test MON from the faucet to deploy contracts</p>
          <p>• Each deployment and interaction requires gas fees</p>
        </div>
      </CardContent>
    </Card>
  );
};

