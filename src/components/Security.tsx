import React from 'react';
import { Shield, Lock, Network, Server, AlertTriangle, Code, Coins, Clock, LineChart as ChartLine } from 'lucide-react';

export default function Security() {
  return (
    <div className="bg-gray-50 overflow-hidden" id="security">
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Original Security Section */}
        <div className="text-center mb-16">
          <h2 className="text-base text-orange-500 font-semibold tracking-wide uppercase">Security</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Quantum-Safe Bitcoin Layer 2
          </p>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
            Protecting Bitcoin's $1.8T economy against quantum threats through advanced cryptographic algorithms
          </p>
        </div>

        {/* Current Bitcoin Foundation */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900">Current Bitcoin Foundation</h3>
              <p className="text-gray-500 mt-2">Built on Pre-Quantum Era Cryptography</p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Inverse Pyramid */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-[300px]">
                  <div className="w-0 h-0 border-l-[150px] border-r-[150px] border-t-[300px]
                                border-l-transparent border-r-transparent border-t-orange-200" />
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 space-y-6">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-800 mb-2">$1.8T Economy at Risk</h4>
                  <p className="text-orange-700">Built on cryptographic foundations from the 1990s and early 2000s</p>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600">SHA-256 (Released 2001)</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600">ECDSA/secp256k1 (Released 1997)</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600">Pre-Quantum Cryptography</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bitcoin QS Solution */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-gray-900">Bitcoin QS Solution</h3>
              <p className="text-gray-500 mt-2">Built on Quantum-Resistant Foundation</p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Upright Pyramid */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative w-[300px]">
                  <div className="w-0 h-0 border-l-[150px] border-r-[150px] border-b-[300px]
                                border-l-transparent border-r-transparent border-b-emerald-200" />
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 space-y-6">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-emerald-800 mb-2">Secure $1.8T Economy</h4>
                  <p className="text-emerald-700">Built on quantum-resistant cryptographic foundations</p>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600">Layer 2 Quantum Protection</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600">Crystallis Dilithium</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600">Quantum-Resistant Foundation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="mt-8 bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <div className="flex items-center mb-4">
                <Code className="h-5 w-5 text-emerald-500 mr-2" />
                <span className="text-emerald-500 font-medium">Bitcoin QS Quantum-Safe Signing</span>
              </div>
              <pre className="text-sm text-gray-300">
                <code>{`const signature = crystalsDilithium.sign(messageHash, privateKey); // Quantum-resistant`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Security Model Section */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Security Model & Future Inflation Mechanism</h2>
            
            <div className="prose prose-orange max-w-none">
              <p className="lead text-justify">
                BitcoinQS is designed as a <strong>1:1 Bitcoin-pegged quantum-safe layer</strong> that ensures users can redeem BQS for BTC at any time. The system does not introduce new supply via mining, unlike Bitcoin L1, but rather <strong>collects fees through transactions</strong>. This model ensures a <strong>fixed supply</strong>, where BQS in circulation is always backed by BTC locked on the Bitcoin main chain.
              </p>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-8">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0" />
                  <p className="ml-3 text-orange-700 text-justify">
                    We need to <strong>prepare for a future scenario</strong> where <strong>Bitcoin L1 is no longer trusted</strong>, while BitcoinQS continues as a standalone chain. At that point, the peg mechanism would <strong>break</strong>, and we would need a way to introduce controlled <strong>supply inflation</strong> to mimic mining rewards <strong>without proof-of-work (PoW)</strong>.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Current Security Model (While Peg Exists)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-orange-500 mr-2" />
                    <h4 className="font-semibold">Validators</h4>
                  </div>
                  <p className="text-gray-600 text-justify">
                    Independent entities that validate BQS transactions and ensure consistency between Bitcoin L1 and BQS.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    <Lock className="h-6 w-6 text-orange-500 mr-2" />
                    <h4 className="font-semibold">Bitcoin L1 Anchoring</h4>
                  </div>
                  <p className="text-gray-600 text-justify">
                    Every BQS transaction is periodically anchored to Bitcoin, ensuring immutability and transparency.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Future Security Model (When Bitcoin L1 Becomes Untrusted)</h3>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h4 className="text-xl font-semibold mb-4">Fee-Based Staking (Replacing Mining)</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Coins className="h-5 w-5 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-600 text-justify">
                      Instead of miners securing the network, <strong>validators stake BQS to participate in block validation</strong>.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-600 text-justify">
                      Validators earn both transaction fees and inflation rewards through a controlled issuance of new BQS.
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="text-xl font-bold mb-4">Controlled Inflation Model</h4>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New BQS Issuance per Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reduction Rate</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Year 1-4</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">2% of Total Supply</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">50% Halving Every 4 Years</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Year 5-8</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">1% of Total Supply</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">50% Halving</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Year 9-12</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">0.5% of Total Supply</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">50% Halving</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Year 13+</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">0.25% of Total Supply</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Stabilized at Low Inflation</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-2xl font-bold mt-12 mb-6">Security Model Explanation for Users</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold mb-4">For Users Today (Pegged to Bitcoin)</h4>
                  <ul className="space-y-2 text-gray-600 text-justify">
                    <li>• BitcoinQS is 100% backed by BTC</li>
                    <li>• Validators ensure transaction consistency</li>
                    <li>• Anchoring to Bitcoin ensures immutability</li>
                    <li>• Post-Quantum Cryptography protects against future threats</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold mb-4">For Users in the Future (No Bitcoin Peg)</h4>
                  <ul className="space-y-2 text-gray-600 text-justify">
                    <li>• BQS becomes self-sovereign</li>
                    <li>• Security via staking-based model</li>
                    <li>• Transaction Fees + Controlled Inflation</li>
                    <li>• Algorithmically controlled issuance</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white mt-12">
                <h3 className="text-2xl font-bold mb-4">Final Thoughts</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Shield className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-justify">BitcoinQS remains pegged <strong>1:1 to BTC</strong> as long as Bitcoin L1 is functional.</span>
                  </li>
                  <li className="flex items-start">
                    <Lock className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-justify">Once Bitcoin L1 is no longer viable, BQS transitions into a <strong>staking-based economy</strong> with <strong>controlled inflation</strong>.</span>
                  </li>
                  <li className="flex items-start">
                    <Network className="h-5 w-5 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-justify">The security model shifts from Bitcoin anchoring to a <strong>validator-based consensus model</strong>.</span>
                  </li>
                </ul>
                <p className="mt-6 text-lg font-medium text-justify">
                  🚀 BitcoinQS is built for both the present and the future of decentralized, quantum-safe finance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}