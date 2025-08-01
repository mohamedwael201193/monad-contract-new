import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Rocket, Hash, AlertCircle } from 'lucide-react';

export const ContractDeployment = ({ 
  onDeployCounter,
  deploymentStatus,
  isDeploying,
  isConnected,
  deploymentCount
}) => {
  const handleDeployCounter = async () => {
    await onDeployCounter();
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'success': return 'bg-green-50 text-green-700 border-green-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8 text-gray-500">
            <AlertCircle className="w-6 h-6 mr-2" />
            Please connect your wallet to deploy contracts
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Deploy Smart Contract
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {deploymentCount} deployed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Counter Contract */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">Counter Contract</h3>
                <p className="text-sm text-gray-600 mt-1">
                  A simple counter that can be incremented, decremented, and reset
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleDeployCounter}
                disabled={isDeploying}
                className="w-full"
                size="lg"
              >
                {isDeploying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deploying Counter...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Deploy Counter Contract
                  </>
                )}
              </Button>

              {deploymentStatus && (
                <div className={`p-3 rounded-lg border text-sm ${getStatusColor(deploymentStatus.type)}`}>
                  <div className="font-medium">{deploymentStatus.message}</div>
                  {deploymentStatus.details && (
                    <div className="mt-1 text-xs opacity-75">{deploymentStatus.details}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractDeployment;

