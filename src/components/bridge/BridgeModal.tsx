import React, { useState } from 'react';
import { X, ArrowRightLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Network, WalletFile } from '../../types/wallet';
import type { Direction, Step, ProcessingStatus } from './types';
import BridgeAddressDisplay from './BridgeAddressDisplay';
import BridgeProgress from './BridgeProgress';
import axios from 'axios';

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;


type Props = {
  isOpen: boolean;
  onClose: () => void;
  network: Network;
  wallet: WalletFile;
};

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
        console.log(`${apiUrl}/worker`)
        const response = await axios.post(`https://${apiUrl}/worker`, {
          request_type: 'get_bridge_address',
          wallet_address: walletAddress,
          network,
          direction: 'btc-to-bqs',
        });

        if (response.data?.address) {
          const bridge_address = response.data.address
          setBridgeAddress(bridge_address);
          simulateBridgeProcess(selectedDirection, walletAddress, bridge_address);
          console.log("in get bridge address bridge address is " + bridge_address)
        } else {
          throw new Error('Bridge address not received');
        }
      } catch (error) {
        console.error('Error fetching bridge address:', error);
        alert('Unable to fetch bridge address. Please try again later.');
        return;
      }
    }

    
  };

const simulateBridgeProcess = (direction: Direction, walletAddress: string, bridgefoo: string) => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const websocketUrl = `${wsProtocol}//${apiUrl}/ws`;
  console.log(`Connecting to WebSocket at: ${websocketUrl}`);

  console.log("In simulateBridge, bridge address is: " + bridgefoo);

  try {
    const socket = new WebSocket(websocketUrl);
    const stepOrder = ['waiting', 'confirmed', 'exchanging', 'sending', 'complete'];

    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send(JSON.stringify({ wallet_address: walletAddress, direction: direction, bridge_address: bridgefoo, update_type: "bridge" }));
    };

    socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received WebSocket message:', data);
    if (data.step) {
        setProcessingStatus(data.step);
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

  const renderProcessingStatus = () => {
    const isBTCtoBQS = direction === 'btc-to-bqs';
    
    return (
      <div className="space-y-8">
        {/* Bridge Progress Section */}
        <div className="bg-white rounded-lg p-6 space-y-6">
          <BridgeProgress status={processingStatus} />
          
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">
              {processingStatus === 'waiting' && 'Waiting for your deposit...'}
              {processingStatus === 'confirmed' && 'Confirming transaction...'}
              {processingStatus === 'exchanging' && 'Exchanging assets...'}
              {processingStatus === 'sending' && 'Sending to destination...'}
            </p>
          </div>
        </div>

        {/* QR Code and Address Display */}
        {isBTCtoBQS ? (
          <BridgeAddressDisplay
            address={bridgeAddress}
            label="Send BTC to this address"
            description="Scan or copy the Bitcoin deposit address"
          />
        ) : (
          <BridgeAddressDisplay
            address={wallet.address}
            label="Send BQS to this address"
            description="Scan or copy the BQS deposit address"
          />
        )}

        {/* Information Notices */}
        <div className="space-y-4">
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <p className="ml-3 text-sm text-orange-700">
                Bridge transactions may take up to 60 minutes to complete.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-700">
              You can safely close this window. Your transaction will continue processing and will appear in your transaction history once complete.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    );
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
              <p className="text-sm text-gray-500">
                Choose the $$ direction of your bridge transaction:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleStartBridge('btc-to-bqs')}
                  className="p-4 border rounded-lg text-center hover:border-orange-500"
                >
                  <ArrowRightLeft className="h-6 w-6 mx-auto mb-2" />
                  <span className="block font-medium">BTC to BQS</span>
                  <span className="text-sm text-gray-500">Bridge Bitcoin to BitcoinQS</span>
                </button>
                <button
                  onClick={() => handleStartBridge('bqs-to-btc')}
                  className="p-4 border rounded-lg text-center hover:border-orange-500"
                >
                  <ArrowRightLeft className="h-6 w-6 mx-auto mb-2" />
                  <span className="block font-medium">BQS to BTC</span>
                  <span className="text-sm text-gray-500">Bridge BitcoinQS to Bitcoin</span>
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && renderProcessingStatus()}

          {step === 'success' && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Bridge Complete</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your assets have been successfully bridged.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Direction:</dt>
                    <dd className="text-sm text-gray-900">
                      {direction === 'btc-to-bqs' ? 'BTC → BQS' : 'BQS → BTC'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Status:</dt>
                    <dd className="text-sm font-medium text-green-600">Complete</dd>
                  </div>
                </dl>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
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