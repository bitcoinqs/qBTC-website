import React from 'react';
import BridgeModal from '../bridge/BridgeModal';
import SendModal from '../SendModal';
import ReceiveModal from '../ReceiveModal';
import TransactionModal from '../TransactionModal';
import type { Network, WalletFile, Transaction } from '../../types/wallet';

type Props = {
  modalState: {
    bridge: boolean;
    send: boolean;
    receive: boolean;
  };
  toggleModal: (modal: string) => void;
  selectedTransaction: Transaction | null;
  onCloseTransaction: () => void;
  network: Network;
  wallet: WalletFile;
};

export function WalletModals({
  modalState,
  toggleModal,
  selectedTransaction,
  onCloseTransaction,
  network,
  wallet,
}: Props) {
  return (
    <>
      <BridgeModal
        isOpen={modalState.bridge}
        onClose={() => toggleModal('bridge')}
        network={network}
        wallet={wallet}
      />
      
      <SendModal
        isOpen={modalState.send}
        onClose={() => toggleModal('send')}
        network={network}
      />
      
      <ReceiveModal
        isOpen={modalState.receive}
        onClose={() => toggleModal('receive')}
        network={network}
        wallet={wallet}
      />

      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          isOpen={!!selectedTransaction}
          onClose={onCloseTransaction}
        />
      )}
    </>
  );
}