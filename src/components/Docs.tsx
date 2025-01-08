import React from 'react';
import { Terminal, Server, ArrowRight, Database } from 'lucide-react';

export default function Docs() {
  return (
    <div className="bg-white" id="docs">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-orange-500 font-semibold tracking-wide uppercase">Documentation</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            API Reference 
          </p>
        </div>

        {/* 
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Quick Start</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <pre className="overflow-x-auto">
              <code className="text-sm">{`
# Install Bitcoin QS Node
npm install -g bitcoin-qs-node

# Initialize node with your Bitcoin Core credentials
bitcoin-qs init --rpc-user=your_user --rpc-pass=your_pass

# Start the node
bitcoin-qs start
              `.trim()}</code>
            </pre>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Bridge API</h3>
          <div className="space-y-8">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Bridge Bitcoin to Layer 2</h4>
              </div>
              <div className="px-6 py-4">
                <pre className="overflow-x-auto">
                  <code className="text-sm">{`
POST /v1/bridge/deposit
{
  "btcAddress": "bc1q...",
  "amount": "1.5",
  "qsAddress": "qs1q..."
}
                  `.trim()}</code>
                </pre>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Withdraw to Layer 1</h4>
              </div>
              <div className="px-6 py-4">
                <pre className="overflow-x-auto">
                  <code className="text-sm">{`
POST /v1/bridge/withdraw
{
  "qsAddress": "qs1q...",
  "amount": "1.0",
  "btcAddress": "bc1q..."
}
                  `.trim()}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Node Management</h3>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Hardware Requirements</h4>
              <ul className="space-y-3 text-gray-600">
                <li>• 4 CPU cores</li>
                <li>• 8GB RAM minimum</li>
                <li>• 500GB SSD storage</li>
                <li>• Stable internet connection</li>
              </ul>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h4>
              <pre className="overflow-x-auto">
                <code className="text-sm">{`
# config.json
{
  "network": "mainnet",
  "port": 8333,
  "rpc": {
    "port": 8332,
    "host": "localhost"
  }
}
                `.trim()}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* WebSocket API */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">WebSocket API</h3>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4">
              <pre className="overflow-x-auto">
                <code className="text-sm">{`
// Connect to WebSocket
const ws = new WebSocket('ws://api.bitcoinqs.org/ws');

// Subscribe to quantum-safe transactions
ws.send(JSON.stringify({
  method: 'subscribe',
  params: ['get_all_transactions']
}));

// Listen for updates
ws.onmessage = (event) => {
  const tx = JSON.parse(event.data);
  console.log('New QS transaction:', tx);
};
                `.trim()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}