import React, { useState } from 'react';
import { X, Download } from 'lucide-react';
import type { Network, WalletFile } from '../types/wallet';
import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { utf8ToBytes, randomBytes } from '@noble/post-quantum/utils';
import { sha3_256 } from 'js-sha3';
import bs58 from 'bs58';
import { Buffer } from 'buffer';

window.Buffer = window.Buffer || Buffer;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  network: Network;
  onGenerate: (wallet: WalletFile) => void;
};

export default function WalletGenerationModal({ isOpen, onClose, network, onGenerate }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const base58Encode = (bytes: Uint8Array) => bs58.encode(Buffer.from(bytes));

  function deriveQSafeAddress(pubkey: Uint8Array): string {
    const sha3Hash = new Uint8Array(sha3_256.arrayBuffer(pubkey));
    const versionedHash = new Uint8Array(1 + 20);
    versionedHash.set([0x00], 0);
    versionedHash.set(sha3Hash.slice(0, 20), 1);

    const checksum = new Uint8Array(sha3_256.arrayBuffer(versionedHash)).slice(0, 4);
    const addressBytes = new Uint8Array(versionedHash.length + checksum.length);
    addressBytes.set(versionedHash, 0);
    addressBytes.set(checksum, versionedHash.length);

    return "bqs" + base58Encode(addressBytes);
  }

  function uint8ArrayToHex(array: Uint8Array): string {
    return Array.from(array)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  function hexToUint8Array(hexString: string): Uint8Array {
    if (!hexString || hexString.length % 2 !== 0) {
      throw new Error('Invalid hex string');
    }
    const byteArray = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return byteArray;
  }

  function storeKeysInLocalStorage(publicKey: Uint8Array, secretKey: Uint8Array): string {
    const publicKeyHex = uint8ArrayToHex(publicKey);
    const secretKeyHex = uint8ArrayToHex(secretKey);
    const address = deriveQSafeAddress(publicKey);

    localStorage.setItem('bqs.address', address);
    localStorage.setItem('bqs.publickey', publicKeyHex);
    localStorage.setItem('bqs.privatekey', secretKeyHex);

    return address;
  }

  function getKeysFromLocalStorage(): { publicKey: Uint8Array; secretKey: Uint8Array } {
    const publicKeyHex = localStorage.getItem('bqs.publickey');
    const secretKeyHex = localStorage.getItem('bqs.privatekey');

    if (!publicKeyHex || !secretKeyHex) {
      throw new Error('Keys not found in localStorage');
    }

    return {
      publicKey: hexToUint8Array(publicKeyHex),
      secretKey: hexToUint8Array(secretKeyHex),
    };
  }

  const generateWallet = async () => {
    setIsGenerating(true);
    try {
      const seed = randomBytes(32);
      const keys = ml_dsa87.keygen(seed);

      const address = storeKeysInLocalStorage(keys.publicKey, keys.secretKey);

      const wallet: WalletFile = {
        address,
        publicKey: uint8ArrayToHex(keys.publicKey),
        privateKey: uint8ArrayToHex(keys.secretKey),
        network,
      };

      onGenerate(wallet);

      const blob = new Blob([JSON.stringify(wallet, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bitcoinqs-wallet-${network}-${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Wallet generated and downloaded successfully:', wallet);
    } catch (error) {
      console.error('Failed to generate wallet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Generate New Wallet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              This will generate a new quantum-safe wallet on the {network} network. Make sure to securely store your wallet file after generation.
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={generateWallet}
              disabled={isGenerating}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                network === 'mainnet' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate & Download Wallet
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}