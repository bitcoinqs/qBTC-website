import React, { useState } from 'react';
import { X, Download,Eye, EyeOff, AlertTriangle } from 'lucide-react';
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

async function generateAESKey() {
    return await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypt the private key using AES-GCM
async function encryptPrivateKey(privateKeyHex, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16)); // Salt for key derivation
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector for AES-GCM

    // Derive encryption key from password
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
    );

    const aesKey = await window.crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
    );

    // Convert private key to bytes
    const privateKeyBytes = new TextEncoder().encode(privateKeyHex);

    // Encrypt the private key
    const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        aesKey,
        privateKeyBytes
    );

    // Store encrypted key, salt, and IV in localStorage
    localStorage.setItem("bqs.encryptedPrivateKey", Buffer.from(encryptedData).toString("base64"));
    localStorage.setItem("bqs.salt", Buffer.from(salt).toString("base64"));
    localStorage.setItem("bqs.iv", Buffer.from(iv).toString("base64"));

    console.log("Private Key Encrypted and Stored Securely!");
}

// Decrypt private key using AES-GCM
async function decryptPrivateKey(password) {
    const encryptedData = localStorage.getItem("bqs.encryptedPrivateKey");
    const salt = Buffer.from(localStorage.getItem("bqs.salt"), "base64");
    const iv = Buffer.from(localStorage.getItem("bqs.iv"), "base64");

    if (!encryptedData || !salt || !iv) {
        throw new Error("No encrypted private key found!");
    }

    // Derive decryption key from password
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
    );

    const aesKey = await window.crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["decrypt"]
    );

    // Decrypt private key
    const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        aesKey,
        Buffer.from(encryptedData, "base64")
    );

    const privateKeyHex = new TextDecoder().decode(decryptedData);
    console.log("Private Key Decrypted:", privateKeyHex);
    return privateKeyHex;
}

export default function WalletGenerationModal({ isOpen, onClose, network, onGenerate }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setError(null);
    onClose();
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

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

async function storeKeysInLocalStorage(publicKey: Uint8Array, secretKey: Uint8Array, password: string): Promise<string> {
    const publicKeyHex = uint8ArrayToHex(publicKey);
    const secretKeyHex = uint8ArrayToHex(secretKey);
    const address = deriveQSafeAddress(publicKey);

    // Await the encryption result before storing it
    const { encryptedPrivateKey, salt, iv } = await encryptPrivateKey(secretKeyHex, password);

    // Store values in localStorage
    localStorage.setItem('bqs.address', address);
    localStorage.setItem('bqs.publickey', publicKeyHex);
    localStorage.setItem('bqs.encryptedPrivateKey', encryptedPrivateKey);
    localStorage.setItem('bqs.salt', salt);
    localStorage.setItem('bqs.iv', iv);

    return address;
}


  const generateWallet = async () => {
    setIsGenerating(true);
    setError(null);

    if (!validatePassword()) {
        setIsGenerating(false);
        return;
    }

    try {
        const seed = randomBytes(32);
        const keys = ml_dsa87.keygen(seed);

        // Await the storage of keys
        const address = await storeKeysInLocalStorage(keys.publicKey, keys.secretKey, password);

        // Retrieve the stored encrypted values
        const storedEncryptedPrivateKey = localStorage.getItem("bqs.encryptedPrivateKey") || "";
        const storedSalt = localStorage.getItem("bqs.salt") || "";
        const storedIV = localStorage.getItem("bqs.iv") || "";

        const wallet: WalletFile = {
            address,
            publicKey: uint8ArrayToHex(keys.publicKey),
            encryptedPrivateKey: storedEncryptedPrivateKey,
            PrivateKeySalt: storedSalt,
            PrivateKeyIV: storedIV,
        };

        onGenerate(wallet);

        const blob = new Blob([JSON.stringify(wallet, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bitcoinqs-wallet-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('Wallet generated and downloaded successfully:', wallet);
    } catch (error) {
        setIsGenerating(false);
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
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-4">
              This will generate a new quantum-safe wallet on the {network} network. 
              Please set a strong password to encrypt your wallet.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Confirm password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <p className="ml-3 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={generateWallet}
              disabled={isGenerating || !password || !confirmPassword}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                network === 'mainnet' 
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : 'bg-purple-500 hover:bg-purple-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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