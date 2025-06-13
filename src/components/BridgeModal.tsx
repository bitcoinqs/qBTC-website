import React, { useState } from 'react';
import { X, ArrowRightLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { Network, WalletFile } from '../types/wallet';
import axios from 'axios';

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  network: Network;
  wallet: WalletFile;
};

type Direction = 'btc-to-bqs' | 'bqs-to-btc';
type Step = 'direction' | 'processing' | 'success';
type ProcessingStatus = 'waiting' | 'confirmed' | 'exchanging' | 'sending' | 'complete';

export default function BridgeModal({ isOpen, onClose, network, wallet }: Props) {
  const [direction, setDirection] = useState<Direction>('btc-to-bqs');
  const [step, setStep] = useState<Step>('direction');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('waiting');
  const [bridgeAddress, setBridgeAddress] = useState('');

  const handleStartBridge = async (selectedDirection: Direction) => {
    const walletAddress = wallet?.address || localStorage.getItem('bqs.address');

   

    if (!walletAddress) {
      alert('Wallet address is missing. Please connect your wallet.');
      return;
    }

    setDirection(selectedDirection);
    setStep('processing');
    setProcessingStatus('waiting');

    if (selectedDirection === 'btc-to-bqs') {
      try {
        const response = await axios.post(`${apiUrl}/worker`, {
          request_type: 'get_bridge_address',
          wallet_address: walletAddress,
          network,
          direction: 'btc-to-bqs',
        });

        if (response.data?.address) {
          setBridgeAddress(response.data.address);
        } else {
          throw new Error('Bridge address not received');
        }
      } catch (error) {
        console.error('Error fetching bridge address:', error);
        alert('Unable to fetch bridge address. Please try again later.');
        return;
      }
    }

    simulateBridgeProcess(selectedDirection, walletAddress);
  };

  const simulateBridgeProcess = (direction: Direction, walletAddress: string) => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const websocketUrl = `${wsProtocol}//`{$apiUrl}`/ws`;

    try {
      const socket = new WebSocket(websocketUrl);
      const stepOrder = ['waiting', 'confirmed', 'exchanging', 'sending', 'complete'];

      socket.onopen = () => {
        console.log('WebSocket connection established');
        socket.send(JSON.stringify({ wallet_address: walletAddress, direction }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);

        if (data.step) {
          setProcessingStatus((currentStep) => {
            const currentIndex = stepOrder.indexOf(currentStep);
            const newIndex = stepOrder.indexOf(data.step);

            return newIndex > currentIndex ? data.step : currentStep;
          });

          if (data.step === 'complete') {
            console.log('Bridge process completed successfully');
            setStep('success');
            socket.close();
          }
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('An error occurred with the WebSocket connection.');
        socket.close();
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
    }
  };

  const handleClose = () => {
    if (processingStatus !== 'waiting') {
      setStep('direction');
      setDirection('btc-to-bqs');
      setProcessingStatus('waiting');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Bridge Assets</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 'direction' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">Choose the direction $$ of your bridge transaction:</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleStartBridge('btc-to-bqs')}
                  className="p-4 border rounded-lg text-center hover:border-orange-500"
                >
                  <ArrowRightLeft className="h-6 w-6 mx-auto mb-2" />
                  <span className="block font-medium">BTC to qBTC</span>
                  <span className="text-sm text-gray-500">Bridge Bitcoin to qBTC</span>
                </button>
                <button
                  onClick={() => handleStartBridge('bqs-to-btc')}
                  className="p-4 border rounded-lg text-center hover:border-orange-500"
                >
                  <ArrowRightLeft className="h-6 w-6 mx-auto mb-2" />
                  <span className="block font-medium">qBTC to BTC</span>
                  <span className="text-sm text-gray-500">Bridge qBTC  to Bitcoin</span>
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Bridge in Progress</h3>
              <p className="text-sm text-gray-500">Your transaction is being processed...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Bridge Complete</h3>
              <p className="mt-2 text-sm text-gray-500">Your assets have been successfully bridged.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
