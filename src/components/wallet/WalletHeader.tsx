import React from 'react';
import { ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import BalanceDisplay from '../BalanceDisplay';
import type { Network } from '../../types/wallet';
import { useWallet } from '../../hooks/useWallet'

type Props = {
  network: Network;
  balance: string;
  address: string;
};

export function WalletHeader({ network, balance, address}: Props) {
  const { handleNetworkSwitch, showMainnetAlert } = useWallet();
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <button
          onClick={handleNetworkSwitch}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            network === 'mainnet' 
              ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' 
              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          }`}
          aria-label={`Switch to ${network === 'mainnet' ? 'Testnet' : 'Mainnet'}`}
        >
          <div className="flex items-center space-x-2">
            {network === 'mainnet' ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
            <span>{network === 'mainnet' ? 'Mainnet' : 'Testnet'}</span>
          </div>
        </button>
      </div>

      {showMainnetAlert && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                BitcoinQS is currently running on testnet. Mainnet launch coming soon!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pass props to BalanceDisplay */}
      <BalanceDisplay 
        balance={balance || '0.00'} 
        network={network || 'mainnet'} 
        address={address || 'N/A'} 
      />
    </div>
  );
}