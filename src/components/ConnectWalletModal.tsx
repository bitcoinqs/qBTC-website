import React, { useState, useRef } from 'react';
import { X, Upload, AlertTriangle } from 'lucide-react';
import type { Network, WalletFile } from '../types/wallet';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  network: Network;
  onConnect: (wallet: WalletFile) => void;
};

export default function ConnectWalletModal({ isOpen, onClose, network, onConnect }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const wallet = JSON.parse(text) as WalletFile;

      // Validate wallet file
      if (!wallet.address || !wallet.publicKey || !wallet.privateKey) {
        throw new Error('Invalid wallet file format');
      }

        localStorage.setItem("bqs.address", wallet.address);
        localStorage.setItem("bqs.publickey", wallet.publicKey);
        localStorage.setItem("bqs.privatekey", wallet.privateKey);

      onConnect(wallet);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet file');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Connect Existing Wallet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">
                Upload your wallet file to connect. Make sure you're using the correct network ({network}).
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <div className="w-full">
                <label className={`cursor-pointer relative block w-full border-2 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none ${
                  network === 'mainnet' 
                    ? 'border-orange-300 hover:border-orange-400'
                    : 'border-purple-300 hover:border-purple-400'
                }`}>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".json"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                  <Upload className={`mx-auto h-12 w-12 ${
                    network === 'mainnet' ? 'text-orange-500' : 'text-purple-500'
                  }`} />
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {isLoading ? 'Loading wallet...' : 'Upload wallet file'}
                  </span>
                  <span className="mt-2 block text-xs text-gray-500">
                    JSON files only
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}