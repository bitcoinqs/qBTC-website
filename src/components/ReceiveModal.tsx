import React, { useState } from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Network, WalletFile } from '../types/wallet';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  network: Network;
  wallet: WalletFile;
};

export default function ReceiveModal({ isOpen, onClose, network, wallet }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Receive qBTC</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                <QRCodeSVG 
                  value={wallet.address} 
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Address ({network})
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={wallet.address}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  onClick={handleCopy}
                  className={`ml-2 p-2 ${
                    copied 
                      ? 'text-green-500' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="mt-2 text-sm text-green-600">Address copied to clipboard!</p>
              )}
            </div>

            <div className={`bg-orange-50 p-4 rounded-md ${
              network === 'mainnet' ? 'bg-orange-50' : 'bg-purple-50'
            }`}>
              <p className={`text-sm ${
                network === 'mainnet' ? 'text-orange-700' : 'text-purple-700'
              }`}>
                Share this address to receive qBTC tokens. Only send qBTC tokens to this address.
                {network === 'testnet' && ' This is a testnet address.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
