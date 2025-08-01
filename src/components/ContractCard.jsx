import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Hash, 
  MessageSquare, 
  Coins, 
  Copy, 
  ExternalLink, 
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  Send,
  Flame
} from 'lucide-react';
import { useState } from 'react';

export const ContractCard = ({ 
  contract, 
  contractState,
  onIncrement,
  onDecrement,
  onReset,
  onSetMessage,
  onClearMessage,
  onMintTokens,
  onBurnTokens,
  onTransferTokens,
  onRemove,
  onUpdateState,
  isInteracting,
  userAddress
}) => {
  const [copied, setCopied] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [mintForm, setMintForm] = useState({ to: '', amount: '' });
  const [burnAmount, setBurnAmount] = useState('');
  const [transferForm, setTransferForm] = useState({ to: '', amount: '' });

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contract.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const openExplorer = () => {
    window.open(`https://testnet-explorer.monad.xyz/address/${contract.address}`, '_blank');
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTokenAmount = (amount, decimals = 18) => {
    try {
      return parseFloat(ethers.formatUnits(amount, decimals)).toFixed(4);
    } catch {
      return '0.0000';
    }
  };

  const getContractIcon = () => {
    switch (contract.type) {
      case 'Counter': return <Hash className="h-5 w-5" />;
      case 'MessageStorage': return <MessageSquare className="h-5 w-5" />;
      case 'SimpleToken': return <Coins className="h-5 w-5" />;
      default: return <Hash className="h-5 w-5" />;
    }
  };

  const getContractColor = () => {
    switch (contract.type) {
      case 'Counter': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MessageStorage': return 'bg-green-50 text-green-700 border-green-200';
      case 'SimpleToken': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderCounterControls = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-sm font-medium mb-1">Current Count</div>
        <div className="text-2xl font-mono">{contractState.count?.toString() || '0'}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onIncrement(contract)}
          disabled={isInteracting}
          className="flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>+1</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDecrement(contract)}
          disabled={isInteracting}
          className="flex items-center space-x-1"
        >
          <Minus className="h-4 w-4" />
          <span>-1</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReset(contract)}
          disabled={isInteracting}
          className="flex items-center space-x-1"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  );

  const renderMessageStorageControls = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-sm font-medium mb-1">Current Message</div>
        <div className="text-sm break-words">{contractState.message || 'No message'}</div>
        <div className="text-xs text-gray-500 mt-1">
          Messages: {contractState.messageCount?.toString() || '0'}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`message-${contract.id}`}>New Message</Label>
        <Textarea
          id={`message-${contract.id}`}
          placeholder="Enter new message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onSetMessage(contract, messageInput);
            setMessageInput('');
          }}
          disabled={isInteracting || !messageInput.trim()}
          className="flex items-center space-x-1"
        >
          <Send className="h-4 w-4" />
          <span>Set Message</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onClearMessage(contract)}
          disabled={isInteracting}
          className="flex items-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear</span>
        </Button>
      </div>
    </div>
  );

  const renderTokenControls = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">Total Supply</div>
            <div className="font-mono">{formatTokenAmount(contractState.totalSupply || 0)}</div>
          </div>
          <div>
            <div className="font-medium">Your Balance</div>
            <div className="font-mono">{formatTokenAmount(contractState.userBalance || 0)}</div>
          </div>
        </div>
      </div>
      
      {/* Mint Tokens */}
      <div className="space-y-2">
        <Label>Mint Tokens</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="To address"
            value={mintForm.to}
            onChange={(e) => setMintForm(prev => ({ ...prev, to: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={mintForm.amount}
            onChange={(e) => setMintForm(prev => ({ ...prev, amount: e.target.value }))}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onMintTokens(contract, mintForm.to, mintForm.amount);
            setMintForm({ to: '', amount: '' });
          }}
          disabled={isInteracting || !mintForm.to.trim() || !mintForm.amount}
          className="w-full flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Mint Tokens</span>
        </Button>
      </div>

      {/* Burn Tokens */}
      <div className="space-y-2">
        <Label>Burn Tokens</Label>
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder="Amount to burn"
            value={burnAmount}
            onChange={(e) => setBurnAmount(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onBurnTokens(contract, burnAmount);
              setBurnAmount('');
            }}
            disabled={isInteracting || !burnAmount}
            className="flex items-center space-x-1"
          >
            <Flame className="h-4 w-4" />
            <span>Burn</span>
          </Button>
        </div>
      </div>

      {/* Transfer Tokens */}
      <div className="space-y-2">
        <Label>Transfer Tokens</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="To address"
            value={transferForm.to}
            onChange={(e) => setTransferForm(prev => ({ ...prev, to: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={transferForm.amount}
            onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onTransferTokens(contract, transferForm.to, transferForm.amount);
            setTransferForm({ to: '', amount: '' });
          }}
          disabled={isInteracting || !transferForm.to.trim() || !transferForm.amount}
          className="w-full flex items-center space-x-1"
        >
          <Send className="h-4 w-4" />
          <span>Transfer Tokens</span>
        </Button>
      </div>
    </div>
  );

  const renderControls = () => {
    switch (contract.type) {
      case 'Counter': return renderCounterControls();
      case 'MessageStorage': return renderMessageStorageControls();
      case 'SimpleToken': return renderTokenControls();
      default: return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            {getContractIcon()}
            <span className="ml-2">{contract.name}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getContractColor()}>
              {contract.type}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(contract.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Info */}
        <div className="space-y-2">
          <div className="text-sm text-gray-600">{contract.description}</div>
          
          <div className="flex items-center space-x-2">
            <code className="flex-1 text-xs bg-gray-100 px-2 py-1 rounded font-mono">
              {formatAddress(contract.address)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="shrink-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={openExplorer}
              className="shrink-0"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
          
          {copied && (
            <div className="text-xs text-green-600">Address copied!</div>
          )}
        </div>

        {/* Contract Controls */}
        {renderControls()}

        {/* Refresh State */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdateState(contract)}
          disabled={isInteracting}
          className="w-full"
        >
          Refresh State
        </Button>
      </CardContent>
    </Card>
  );
};

