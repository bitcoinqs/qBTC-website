import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Network, WalletFile } from '../../types/wallet';
import type { Direction, Step, ProcessingStatus } from './types';
import BridgeAddressDisplay from './BridgeAddressDisplay';
import BridgeProgress from './BridgeProgress';
import { useWallet } from '../../hooks/useWallet';
import { websocketManager } from '../../utils/websocketManager'; // Use centralized WebSocketManager
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  network: Network;
  wallet: WalletFile;
};

export default function BridgeModal({ isOpen, onClose, network, wallet }: Props) {
  const { balance } = useWallet();
  const [direction, setDirection] = useState<Direction>('btc-to-bqs');
  const [step, setStep] = useState<Step>('direction');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('waiting');
  const [amount, setAmount] = useState('');
  const [btcAddress, setBtcAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bridgeAddress, setBridgeAddress] = useState('');
  const [websocketInitialized, setWebsocketInitialized] = useState(false);

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
        const response = await axios.post(`https://${apiUrl}/worker`, {
          request_type: 'get_bridge_address',
          wallet_address: walletAddress,
          network,
          direction: 'btc-to-bqs',
        });

        if (response.data?.address) {
          const bridge_address = response.data.address;
          setBridgeAddress(bridge_address);
          subscribeToBridgeUpdates(walletAddress);
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

  const subscribeToBridgeUpdates = (walletAddress: string) => {
    if (websocketInitialized) return; // Prevent duplicate subscriptions

    websocketManager.subscribe(
      `${apiUrl}/ws`,
      (data: any) => {
        console.log('Received WebSocket message:', data);
        if (data.type === 'bridge_update') {
          if (data.bridge_address) {
            setBridgeAddress(data.bridge_address);
          }
          if (data.current_status) {
            setProcessingStatus(data.current_status);
            if (data.current_status === 'complete') {
              setStep('success');
              websocketManager.unsubscribe(`${apiUrl}/ws`, walletAddress);
            }
          }
        }
      },
      { wallet_address: walletAddress, update_type: 'bridge' }
    );

    setWebsocketInitialized(true);
  };

  const handleSendBQS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !btcAddress) return;
    setIsSubmitting(true);
    subscribeToBridgeUpdates(wallet?.address || '');
  };

  const handleClose = () => {
    if (processingStatus !== 'waiting') {
      setStep('direction');
      setDirection('btc-to-bqs');
      setProcessingStatus('waiting');
      setAmount('');
      setBtcAddress('');
      setIsSubmitting(false);
    }
    websocketManager.unsubscribe(`${apiUrl}/ws`, wallet?.address || '');
    onClose();
  };

  const renderProcessingStatus = () => {
    const isBTCtoBQS = direction === 'btc-to-bqs';
    const networkColor = network === 'mainnet' ? 'orange' : 'purple';

    return (
      <div className="space-y-8">
        {isBTCtoBQS ? (
          <>
            <BridgeProgress status={processingStatus} network={network} />
            <div className="text-center">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${networkColor}-500 mx-auto mb-4`}></div>
              <p className="text-sm text-gray-500">
                {processingStatus === 'waiting' && 'Waiting for your deposit...'}
                {processingStatus === 'confirmed' && 'Confirming transaction...'}
                {processingStatus === 'exchanging' && 'Exchanging assets...'}
                {processingStatus === 'sending' && 'Sending to destination...'}
              </p>
            </div>
            <BridgeAddressDisplay
              address={bridgeAddress}
              label="Send BTC to this address"
              description="Scan or copy the Bitcoin deposit address"
            />
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-900">Available BQS Balance</h4>
                <span className="text-lg font-bold text-gray-900">{balance} BQS</span>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div className={`bg-${networkColor}-50 border-l-4 border-${networkColor}-500 p-4`}>
            <div className="flex">
              <AlertTriangle className={`h-5 w-5 text-${networkColor}-400`} />
              <p className={`ml-3 text-sm text-${networkColor}-700`}>
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
      </div>
    );
  };

  if (!isOpen) return null;

  const networkColor = network === 'mainnet' ? 'orange' : 'purple';

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
                Choose the direction of your bridge transaction:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleStartBridge('btc-to-bqs')}
                  className={`p-4 border rounded-lg text-center hover:border-${networkColor}-500`}
                >
                  <ArrowRightLeft className="h-6 w-6 mx-auto mb-2" />
                  <span className="block font-medium">BTC to BQS</span>
                  <span className="text-sm text-gray-500">Bridge Bitcoin to BitcoinQS</span>
                </button>
              </div>
            </div>
          )}
          {step === 'processing' && renderProcessingStatus()}
          {step === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Bridge Complete</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}