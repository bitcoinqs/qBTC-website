import React from 'react';
import type { Transaction } from '../../types/wallet';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';

type Props = {
  isLoading: boolean;
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
};

export function TransactionHistory({ isLoading, transactions, onSelectTransaction }: Props) {
  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'receive':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'bridge':
        return <ArrowRightLeft className="h-5 w-5 text-orange-500" />;
      default:
        return null; // Handle unexpected transaction types gracefully
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
      </div>
      <div className="border-t border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-gray-500">No transactions available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getIcon(tx.type)}
                        <span className="ml-2 capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{tx.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}