import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import type { Network, Transaction } from '../types/wallet';
import {websocketManager} from '../utils/WebSocketManager'
const apiUrl = import.meta.env.VITE_API_URL;

type Proof = {
  id: string;
  merkleRoot: string;
  btcTxHash: string;
  timestamp: string;
  status: 'confirmed' | 'failure';
  transactions: Transaction[];
};

export default function ExplorerPage() {
  const [network, setNetwork] = useState<Network>('testnet');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [activeTab, setActiveTab] = useState<'mainnet' | 'testnet' | 'proof'>('testnet');
  const [showMainnetAlert, setShowMainnetAlert] = useState(false);

  const itemsPerPage = 10;


  const transformWebSocketData = (wsData: any): Transaction[] => {
  return wsData.transactions.map((tx: any) => ({
    id: tx.id.toString(),
    type: tx.sender === tx.receiver ? 'bridge' : tx.sender === 'bqs1...' ? 'send' : 'receive', // Example logic for `type`
    amount: `${parseFloat(tx.amount.split(' ')[0]).toFixed(4)} BQT`, // Adjust token and format decimals
    address: tx.sender === 'bqs1...' ? tx.receiver : tx.sender, // Logic for determining address
    timestamp: tx.timestamp,
    status: 'confirmed', // Default status as 'confirmed'; adjust if needed
    hash: tx.hash,
  }));
};

  // Generate mock transactions
  const mockTransactions: Transaction[] = Array.from({ length: 100 }, (_, i) => ({
  id: i.toString(),
  type: ['send', 'receive', 'bridge'][Math.floor(Math.random() * 3)] as Transaction['type'],
  amount: `${(Math.random() * 10).toFixed(4)} BQT`,
  address: `qs1q${Math.random().toString(36).substring(2, 15)}`,
  timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  status: Math.random() > 0.3 ? 'confirmed' : 'pending',
  hash: `0x${Math.random().toString(36).substring(2, 40)}`,
}));

const mockProofs: Proof[] = Array.from({ length: 20 }, (_, i) => ({
  id: i.toString(),
  merkleRoot: `0x${Math.random().toString(36).substring(2, 40)}`,
  btcTxHash: `0x${Math.random().toString(36).substring(2, 40)}`,
  timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  status: Math.random() > 0.2 ? 'confirmed' : 'failure',
  transactions: mockTransactions.slice(0, 5), // Ensure mock proofs always include transactions
}));

  useEffect(() => {
    const socket = initializeWebSocket();
    return () => {
      // Clean up WebSocket on component unmount
      if (socket) socket.close();
    };

  }, [network, activeTab]);


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
          setTransactions(mockTransactions);
          setProofs(mockProofs)
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

  

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTransactions(mockTransactions);
      setProofs(mockProofs);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNetworkChange = async (newTab: 'mainnet' | 'testnet' | 'proof') => {
    if (newTab === 'mainnet') {
      setShowMainnetAlert(true);
      return;
    }
    setShowMainnetAlert(false);
    setActiveTab(newTab);
    if (newTab !== 'proof') {
      setNetwork(newTab);
    }
  };

  const filteredItems =
  activeTab === "proof"
    ? proofs.filter((proof) =>
        [proof.merkleRoot, proof.btcTxHash]
          .filter(Boolean) // Ensure the values exist
          .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : transactions.filter((tx) =>
        [tx.address, tx.hash, tx.amount, tx.type]
          .filter(Boolean) // Ensure the values exist
          .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

        {/* Network/Proof Selector */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleNetworkChange('mainnet')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mainnet'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mainnet
              </button>
              <button
                onClick={() => handleNetworkChange('testnet')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'testnet'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Testnet
              </button>
              <button
                onClick={() => handleNetworkChange('proof')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'proof'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Bitcoin L1 Anchoring Proof
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder={activeTab === 'proof' 
                ? "Search by merkle root or transaction hash..."
                : "Search by address, hash, or amount..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === 'proof' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merkle Root</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bitcoin Tx Hash</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={activeTab === 'proof' ? 4 : 5} className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'proof' ? (
                  paginatedItems.map((proof) => (
                    <tr
                      key={proof.id}
                      onClick={() => setSelectedProof(proof as Proof)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {proof.merkleRoot.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {proof.btcTxHash.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(proof.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          proof.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {proof.status === 'confirmed' ? 'Hash confirmed' : 'Hash failure'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  paginatedItems.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx as Transaction)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {tx.hash.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {tx.address.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {tx.address.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{tx.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Proof Modal */}
        {selectedProof && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Anchoring Proof Details</h3>
                <button
                  onClick={() => setSelectedProof(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Merkle Root</label>
                      <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedProof.merkleRoot}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedProof.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Bitcoin Transaction Hash</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedProof.btcTxHash}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedProof.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedProof.status === 'confirmed' ? 'Hash confirmed' : 'Hash failure'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Included Transactions</label>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hash</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedProof.transactions.map((tx) => (
                            <tr 
                              key={tx.id} 
                              className="hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedProof(null);
                                setSelectedTx(tx);
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                                {tx.hash}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                                {tx.address.substring(0, 16)}...
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                                {tx.address.substring(0, 16)}...
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{tx.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                    <label className="block text-sm font-medium text-gray-500">From</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedTx.address}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">To</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedTx.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Amount</label>
                      <p className="mt-1 text-sm font-medium text-gray-900">{selectedTx.amount}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status</label>
                      <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedTx.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedTx.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">Timestamp</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedTx.timestamp).toLocaleString()}
                    </p>
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