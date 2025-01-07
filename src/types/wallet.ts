export type Network = 'mainnet' | 'testnet';

export type WalletFile = {
  address: string;
  publicKey: string;
  privateKey: string;
  network: Network;
};

export type Transaction = {
  id: string;
  type: 'send' | 'receive' | 'bridge';
  amount: string;
  address: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
  fee?: string;
  blockHeight?: number;
  confirmations?: number;
  hash?: string;
  memo?: string;
};