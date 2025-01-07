import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import type { Network, Transaction } from '../types/wallet';
const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;


const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'send',
    amount: '0.5 BQT',
    address: 'qs1q123...456',
    timestamp: '2024-03-20 15:30',
    status: 'confirmed'
  },
  {
    id: '2', 
    type: 'receive',
    amount: '1.2 BQT',
    address: 'qs1q789...012',
    timestamp: '2024-03-20 14:45',
    status: 'confirmed'
  },
  {
    id: '3',
    type: 'bridge',
    amount: '2.0 BQT',
    address: 'qs1q345...678',
    timestamp: '2024-03-20 13:15',
    status: 'pending'
  }
];

type TransactionModalProps = {
  transaction: Transaction;
  onClose: () => void;
};

function TransactionModal({ transaction, onClose }: TransactionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{transaction.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{transaction.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-sm text-gray-900">{transaction.amount}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{transaction.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
              <dd className="mt-1 text-sm text-gray-900">{transaction.timestamp}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  const [network, setNetwork] = useState<Network>('testnet');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showMainnetAlert, setShowMainnetAlert] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [network]);

const fetchTransactions = () => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const websocketUrl = `${wsProtocol}//${apiUrl}/ws`;

  console.log("Initiating WebSocket for transaction updates...");
  try {
    const socket = new WebSocket(websocketUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established for transaction updates");
      socket.send(JSON.stringify({ network: network, update_type: "all_transactions" }));
    };

    socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received WebSocket transaction update:", data);

  if (data.type === "transaction_update" && data.transactions) {
    console.log("I GOT IT!!!");
    // Map transactions to the required format
    const formattedTransactions = data.transactions.map((tx) => ({
      id: tx.id.toString(), // Ensure ID is a string
      type: tx.type,
      amount: tx.amount, // Assuming amount already includes the "BQS" unit
      address: tx.address,
      timestamp: new Date(tx.timestamp).toLocaleString(), // Format timestamp as a readable string
      status: 'confirmed', // Default status as confirmed, adapt if needed
      hash: tx.hash || 'N/A', // Provide default value if hash is missing
    }));

    // Update state with formatted transactions

    setTransactions(formattedTransactions);
    setIsLoading(false);


  } else if (data.error) {
    console.error("Error received from transactions WebSocket:", data.error);
  }
};
    socket.onerror = (error) => {
      console.error("WebSocket error for transaction updates:", error);
      socket.close();
    };

    socket.onclose = () => {
      console.log("WebSocket connection for transaction updates closed");
    };

    return socket;
  } catch (error) {
    console.error("Error initializing WebSocket for transaction updates:", error);
    return null;
  }
};

  const handleNetworkChange = async (newNetwork: Network) => {
    if (newNetwork === 'mainnet') {
      setShowMainnetAlert(true);
      return;
    }
    setShowMainnetAlert(false);
    setNetwork(newNetwork);
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Transaction Explorer</h1>
            </div>
          </div>
        </div>

        {/* Network Selector */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleNetworkChange('mainnet')}
                className={`${
                  network === 'mainnet'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Mainnet
              </button>
              <button
                onClick={() => handleNetworkChange('testnet')}
                className={`${
                  network === 'testnet'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Testnet
              </button>
            </nav>
          </div>
        </div>

        {/* Mainnet Alert */}
        {showMainnetAlert && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  BitcoinQS is currently running on testnet. Mainnet launch coming soon!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                placeholder="Search by TX ID or address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TX ID
                    </th>
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tx.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {tx.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {tx.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedTx && (
        <TransactionModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}