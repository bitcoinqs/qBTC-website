import { useState, useEffect, useRef } from 'react';
import { useWalletContext } from '../context/WalletContext';
import type { Transaction } from '../types/wallet';
import { websocketManager } from '../utils/websocketManager';

const apiUrl = import.meta.env.VITE_API_URL;

export function useWallet() {
  const { wallet, network, setNetwork } = useWalletContext();
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const currentWallet = useRef<string | null>(null);
  const currentNetwork = useRef<string | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${apiUrl}/ws`;

  // Helper function to send periodic pings
  const startPing = () => {
    console.log("[useWallet] Starting periodic ping...");
    pingIntervalRef.current = setInterval(() => {
      console.log("[useWallet] Sending ping...");
      websocketManager.send(wsUrl, { type: 'ping' });
    }, 30000); // Ping every 30 seconds
  };

  const stopPing = () => {
    if (pingIntervalRef.current) {
      console.log("[useWallet] Stopping periodic ping...");
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
  };

  // Helper function to handle WebSocket messages
  const handleWebSocketMessage = (data: any) => {
    console.log("[useWallet] WebSocket message received:", data);

    if (data.type === 'combined_update') {
      console.log("[useWallet] Combined update received:", data);

      // Update balance
      if (data.balance !== undefined) {
        console.log("[useWallet] Updating balance:", data.balance);
        setBalance(data.balance);
      }

      // Update transactions
      if (data.transactions) {
        const formattedTransactions = data.transactions.map((tx: any) => ({
          id: tx.id.toString(),
          type: tx.type,
          amount: tx.amount,
          address: tx.address,
          timestamp: new Date(tx.timestamp).toLocaleString(),
          status: 'confirmed', // Default to confirmed; adapt if needed
          hash: tx.hash || 'N/A',
        }));
        setTransactions(formattedTransactions);
        setIsLoading(false);
      }
    }
  };

  // Manage WebSocket subscriptions for combined balance and transactions
  useEffect(() => {
    if (!wallet || !network) {
      console.log("[useWallet] No wallet or network specified; skipping WebSocket setup.");
      return;
    }

    // Check if wallet or network has changed
    if (
      wallet.address === currentWallet.current &&
      network === currentNetwork.current
    ) {
      console.log("[useWallet] Wallet and network unchanged; no action required.");
      return;
    }

    currentWallet.current = wallet.address;
    currentNetwork.current = network;

    console.log("[useWallet] Subscribing to WebSocket updates for combined updates.");

    // Subscribe to WebSocket messages
    websocketManager.subscribe(wsUrl, handleWebSocketMessage);

    // Send a subscription request for combined updates
    websocketManager.send(wsUrl, {
      wallet_address: wallet.address,
      update_type: 'combined_update', // Expect combined updates for balance and transactions
      network,
    });

    // Start periodic pings
    startPing();

    return () => {
      console.log("[useWallet] Cleaning up WebSocket subscriptions.");
      websocketManager.unsubscribe(wsUrl, handleWebSocketMessage);
      stopPing(); // Stop pings on cleanup
    };
  }, [wallet, network]);

  const handleNetworkSwitch = () => {
    console.log("[useWallet] Network switched:", network);
    setNetwork(network === 'mainnet' ? 'testnet' : 'mainnet');
  };

  const getNetworkColors = () => {
    return network === 'mainnet'
      ? 'bg-orange-500 hover:bg-orange-600'
      : 'bg-purple-500 hover:bg-purple-600';
  };

  const getNetworkLightColors = () => {
    return network === 'mainnet'
      ? 'bg-orange-100 text-orange-800'
      : 'bg-purple-100 text-purple-800';
  };

  return {
    network,
    wallet,
    balance,
    isLoading,
    transactions,
    handleNetworkSwitch,
    getNetworkColors,
    getNetworkLightColors,
  };
}