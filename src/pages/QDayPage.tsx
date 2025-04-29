import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

import bitcointalkImage from '../assets/bitcointalk.jpg';

export default function QDayPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">What is Q Day</h1>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="mb-4 text-gray-700">
            Bitcoin’s security depends on cryptography that classical computers cannot break, as finding a private key would take longer than the age of the universe. 
            </p>
            
            <p className="mb-4 text-gray-700">
            This allows users to trust mathematical laws for asset security without third parties, assuming proper security practices. However, quantum computers using Shor’s algorithm could derive private keys from public keys, threatening Bitcoin’s security even with perfect user practices. 
            </p>

            <p className="mb-4 text-gray-700">Q-Day is the anticipated future moment when quantum computers gain the power to break these cryptographic algorithms.
            </p>
            <p className="mb-4 text-gray-700">The future of Bitcoin is Quantum Safe Secure your Bitcoin against quantum threats with Quantum Safe Bitcoin qBTC. The first Quantum Safe Proof of Work roll up designed to protect your Bitcoin in the quantum era.
            </p>
            {/* Bitcointalk Image */}
            <div className="mt-12">
              <img 
                src={bitcointalkImage} 
                alt="Bitcointalk Community" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <br></br>


            


        





          </div>
        </div>

        
      </div>
    </div>
  );
} 