import { useState, useEffect, useRef } from 'react';
import { useWalletContext } from '../context/WalletContext';
import type { Transaction } from '../types/wallet';

const env = import.meta.env.VITE_ENV;
const apiUrl = import.meta.env.VITE_API_URL;

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: '0.5 BQS',
    address: 'qs1q123...456',
    timestamp: '2024-03-20 15:30',
    status: 'confirmed',
    hash: '0x123...456',
  },
  {
    id: '2',
    type: 'send',
    amount: '0.2 BQS',
    address: 'qs1q789...012',
    timestamp: '2024-03-20 14:45',
    status: 'pending',
  },
  {
    id: '3',
    type: 'bridge',
    amount: '1.0 BTC → BQS',
    address: 'bc1q345...678',
    timestamp: '2024-03-20 13:15',
    status: 'confirmed',
    hash: '0x789...012',
  },
];

export function useWallet() {
  const { wallet, network, setNetwork } = useWalletContext();
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState('');
  const balanceSocketRef = useRef<WebSocket | null>(null);
  const currentWallet = useRef<string | null>(null);
  const currentNetwork = useRef<string | null>(null);

  useEffect(() => {
    console.log("Wallet or network changed:", wallet, network);

    if (!wallet || (wallet.address === currentWallet.current && network === currentNetwork.current)) {
      console.log("No changes in wallet or network, skipping WebSocket setup.");
      return;
    }

    currentWallet.current = wallet.address;
    currentNetwork.current = network;

    if (balanceSocketRef.current) {
      console.log("Closing existing WebSocket connection...");
      balanceSocketRef.current.close();
      balanceSocketRef.current = null;
    }

    const newSocket = fetchBalance(wallet, network);
    balanceSocketRef.current = newSocket;

    fetchTransactions();

    return () => {
      if (balanceSocketRef.current) {
        console.log("Cleaning up WebSocket connection...");
        balanceSocketRef.current.close();
        balanceSocketRef.current = null;
      }
    };
  }, [wallet, network]);

  const fetchBalance = (walletAddress, network) => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const websocketUrl = `${wsProtocol}//${apiUrl}/ws`;

    console.log("Initiating WebSocket for balance updates...");

    try {
      const socket = new WebSocket(websocketUrl);

      socket.onopen = () => {
        console.log("WebSocket connection established for balance updates");
        socket.send(JSON.stringify({ wallet_address: walletAddress.address, update_type: "balance", network }));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket balance update:", data);

        if (data.type === "balance_update" && data.balance !== undefined) {
          setBalance(data.balance);
        } else if (data.error) {
          console.error("Error received from balance WebSocket:", data.error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error for balance updates:", error);
        alert("An error occurred with the WebSocket connection for balance updates.");
        socket.close();
      };

      socket.onclose = () => {
        console.log("WebSocket connection for balance updates closed");
      };

      return socket;
    } catch (error) {
      console.error("Error initializing WebSocket for balance updates:", error);
      return null;
    }
  };




const fetchTransactions = () => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const websocketUrl = `${wsProtocol}//${apiUrl}/ws`;

  console.log("Initiating WebSocket for transaction updates...");
  try {
    const socket = new WebSocket(websocketUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established for transaction updates");
      socket.send(JSON.stringify({ wallet_address: wallet.address, update_type: "transactions" }));
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

    if (data.balance !== undefined) {
      setBalance(data.balance);
    }
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

  const handleNetworkSwitch = () => {
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
