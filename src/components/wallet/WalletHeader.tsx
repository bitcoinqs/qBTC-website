import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import BalanceDisplay from '../BalanceDisplay';
import type { Network } from '../../types/wallet';
import { useWallet } from '../../hooks/useWallet';

type Props = {
  network: Network;
  balance: string;
  address: string;
};

export function WalletHeader({ network, balance, address }: Props) {
  const { handleNetworkSwitch } = useWallet();

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <button
          onClick={handleNetworkSwitch}
          className={`px-4 py-2 rounded-full font-medium ${
            network === 'mainnet' 
              ? 'bg-orange-100 text-orange-800'
              : 'bg-purple-100 text-purple-800'
          }`}
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
      
      <BalanceDisplay 
        balance={balance} 
        network={network}
        address={address}
      />
    </div>
  );
}