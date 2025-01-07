import React, { useState } from 'react';
import { X, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Network } from '../types/wallet';
import axios from 'axios';
import { ml_dsa87 } from '@noble/post-quantum/ml-dsa';
import { utf8ToBytes } from '@noble/post-quantum/utils';
const apiUrl = import.meta.env.VITE_API_URL;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  network: Network;
};

type Step = 'form' | 'confirm' | 'processing' | 'success';

export default function SendModal({ isOpen, onClose, network }: Props) {
  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const uint8ArrayToBase64 = (array: Uint8Array): string => btoa(String.fromCharCode(...array));

  const serializeTransaction = (sender: string, receiver: string, amount: string, nonce = Date.now()): string => 
    `${sender}:${receiver}:${amount}:${nonce}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setStep('processing');

    try {
      const sender = localStorage.getItem('bqs.address');
      const publicKeyHex = localStorage.getItem('bqs.publickey');
      const privateKeyHex = localStorage.getItem('bqs.privatekey');

      if (!sender || !address || !amount || !publicKeyHex || !privateKeyHex) {
        alert('Missing transaction details or keys.');
        setStep('form');
        return;
      }

      const publicKey = Uint8Array.from(Buffer.from(publicKeyHex, 'hex'));
      const privateKey = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'));

      const transactionData = serializeTransaction(sender, address, amount);
      const transactionDataBytes = utf8ToBytes(transactionData);
      const signature = ml_dsa87.sign(privateKey, transactionDataBytes);

      const isValid = ml_dsa87.verify(publicKey, transactionDataBytes, signature);

      if (!isValid) {
        alert('Signature verification failed!');
        setStep('form');
        return;
      }
      console.log(isValid)

      
      const payload = {
        request_type: 'broadcast_tx',
        message: uint8ArrayToBase64(transactionDataBytes),
        signature: uint8ArrayToBase64(signature),
        pubkey: uint8ArrayToBase64(publicKey),
      };

      await axios.post(`${$apiUrl}/worker`, payload);

      setStep('success');
    } catch (error) {
      console.error('Send failed:', error);
      alert('Failed to send transaction.');
      setStep('form');
    }
  };

  const handleClose = () => {
    setStep('form');
    setAmount('');
    setAddress('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {step === 'form' && 'Send BQS'}
            {step === 'confirm' && 'Confirm Transaction'}
            {step === 'processing' && 'Processing Transaction'}
            {step === 'success' && 'Transaction Complete'}
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount (BQS)
                </label>
                <input
                  type="number"
                  id="amount"
                  step="0.00000001"
                  min="0"
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Recipient Address
                </label>
                <input
                  type="text"
                  id="address"
                  required
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                >
                  <Send className="mr-2 h-4 w-4" /> Continue
                </button>
              </div>
            </form>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Please Confirm</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      You are about to send {amount} BQS to {address}. This action cannot be undone.
                    </p>
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
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
                >
                  Confirm Send
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Processing your transaction...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-orange-500 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900">Transaction Successful</h3>
              <p className="text-sm text-gray-500">
                Your transaction has been broadcast to the network.
              </p>
              <button
                onClick={handleClose}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}