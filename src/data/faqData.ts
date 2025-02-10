// FAQ Data organized by category
export const generalFAQs = [
  {
    question: "What is Bitcoin QS?",
    answer: "Bitcoin QS is a quantum-safe Layer 2 solution for Bitcoin, designed to protect assets against  quantum computing threats while maintaining compatibility with the existing Bitcoin network."
  },
  {
    question: "How does Bitcoin QS work?",
    answer: "Bitcoin QS implements post-quantum cryptographic algorithms on a Layer 2 network that runs parallel to Bitcoin's main chain, providing quantum-resistant security while preserving Bitcoin's core features."
  },
  {
    question: "Is Bitcoin QS compatible with regular Bitcoin?",
    answer: "Yes, Bitcoin QS is fully compatible with the Bitcoin network. You can easily bridge your BTC to quantum-safe BQS tokens and back using our secure bridge protocol."
  }
];

export const technicalFAQs = [
  {
    question: "What cryptographic algorithms does Bitcoin QS use?",
    answer: "Bitcoin QS uses NIST-approved lattice-based cryptography, specifically designed to resist attacks from both classical and quantum computers. The signing scheme used in BitcoinQS is CRYSTALS-Dilithium. Dilithim is a lattice-based digital signature scheme whose security is based on the hardness of finding short vectors in lattices. The CRYSTALS-Dilithium Digital Signature Algorithm is a member of the CRYSTALS (Cryptographic Suite for Algebraic Lattices) suite of algorithms. The strength of a CRYSTALS-Dilithium key is represented by the size of its matrix of polynomials. For example, CRYSTALS-Dilithium (6,5) has a matrix size of 6x5. The larger the matrix size, the stronger the key. CRYSTALS-Dilithium keys can only be used for Digital Signature Generation and Verification."
  },
  {
    question: "How does the bridge process work?",
    answer: "The bridge process involves sending your BTC to a deposit address  and minting an equivalent amount of BQS tokens. These tokens can be converted back to BTC at any time through the same bridge."
  },
  {
    question: "What are the transaction fees?",
    answer: "Transaction fees on the Bitcoin QS network are typically lower than Bitcoin's main chain, as our Layer 2 solution enables more efficient processing while maintaining security."
  },
   {
    question: "How fast is BitcoinQS ?",
    answer: "Transactions on BitcoinQS settle instantly on the BitcoinQS L2 with full finality and quantum security. BitcoinQS batches 10 transactions at a time, performs a Merkle Root and posts these to the Bitcoin mainnet"
  },
     {
    question: "How do you ensure that nobody can re-order the BitcoinQS chain?",
    answer: "BitcoinQS batches 10 transactions at a time, performs a Merkle Root and posts the Merkle Root  to the Bitcoin mainnet. Anyone can confirm their BitcoinQS balance is represented in the Bitcoin mainnet Merkle Root"
  },
  {
    question: "If the Bitcoin Mainnet is compromised wont that affect the ordering of BitcoinQ2 L2 transactions",
    answer: "To protect against this, BitcoinQS has a few fall back mechanisms. Firstly, the state is also written to append-only tamper-evident logs off chain using hash chaining. Furthermore we have implemented detection mechanisms to identify if there's any dispute between BQS and BTC states. Finally, we are evaluating cross-chain anchoring i.e anchoring state to multiple chains simultaneously. "
  },
  {
  question: "What happens if Bitcoin L1 is hacked, wont Bitcoin become worthless and wont therefore BitcoinQS be worthless too?",
  answer: "BitcoinQS employs a dual-hedging strategy to maintain both USD purchasing power and 1:1 Bitcoin redemption. To protect against Bitcoin price drops, it utilizes BTC-backed stablecoin loans, put options, and perpetual futures. To ensure 1:1 BTC redemption, it maintains a dedicated BTC reserve, implements delta-neutral hedging, and dynamically rebalances its holdings. This ensures that users can always withdraw the exact amount of Bitcoin they deposited, regardless of market fluctuations."
  }
];

export const walletFAQs = [
  {
    question: "How do I store my BQS tokens?",
    answer: "You can store BQS tokens in any Bitcoin QS-compatible wallet. We recommend using our official web or mobile wallets for the best security and features."
  },
  {
    question: "Do you have access to my keys?",
    answer: "BitcoinQS is non-custodial. When you generate a BitcoinQS wallet, this happens entirely in your browser. At no point does Bitcoinqs.org have access to your keys. These remain in your possession always. When you sign a transaction you also perform this action in your browser and only send BitcoinQS the signature and your public key. This ensures that your private key is always safe"
  },
  {
    question: "Are my assets safe against quantum attacks?",
    answer: "Yes, all transactions and storage on the Bitcoin QS network are protected by quantum-resistant cryptography, ensuring your assets remain secure even against future quantum computers."
  },
  {
    question: "What happens if I lose my wallet?",
    answer: "Like any crypto wallet, if you lose your wallet you will risk losing any assets stored within this. It is therefore crucial to ensure that you backup your wallet"
  }
];