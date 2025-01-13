import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { WalletConnect } from '../components/wallet/WalletConnect';
import { WalletHeader } from '../components/wallet/WalletHeader';
import { WalletActions } from '../components/wallet/WalletActions';
import { TransactionHistory } from '../components/wallet/TransactionHistory';
import { WalletModals } from '../components/wallet/WalletModals';
import type { Transaction } from '../types/wallet';

export default function WalletDashboard() {
  const {
    network,
    wallet,
    balance,
    isLoading,
    transactions,
  } = useWallet();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalState, setModalState] = useState({
    bridge: false,
    send: false,
    receive: false,
    generate: false,
    connect: false
  });

  const toggleModal = (modal: keyof typeof modalState) => {
    setModalState(prev => ({ ...prev, [modal]: !prev[modal] }));
  };

  /*const handleNetworkSwitch = () => {
    setNetwork(network === 'mainnet' ? 'testnet' : 'mainnet');
  };*/

  const getNetworkColors = () => {
    return network === 'mainnet'
      ? 'bg-orange-500 hover:bg-orange-600'
      : 'bg-purple-500 hover:bg-purple-600';
  };

  if (!wallet) {
    return (
      <WalletConnect
        isModalOpen={modalState.connect}
        isGenerateModalOpen={modalState.generate}
        onToggleConnect={() => toggleModal('connect')}
        onToggleGenerate={() => toggleModal('generate')}
        network={network}
        getNetworkColors={getNetworkColors}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WalletHeader
          network={network}
          balance={balance}
          address={wallet.address}
          handleNetworkSwitch={handleNetworkSwitch}
        />

        <WalletActions
          network={network}
          onBridge={() => toggleModal('bridge')}
          onSend={() => toggleModal('send')}
          onReceive={() => toggleModal('receive')}
        />

        <TransactionHistory
          isLoading={isLoading}
          transactions={transactions}
          onSelectTransaction={setSelectedTransaction}
        />

        <WalletModals
          modalState={modalState}
          toggleModal={toggleModal}
          selectedTransaction={selectedTransaction}
          onCloseTransaction={() => setSelectedTransaction(null)}
          network={network}
          wallet={wallet}
        />
      </div>
    </div>
  );
}