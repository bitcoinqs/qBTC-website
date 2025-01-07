import React from 'react';
import { Coins, Copy, CheckCircle } from 'lucide-react';
import type { Network } from '../types/wallet';

type Props = {
  balance: string;
  network: Network;
  address: string;
};

export default function BalanceDisplay({ balance, network, address }: Props) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const networkColors = network === 'mainnet' 
    ? 'border-orange-500 text-orange-500'
    : 'border-purple-500 text-purple-500';

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${networkColors}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Available Balance</p>
            <div className="mt-1 flex items-center">
              <h2 className="text-3xl font-bold text-gray-900">{balance}</h2>
              <span className="ml-2 text-lg text-gray-500">BQS</span>
            </div>
          </div>
          <Coins className={`h-8 w-8 ${network === 'mainnet' ? 'text-orange-500' : 'text-purple-500'}`} />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">Wallet Address</p>
            <div className="flex items-center">
              <code className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded flex-1 overflow-x-auto">
                {address}
              </code>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Copy address"
          >
            {copied ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}