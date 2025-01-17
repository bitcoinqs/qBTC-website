import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Network, WalletFile } from '../types/wallet';

type WalletContextType = {
  wallet: WalletFile | null;
  network: Network;
  setWallet: (wallet: WalletFile | null) => void;
  setNetwork: (network: Network) => void;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Force testnet as default
  const [wallet, setWallet] = useState<WalletFile | null>(() => {
    const saved = localStorage.getItem('wallet');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [network, setNetwork] = useState<Network>('testnet');

  useEffect(() => {
    if (wallet) {
      localStorage.setItem('wallet', JSON.stringify(wallet));
    } else {
      localStorage.removeItem('wallet');
    }
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('network', network);
  }, [network]);

  const disconnect = () => {
    setWallet(null);
    localStorage.removeItem('wallet');
  };

  return (
    <WalletContext.Provider value={{ wallet, network, setWallet, setNetwork, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}