import React from 'react';
import { Shield, Lock, Network, Server, AlertTriangle, Code } from 'lucide-react';

export default function Security() {
  return (
    <div className="bg-gray-50 overflow-hidden" id="security">
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Main Security Section */}
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

            {/* Code Example */}
            <div className="mt-8 bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <div className="flex items-center mb-4">
                <Code className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-orange-500 font-medium">Current Bitcoin Signing (Vulnerable)</span>
              </div>
              <pre className="text-sm text-gray-300">
                <code>{`const signature = secp256k1.sign(messageHash, privateKey); // Vulnerable to quantum attacks`}</code>
              </pre>
            </div>
          </div>

          {/* Warning Box */}
          <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Critical Security Risk</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>Bitcoin's current cryptographic foundation relies on algorithms that NIST considers obsolete by 2035. This poses a significant risk to the entire Bitcoin ecosystem as quantum computing advances.</p>
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
                    <p className="text-gray-600">Lattice-Based Cryptography</p>
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

        {/* Technical Details */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Technical Implementation</h3>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Vulnerabilities</h4>
              <ul className="space-y-4 text-gray-600">
                <li>• SHA-256 (Released 2001) - Vulnerable to quantum attacks</li>
                <li>• ECDSA/secp256k1 (Released 1997) - Will be broken by quantum computers</li>
                <li>• NIST mandates transition from current algorithms by 2035</li>
                <li>• $1.8T economy at risk from quantum advancement</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Bitcoin QS Solution</h4>
              <ul className="space-y-4 text-gray-600">
                <li>• Implements NIST-approved lattice-based cryptography</li>
                <li>• Quantum-resistant Layer 2 protection</li>
                <li>• Future-proof security architecture</li>
                <li>• Preserves and protects Bitcoin's value</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-orange-50 border-l-4 border-orange-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-orange-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Protect Your Bitcoin</h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>Don't wait until quantum computers threaten your assets. Start securing your Bitcoin with quantum-resistant protection today.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}