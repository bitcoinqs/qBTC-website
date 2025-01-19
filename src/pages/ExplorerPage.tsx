import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ArrowLeft, X, AlertTriangle } from 'lucide-react';
import type { Network, Transaction } from '../types/wallet';
import { websocketManager } from '../utils/WebSocketManager';

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

  useEffect(() => {
    const manager = websocketManager(apiUrl);

    const subscription = manager.subscribe((data: any) => {
      if (data.type === 'transaction_update' && data.transactions) {
        const updatedTransactions = data.transactions.map((tx: any) => ({
          id: tx.id || 'N/A',
          type: tx.type || 'N/A',
          amount: tx.amount || 'N/A',
          address: tx.sender || tx.receiver || 'N/A',
          timestamp: tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'N/A',
          status: tx.status || 'N/A',
          hash: tx.hash || 'N/A',
        }));
        setTransactions(updatedTransactions);
      } else if (data.type === 'proof_update' && data.proofs) {
        setProofs(data.proofs);
      } else if (data.error) {
        console.error('WebSocket error:', data.error);
      }
    });

    manager.openConnection(network);

    return () => {
      subscription.unsubscribe();
      manager.closeConnection();
    };
  }, [network, activeTab]);

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

  const filteredItems = activeTab === 'proof'
    ? proofs.filter((proof) =>
        (proof.merkleRoot?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proof.btcTxHash?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : transactions.filter((tx) =>
        (tx.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.hash?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.amount?.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Transaction Explorer</h1>

        {/* Network/Proof Selector */}
        <div className="mb-6">
          <nav className="-mb-px flex space-x-8">
            {['mainnet', 'testnet', 'proof'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleNetworkChange(tab as 'mainnet' | 'testnet' | 'proof')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'proof' ? 'Bitcoin L1 Anchoring Proof' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {showMainnetAlert && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <p className="ml-3 text-sm text-yellow-700">
                BitcoinQS is currently running on testnet. Mainnet launch coming soon!
              </p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
            placeholder={
              activeTab === 'proof'
                ? 'Search by merkle root or transaction hash...'
                : 'Search by address, hash, or amount...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              {activeTab === 'proof' ? (
                <tr>
                  <th>Merkle Root</th>
                  <th>Bitcoin Tx Hash</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              ) : (
                <tr>
                  <th>Hash</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              )}
            </thead>
            <tbody>
              {paginatedItems.map((item, idx) => (
                <tr key={idx}>
                  {activeTab === 'proof' ? (
                    <>
                      <td>{item.merkleRoot || 'N/A'}</td>
                      <td>{item.btcTxHash || 'N/A'}</td>
                      <td>{item.timestamp || 'N/A'}</td>
                      <td>{item.status}</td>
                    </>
                  ) : (
                    <>
                      <td>{item.hash || 'N/A'}</td>
                      <td>{item.address || 'N/A'}</td>
                      <td>{item.amount || 'N/A'}</td>
                      <td>{item.status}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}