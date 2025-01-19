import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import type { Network } from '../types/wallet';
import { websocketManager } from '../utils/WebSocketManager'; // WebSocket manager import
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
    const updateType = activeTab === 'transactions' ? 'all_transactions' : 'l1_proofs_testnet';
    const unsubscribe = websocketManager.subscribe(network, updateType, handleWebSocketMessage);

    return () => {
      unsubscribe();
    };
  }, [network, activeTab]);

  const handleWebSocketMessage = (data: any) => {
    if (data.type === 'transaction_update' && data.transactions) {
      const updatedTransactions = data.transactions.map((tx: any) => ({
        id: tx.id,
        hash: tx.hash,
        sender: tx.sender || 'N/A',
        receiver: tx.receiver || 'N/A',
        amount: tx.amount,
        timestamp: new Date(tx.timestamp).toLocaleString(),
        status: tx.status || 'confirmed',
      }));
      setTransactions(updatedTransactions);
      setIsLoading(false);
    } else if (data.type === 'l1proof_update' && data.proofs) {
      const updatedProofs = data.proofs.map((proof: any) => ({
        blockHeight: proof.blockHeight,
        merkleRoot: proof.merkleRoot,
        merkleProof: proof.merkleProof,
        bitcoinTxHash: proof.bitcoinTxHash,
        transactions: proof.transactions,
        timestamp: new Date(proof.timestamp).toLocaleString(),
        status: proof.status || 'confirmed',
      }));
      setL1Proofs(updatedProofs);
      setIsLoading(false);
    } else if (data.error) {
      console.error("WebSocket error:", data.error);
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
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Explorer</h1>

        {/* Network Selector */}
        <div className="border-b border-gray-200 mb-6">
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

        {/* Tab Selector */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`${
                  activeTab === 'transactions'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('l1proofs')}
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
                    <tr key={tx.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {tx.hash.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {tx.sender.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {tx.receiver.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{tx.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{tx.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  paginatedItems.map((proof) => (
                    <tr key={proof.merkleRoot} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {proof.merkleRoot.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {proof.bitcoinTxHash.substring(0, 16)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{proof.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          proof.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {proof.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}