import React from 'react';
import { ArrowRightLeft, Send, QrCode } from 'lucide-react';

type Props = {
  network: string; // Add network as a prop
  onBridge: () => void;
  onSend: () => void;
  onReceive: () => void;
};

export function WalletActions({ network, onBridge, onSend, onReceive }: Props) {
  const buttonColor = network === 'mainnet' 
    ? 'bg-orange-500 hover:bg-orange-600'
    : 'bg-purple-500 hover:bg-purple-600';

  return (
    <div className="flex justify-center space-x-4 mb-8">
      <button
        onClick={onBridge}
        className={`px-4 py-2 rounded-md text-white ${buttonColor} flex items-center`}
      >
        <ArrowRightLeft className="h-4 w-4 mr-2" />
        Bridge Assets
      </button>
      <button
        onClick={onSend}
        className={`px-4 py-2 rounded-md text-white ${buttonColor} flex items-center`}
      >
        <Send className="h-4 w-4 mr-2" />
        Send
      </button>
      <button
        onClick={onReceive}
        className={`px-4 py-2 rounded-md text-white ${buttonColor} flex items-center`}
      >
        <QrCode className="h-4 w-4 mr-2" />
        Receive
      </button>
    </div>
  );
}