import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ArrowLeft, X, AlertTriangle, GitMerge } from 'lucide-react';
import type { Network } from '../types/wallet';
import {websocketManager} from '../utils/WebSocketManager'
const apiUrl = import.meta.env.VITE_API_URL;


type Transaction = {
  id: string;
  hash: string;
  sender: string;
  receiver: string;
  amount: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
};

type MerkleProof = {
  index: number;
  hash: string;
  siblings: string[];
};

type L1Proof = {
  blockHeight: number;
  merkleRoot: string;
  merkleProof: MerkleProof;
  bitcoinTxHash: string;
  bitcoinBlockHash: string;
  bitcoinBlockHeight: number;
  timestamp: string;
  transactions: string[]; // Transaction IDs
  status: 'confirmed' | 'failed';
};

export default function ExplorerPage() {
  const [network, setNetwork] = useState<Network>('testnet');
  const [activeTab, setActiveTab] = useState<'transactions' | 'l1proofs'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [l1proofs, setL1Proofs] = useState<L1Proof[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedProof, setSelectedProof] = useState<L1Proof | null>(null);
  const [showMainnetAlert, setShowMainnetAlert] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    if (activeTab === 'transactions') {
      const socket = initializeWebSocket();
    } else {
      fetchL1Proofs();
    }
  }, [network, activeTab]);


  const initializeWebSocket = () => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const websocketUrl = `${wsProtocol}//${apiUrl}/ws`;

    try {
      const socket = new WebSocket(websocketUrl);

      socket.onopen = () => {
        setIsLoading(true);
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
            status: tx.status,
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


  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
        id: `tx-${i}`,
        hash: `0x${Math.random().toString(36).substring(2, 40)}`,
        sender: `qs1${Math.random().toString(36).substring(2, 15)}`,
        receiver: `qs1${Math.random().toString(36).substring(2, 15)}`,
        amount: `${(Math.random() * 10).toFixed(8)} BQS`,
        timestamp: new Date(Date.now() - i * 600000).toISOString(),
        status: Math.random() > 0.1 ? 'confirmed' : Math.random() > 0.5 ? 'pending' : 'failed'
      }));
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchL1Proofs = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockProofs: L1Proof[] = Array.from({ length: 50 }, (_, i) => ({
        blockHeight: 1000000 + i,
        merkleRoot: `0x${Math.random().toString(36).substring(2, 40)}`,
        merkleProof: {
          index: Math.floor(Math.random() * 100),
          hash: `0x${Math.random().toString(36).substring(2, 40)}`,
          siblings: Array.from({ length: 4 }, () => 
            `0x${Math.random().toString(36).substring(2, 40)}`
          )
        },
        bitcoinTxHash: `0x${Math.random().toString(36).substring(2, 40)}`,
        bitcoinBlockHash: `0x${Math.random().toString(36).substring(2, 40)}`,
        bitcoinBlockHeight: 800000 + i,
        timestamp: new Date(Date.now() - i * 600000).toISOString(),
        transactions: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => 
          `tx-${Math.floor(Math.random() * 50)}`
        ),
        status: Math.random() > 0.1 ? 'confirmed' : 'failed'
      }));
      setL1Proofs(mockProofs);
    } catch (error) {
      console.error('Failed to fetch L1 proofs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNetworkChange = async (newNetwork: Network) => {
    if (newNetwork === 'mainnet') {
      setShowMainnetAlert(true);
      return;
    }
    setShowMainnetAlert(false);
    setNetwork(newNetwork);
    setCurrentPage(1);
  };

  const getTransactionById = (id: string) => {
    return transactions.find(tx => tx.id === id);
  };

  const filteredItems = activeTab === 'transactions' 
    ? transactions.filter(tx =>
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.receiver.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : l1proofs.filter(proof =>
        proof.merkleRoot.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proof.bitcoinTxHash.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-semibold text-gray-900">Explorer</h1>
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

        {/* Tab Selector */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('transactions');
                  setCurrentPage(1);
                }}
                className={`${
                  activeTab === 'transactions'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Transactions
              </button>
              <button
                onClick={() => {
                  setActiveTab('l1proofs');
                  setCurrentPage(1);
                }}
                className={`${
                  activeTab === 'l1proofs'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                L1 Proofs
              </button>
            </nav>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder={activeTab === 'transactions' 
                ? "Search by transaction hash or address..."
                : "Search by merkle root or Bitcoin transaction hash..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === 'transactions' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merkle Root</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bitcoin TX</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={6} className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'transactions' ? (
                  paginatedItems.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTransaction(tx as Transaction)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {tx.hash ? `${tx.hash.substring(0, 16)}...` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {tx.sender ? `${tx.sender.substring(0, 16)}...` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {tx.receiver ? `${tx.receiver.substring(0, 16)}...` : 'N/A'}
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(tx as Transaction).amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date((tx as Transaction).timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (tx as Transaction).status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : (tx as Transaction).status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(tx as Transaction).status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  paginatedItems.map((proof) => (
                    <tr
                      key={(proof as L1Proof).merkleRoot}
                      onClick={() => setSelectedProof(proof as L1Proof)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {(proof as L1Proof).merkleRoot.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {(proof as L1Proof).bitcoinTxHash.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(proof as L1Proof).transactions.length} transactions
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date((proof as L1Proof).timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          (proof as L1Proof).status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(proof as L1Proof).status}
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

        {/* Transaction Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Transaction Hash</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedTransaction.hash}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">From</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedTransaction.sender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">To</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedTransaction.receiver}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTransaction.amount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Time</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedTransaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedTransaction.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : selectedTransaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* L1 Proof Modal */}
        {selectedProof && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">L1 Proof Details</h3>
                <button
                  onClick={() => setSelectedProof(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Merkle Root</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedProof.merkleRoot}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Bitcoin Transaction Hash</label>
                    <p className="mt-1 text-sm font-mono break-all text-gray-900">{selectedProof.bitcoinTxHash}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Included Transactions</label>
                    <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                      {selectedProof.transactions.map((txId) => {
                        const tx = getTransactionById(txId);
                        return tx ? (
                          <div 
                            key={tx.id} 
                            className="p-4 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedTransaction(tx);
                              setSelectedProof(null);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-sm">{tx.hash.substring(0, 16)}...</span>
                              <span className="text-sm text-gray-500">{tx.amount}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(tx.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
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