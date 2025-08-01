import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Rocket, 
  Zap, 
  Hash, 
  MessageSquare, 
  Coins, 
  Trash2,
  RefreshCw 
} from 'lucide-react';

export const StatsCard = ({ 
  deploymentCount,
  interactionCount,
  deployedContracts,
  onClearAll,
  onRefreshAll
}) => {
  const getContractTypeCounts = () => {
    const counts = {
      Counter: 0,
      MessageStorage: 0,
      SimpleToken: 0
    };

    deployedContracts.forEach(contract => {
      if (counts.hasOwnProperty(contract.type)) {
        counts[contract.type]++;
      }
    });

    return counts;
  };

  const typeCounts = getContractTypeCounts();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Counter': return <Hash className="h-4 w-4" />;
      case 'MessageStorage': return <MessageSquare className="h-4 w-4" />;
      case 'SimpleToken': return <Coins className="h-4 w-4" />;
      default: return <Hash className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Counter': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MessageStorage': return 'bg-green-50 text-green-700 border-green-200';
      case 'SimpleToken': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Zap className="mr-2 h-5 w-5" />
          Activity Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Rocket className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Deployments</span>
            </div>
            <div className="text-2xl font-bold text-blue-800">{deploymentCount}</div>
            <div className="text-xs text-blue-600">Total contracts deployed</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Interactions</span>
            </div>
            <div className="text-2xl font-bold text-green-800">{interactionCount}</div>
            <div className="text-xs text-green-600">Total function calls</div>
          </div>
        </div>

        {/* Contract Type Breakdown */}
        {deploymentCount > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Contract Types</h4>
            <div className="space-y-2">
              {Object.entries(typeCounts).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(type)}
                    <span className="text-sm">{type}</span>
                  </div>
                  <Badge variant="outline" className={getTypeColor(type)}>
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Contracts */}
        {deployedContracts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Active Contracts</h4>
            <div className="text-sm text-gray-600">
              {deployedContracts.length} contract{deployedContracts.length !== 1 ? 's' : ''} ready for interaction
            </div>
          </div>
        )}

        {/* Actions */}
        {deployedContracts.length > 0 && (
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshAll}
              className="flex-1 flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh All</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="flex-1 flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {deploymentCount === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Rocket className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <div className="text-sm">No contracts deployed yet</div>
            <div className="text-xs">Deploy your first contract to get started!</div>
          </div>
        )}

        {/* Tips */}
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          <p>• Each deployment and interaction is recorded on Monad Testnet</p>
          <p>• Contract states are updated after successful interactions</p>
          <p>• Use the refresh button to sync latest contract data</p>
        </div>
      </CardContent>
    </Card>
  );
};

