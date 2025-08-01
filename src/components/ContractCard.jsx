import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Hash, 
  Copy, 
  ExternalLink, 
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';
import { useState, useEffect } from 'react';

export const ContractCard = ({ 
  contract, 
  onIncrement,
  onDecrement,
  onReset,
  interactionStatus,
  isInteracting,
  isConnected
}) => {
  const [copied, setCopied] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  // Load current count from contract
  const loadCount = async () => {
    if (!contract.contract) return;
    
    setIsLoadingCount(true);
    try {
      const count = await contract.contract.getCount();
      setCurrentCount(Number(count));
    } catch (error) {
      console.error('Failed to load count:', error);
    } finally {
      setIsLoadingCount(false);
    }
  };

  // Load count on mount and after interactions
  useEffect(() => {
    loadCount();
  }, [contract.contract]);

  // Reload count after successful interactions
  useEffect(() => {
    if (interactionStatus?.type === 'success') {
      setTimeout(() => loadCount(), 2000);
    }
  }, [interactionStatus]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contract.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const openInExplorer = () => {
    window.open(`https://testnet-explorer.monad.xyz/address/${contract.address}`, '_blank');
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              {contract.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{contract.description}</p>
          </div>
          <Badge variant="outline" className="ml-2">
            {contract.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contract Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Address:</span>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {formatAddress(contract.address)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={openInExplorer}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Deployed:</span>
            <span className="text-xs text-gray-500">{formatDate(contract.deployedAt)}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Current Count:</span>
            <span className="font-mono text-lg font-bold">
              {isLoadingCount ? '...' : currentCount}
            </span>
          </div>
        </div>

        {copied && (
          <div className="text-xs text-green-600 text-center">
            Address copied to clipboard!
          </div>
        )}

        {/* Counter Controls */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => onIncrement()}
              disabled={!isConnected || isInteracting}
              variant="default"
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              +1
            </Button>
            
            <Button
              onClick={() => onDecrement()}
              disabled={!isConnected || isInteracting}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Minus className="w-3 h-3" />
              -1
            </Button>
            
            <Button
              onClick={() => onReset()}
              disabled={!isConnected || isInteracting}
              variant="destructive"
              size="sm"
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          </div>

          {/* Interaction Status */}
          {interactionStatus && (
            <div className={`p-3 rounded-lg border text-sm ${
              interactionStatus.type === 'pending' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              interactionStatus.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              <div className="font-medium">{interactionStatus.message}</div>
              {interactionStatus.details && (
                <div className="mt-1 text-xs opacity-75">{interactionStatus.details}</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractCard;

