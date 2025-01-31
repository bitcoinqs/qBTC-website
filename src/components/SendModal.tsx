import React, { useState, useMemo } from 'react';
import { X, Send, AlertTriangle, CheckCircle, Info, Eye, EyeOff  } from 'lucide-react';
import type { Network } from '../types/wallet';
import { useWallet } from '../hooks/useWallet';
import axios from 'axios';
import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { utf8ToBytes } from '@noble/post-quantum/utils';
const apiUrl = import.meta.env.VITE_API_URL;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  network: Network;
};

type Step = 'form' | 'confirm' | 'processing' | 'success' | 'error';

const NETWORK_FEE = 0.0001; // Fixed network fee
const BRIDGE_FEE = 0.00005; // Additional bridge processing fee

export default function SendModal({ isOpen, onClose, network }: Props) {
  const { balance } = useWallet();
  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  const sender = localStorage.getItem("bqs.address")



  const fees = useMemo(() => {
    return {
      network: NETWORK_FEE,
      bridge: BRIDGE_FEE,
      total: NETWORK_FEE + BRIDGE_FEE
    };
  }, []);

   const total = useMemo(() => {
    const amountNum = parseFloat(amount) || 0;
    return amountNum + fees.total;
  }, [amount, fees.total]);

  const hasInsufficientFunds = useMemo(() => {
    const balanceNum = parseFloat(balance);
    return total > balanceNum;
  }, [total, balance]);

  const uint8ArrayToBase64 = (array: Uint8Array): string => btoa(String.fromCharCode(...array));

  const serializeTransaction = (sender: string, receiver: string, amount: string, nonce = Date.now()): string => 
    `${sender}:${receiver}:${amount}:${nonce}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (hasInsufficientFunds) {
      setError('Insufficient funds for this transaction');
      return;
    }
    setStep('confirm');
  };

const handlePasswordSubmit = async () => {
  if (!password) {
    setError('Please enter your wallet password');
    return;
  }

  setStep('processing');

  try {
    // Retrieve encrypted values from local storage
    const encryptedDataBase64 = localStorage.getItem("bqs.encryptedPrivateKey");
    const saltBase64 = localStorage.getItem("bqs.salt");
    const ivBase64 = localStorage.getItem("bqs.iv");
    const publicKeyHex = localStorage.getItem("bqs.publickey");

    if (!encryptedDataBase64 || !saltBase64 || !ivBase64 || !publicKeyHex) {
      throw new Error("Wallet data missing! Ensure you have stored the encrypted keys.");
    }

    // Convert stored Base64 values back to Uint8Array
    const encryptedData = Buffer.from(encryptedDataBase64, "base64");
    const salt = Buffer.from(saltBase64, "base64");
    const iv = Buffer.from(ivBase64, "base64");

    // Derive decryption key from password
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const aesKey = await window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["decrypt"]
    );

    let privateKeyHex;
    try {
      // Attempt to decrypt private key
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        aesKey,
        encryptedData
      );

      privateKeyHex = new TextDecoder().decode(decryptedData).trim();

      if (!privateKeyHex || privateKeyHex.length === 0) {
        throw new Error("Decryption failed. Invalid password.");
      }
    } catch (decryptionError) {
      console.error("Decryption error:", decryptionError);
      setPasswordAttempts(prev => prev + 1);
      const attemptsLeft = 3 - passwordAttempts;
      if (attemptsLeft <= 0) {
        setError("Too many failed attempts. Please try again later.");
        setStep("error");
      } else {
        setError(`Incorrect password. ${attemptsLeft} attempts remaining.`);
        setStep("password");
      }
      return;
    }

    console.log("Private Key Decrypted Successfully:", privateKeyHex);

    // Convert the decrypted key into Uint8Array format
    const publicKey = Uint8Array.from(Buffer.from(publicKeyHex, 'hex'));
    const privateKey = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'));

    // Simulate signing and verification to ensure the private key is valid
    const transactionData = serializeTransaction(sender, address, amount);
    const transactionDataBytes = utf8ToBytes(transactionData);
    const signature = ml_dsa87.sign(privateKey, transactionDataBytes);
    const isValid = ml_dsa87.verify(publicKey, transactionDataBytes, signature);

    if (!isValid) {
      setError('Signature verification failed!');
      setStep('error');
      return;
    }

    console.log("Signature Verified:", isValid);

    // Construct API request
    const payload = {
      request_type: "broadcast_tx",
      message: uint8ArrayToBase64(transactionDataBytes),
      signature: uint8ArrayToBase64(signature),
      pubkey: uint8ArrayToBase64(publicKey),
    };

    await axios.post(`https://${apiUrl}/worker`, payload);

    setStep("success");
  } catch (error) {
    console.error("Transaction error:", error);
    setError("Transaction failed. Please try again.");
    setStep("error");
  }
};



  const handleConfirm = async () => {

    if (hasInsufficientFunds) {
      setError('Transaction failed: Insufficient funds');
      setStep('error');
      return;
    }

    setStep('password');

  }

    

  const handleClose = () => {
    setStep('form');
    setAmount('');
    setAddress('');
    setError(null);
    setPasswordAttempts(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {step === 'confirm' && 'Confirm Transaction'}
            {step === 'password' && 'Enter Wallet Password'}
            {step === 'processing' && 'Processing Transaction'}
            {step === 'success' && 'Transaction Complete'}
            {step === 'error' && 'Transaction Failed'}
            {step === 'form' && 'Send BQS'}
          </h3>
          {step !== 'processing' && (
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount (BQS)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="amount"
                    step="0.00000001"
                    min="0"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Recipient Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address"
                    required
                    placeholder="qs1q..."
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              {amount && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount:</span>
                    <span className="text-gray-900">{amount} BQS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Network Fee:</span>
                    <span className="text-gray-900">{fees.network} BQS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bridge Fee:</span>
                    <span className="text-gray-900">{fees.bridge} BQS</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">{total.toFixed(8)} BQS</span>
                  </div>
                </div>
              )}

              {hasInsufficientFunds && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        Insufficient funds. Available balance: {balance} BQS
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    network === 'mainnet'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Continue
                </button>
              </div>
            </form>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Please Confirm</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>You are about to send:</p>
                      <div className="mt-2 space-y-1">
                        <p>Amount: {amount} BQS</p>
                        <p>Fees: {fees.total} BQS</p>
                        <p className="font-medium">Total: {total.toFixed(8)} BQS</p>
                        <p className="mt-2">To: {address}</p>
                      </div>
                      <p className="mt-2">This action cannot be undone.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setStep('form')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    network === 'mainnet'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  Confirm Send
                </button>
              </div>
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">
                Please enter your wallet password to decrypt your wallet and sign the transaction.
              </p>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Wallet Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setStep('confirm')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    network === 'mainnet'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  Sign & Send
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Processing your transaction...</p>
              <p className="mt-2 text-xs text-gray-400">This may take a few moments</p>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className={`h-12 w-12 mx-auto ${
                  network === 'mainnet' ? 'text-orange-500' : 'text-purple-500'
                }`} />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Transaction Successful</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your transaction has been successfully processed and broadcast to the network.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Amount:</dt>
                    <dd className="text-gray-900">{amount} BQS</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Fees:</dt>
                    <dd className="text-gray-900">{fees.total} BQS</dd>
                  </div>
                  <div className="flex justify-between font-medium">
                    <dt className="text-gray-900">Total:</dt>
                    <dd className="text-gray-900">{total.toFixed(8)} BQS</dd>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <dt className="text-gray-500">Recipient:</dt>
                    <dd className="text-gray-900 font-mono mt-1">{address}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    network === 'mainnet'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-6">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Transaction Failed</h3>
                <p className="mt-2 text-sm text-red-600">{error}</p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setStep('form')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}