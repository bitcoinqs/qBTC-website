// FAQ Data organized by category
export const generalFAQs = [
  {
    question: "What is BitcoinQS?",
    answer: "BitcoinQS is a quantum-safe proof-of-work rollup, designed to protect assets against  quantum computing threats while maintaining compatibility with the existing Bitcoin network."
  },
  {
    question: "How does BitcoinQS work?",
    answer: "BitcoinQS implements post-quantum cryptographic algorithms on a proof-of-work rollup network that runs parallel to Bitcoin's main chain, providing quantum-resistant security while preserving Bitcoin's core features."
  },
  {
    question: "Is BitcoinQS compatible with regular Bitcoin?",
    answer: "Yes, BitcoinQS is fully compatible with the Bitcoin network. You can easily bridge your BTC to quantum-safe qBTC and back using our secure bridge protocol."
  }
];

export const technicalFAQs = [
  {
    question: "What cryptographic algorithms does BitcoinQS use?",
    answer: "BitcoinQS uses NIST-approved lattice-based cryptography, specifically designed to resist attacks from both classical and quantum computers. The signing scheme used in qBTC is NIST ML-DSA. ML-DSA is a lattice-based digital signature scheme whose security is based on the hardness of finding short vectors in lattices. ML-DSA Digital Signature Algorithm is a member of the CRYSTALS (Cryptographic Suite for Algebraic Lattices) suite of algorithms. The strength of a ML-DSA key is represented by the size of its matrix of polynomials. For example, ML-DSA (6,5) has a matrix size of 6x5. The larger the matrix size, the stronger the key. ML-DSA keys can only be used for Digital Signature Generation and Verification."
  },
  {
    question: "How does the bridge process work?",
    answer: "The bridge process involves sending your BTC to a deposit address and receiving an equivalent amount of qBTC which can be converted back to BTC through the same bridge."
  },
  {
    question: "What are the transaction fees?",
    answer: "Transaction fees on the BitcoinQS network are typically less than than Bitcoin's main chain, as our proof-of-work rollup solution enables more efficient processing while maintaining security."
  },
   {
    question: "How fast is BitcoinQS ?",
    answer: "BitcoinQS maintains the same 10 minute block time target as Bitcoin and transactions on settle with full finality and quantum security. BitcoinQS batches 10 blocks at a time, performs a Merkle Root and posts these to the Bitcoin mainnet. "
  },
     {
    question: "How do you ensure that nobody can re-order the BitcoinQS chain?",
    answer: "BitcoinQS batches 10 blockstransactions at a time, performs a Merkle Root and posts the Merkle Root  to the Bitcoin mainnet. Anyone can confirm their BitcoinQS balance is represented in the Bitcoin mainnet Merkle Root."
  },
  {
    question: "Will BitcoinQS be compromised if Bitcoin Mainnet is compromised due to a quantum attack?",
    answer: "No. BitcoinQS produces blocks and verifies transactions completely independently of Bitcoin mainnet.  All coins and transactions on BitcoinQS are protected against quantum attacks by default.  To prevent BTC that is stolen by a quantum attacker from moving to BitcoinQS, a decentralized consensus mechanism will permanently shut off the BTC -> qBTC bridge when the threat of a quantum attack is near."
  },
 /* {
  question: "What if a quantum computer is able to successfully crack legacy Bitcoin wallet (ECDSA) private keys, and reintroduce “lost” coins into circulation?",
  answer: "After Q-day…"
  } */
];

export const walletFAQs = [
  {
    question: "How do I store my qBTC tokens?",
    answer: "You can store qBTC tokens in any BitcoinQS-compatible wallet. We recommend using our official web or mobile wallets for the best security and features.  We are working with industry leading hardware wallet providers to ensure maximum compatibility with existing devices.  Please see our website for the most up to date wallet compatibility."
  },
  {
    question: "Do you have access to my keys?",
    answer: "BitcoinQS is non-custodial and maintains the ethos of Bitcoin - not your keys, not your coins. Neither this website nor anyone other than the end users has access to the quantum safe private keys. Users can generate key pairs completely trustlessly using open source software."
  },
  {
    question: "Are my qBTC assets safe against quantum attacks?",
    answer: "Yes, all transactions and storage on the BitcoinQS network are protected by quantum-resistant cryptography, ensuring your assets remain secure even against future quantum computers."
  },
  {
    question: "What happens if I lose my wallet and private keys?",
    answer: "As with Bitcoin, it is your responsibility to maintain secure backups of your private keys.  No one can access your qBTC without your private keys, including you.  We recommend following industry standard best practices to ensure that you maintain access to your qBTC. "
  }
];

