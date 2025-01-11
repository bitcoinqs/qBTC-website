import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import BalanceDisplay from '../BalanceDisplay';
import type { Network } from '../../types/wallet';

type Props = {
  network: Network;
  balance: string;
  address: string;
  handleNetworkSwitch: () => void; // Pass this as a prop
};

export function WalletHeader({ network, balance, address, handleNetworkSwitch }: Props) {
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

      {/* Pass props to BalanceDisplay */}
      <BalanceDisplay 
        balance={balance || '0.00'} 
        network={network || 'mainnet'} 
        address={address || 'N/A'} 
      />
    </div>
  );
}