import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import type { Network, Transaction } from '../types/wallet';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ExplorerPage() {
  const [network, setNetwork] = useState<Network>('testnet');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showMainnetAlert, setShowMainnetAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    // Establish WebSocket connection on component mount
    const socket = initializeWebSocket();

    return () => {
      // Clean up WebSocket on component unmount
      if (socket) socket.close();
    };
  }, [network]);

  const initializeWebSocket = () => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const websocketUrl = `${wsProtocol}//${apiUrl}/ws`;

    try {
      const socket = new WebSocket(websocketUrl);

      socket.onopen = () => {
        console.log("WebSocket connection established");
        socket.send(JSON.stringify({ network, update_type: "all_transactions" }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket update:", data);

        if (data.type === "transaction_update" && data.transactions) {
          const updatedTransactions = data.transactions.map((tx: any) => ({
            id: tx.id,
            type: tx.type,
            amount: tx.amount,
            fromAddress: tx.sender || 'N/A',
            toAddress: tx.receiver || 'N/A',
            timestamp: new Date(tx.timestamp).toLocaleString(),
            status: 'confirmed',
            hash: tx.hash,
          }));
          setTransactions(updatedTransactions);
          setIsLoading(false);
        } else if (data.error) {
          console.error("WebSocket error:", data.error);
          setError(data.error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection failed");
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return socket;
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error);
      setError("Failed to connect to WebSocket");
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
    setTransactions([]); // Clear transactions when switching networks
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.toAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Transaction Explorer</h1>
        </div>

        {/* Network Selector */}
        <div className="mb-6">
          <nav className="border-b border-gray-200 -mb-px flex space-x-8">
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

        {/* Mainnet Alert */}
        {showMainnetAlert && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span className="ml-3 text-sm text-yellow-700">
              BitcoinQS is currently running on testnet. Mainnet launch coming soon!
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <span className="ml-3 text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute h-5 w-5 text-gray-400 left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            placeholder="Search by address, hash, or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Transaction Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4 sm:p-6 lg:p-8 animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{tx.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{tx.hash.substring(0, 16)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{tx.fromAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{tx.toAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tx.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Transaction Modal */}
        {selectedTx && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Transaction Hash</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedTx.hash}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">From Address</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedTx.fromAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">To Address</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedTx.toAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Amount</label>
                    <p className="mt-1 text-sm font-medium text-gray-900">{selectedTx.amount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Timestamp</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTx.timestamp}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}