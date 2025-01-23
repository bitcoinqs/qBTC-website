import React from 'react';
import { X, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import type { Transaction } from '../types/wallet';

type Props = {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
};

export default function TransactionModal({ transaction, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (transaction.type) {
      case 'send':
        return <ArrowUpRight className="h-6 w-6 text-red-500" />;
      case 'receive':
        return <ArrowDownLeft className="h-6 w-6 text-green-500" />;
      case 'bridge':
        return <ArrowRightLeft className="h-6 w-6 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    return transaction.status === 'confirmed'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className="text-lg font-medium text-gray-900 capitalize">
              {transaction.type} Transaction
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                  {transaction.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Amount</label>
                <p className="mt-1 text-sm font-medium text-gray-900">{transaction.amount}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                {transaction.type === 'send' ? 'To Address' : 'From Address'}
              </label>
              <p className="mt-1 text-sm font-mono break-all text-gray-900">{transaction.address}</p>
            </div>

           <div>
              <label className="block text-sm font-medium text-gray-500">
               Transaction Hash
              </label>
              <p className="mt-1 text-sm font-mono break-all text-gray-900">{transaction.hash}</p>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-500">Timestamp</label>
              <p className="mt-1 text-sm text-gray-900">{transaction.timestamp}</p>
            </div>

            {transaction.type === 'bridge' && (
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-orange-700">
                  This is a bridge transaction. Bridge transactions may take longer to process as they involve cross-chain operations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}