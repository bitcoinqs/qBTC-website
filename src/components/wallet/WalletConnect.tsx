import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '../../hooks/useWallet';
import WalletGenerationModal from '../WalletGenerationModal';
import ConnectWalletModal from '../ConnectWalletModal';
import { useWalletContext } from '../../context/WalletContext';

type Props = {
  isModalOpen: boolean;
  isGenerateModalOpen: boolean;
  onToggleConnect: () => void;
  onToggleGenerate: () => void;
};

export function WalletConnect({
  isModalOpen,
  isGenerateModalOpen,
  onToggleConnect,
  onToggleGenerate
}: Props) {
  const { network, getNetworkColors } = useWallet();
  const { setWallet } = useWalletContext();

  const handleWalletGenerated = (wallet: any) => {
    setWallet(wallet);
    onToggleGenerate();
  };

  const handleWalletConnected = (wallet: any) => {
    setWallet(wallet);
    onToggleConnect();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <Wallet className={`mx-auto h-12 w-12 ${
            network === 'mainnet' ? 'text-orange-500' : 'text-purple-500'
          }`} />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Wallet Not Connected</h2>
          <p className="mt-2 text-gray-500">
            Connect your wallet or generate a new one to start using the app.
          </p>
          <div className="mt-8 space-y-4">
            <button
              onClick={onToggleGenerate}
              className={`w-full px-4 py-2 rounded-md text-white ${getNetworkColors()}`}
            >
              Generate New Wallet
            </button>
            <button
              onClick={onToggleConnect}
              className={`w-full px-4 py-2 rounded-md text-white ${getNetworkColors()}`}
            >
              Connect Existing Wallet
            </button>
          </div>
        </div>
      </div>

      <WalletGenerationModal
        isOpen={isGenerateModalOpen}
        onClose={onToggleGenerate}
        network={network}
        onGenerate={handleWalletGenerated}
      />

      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={onToggleConnect}
        network={network}
        onConnect={handleWalletConnected}
      />
    </div>
  );
}