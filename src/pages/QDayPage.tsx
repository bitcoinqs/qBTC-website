import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

import bitcointalkImage from '../assets/bitcointalk.jpg';

// Importar imágenes de tweets
import tweet1 from '../assets/tweets/1.jpg';
import tweet2 from '../assets/tweets/2.jpg';
import tweet3 from '../assets/tweets/3.jpg';
import tweet4 from '../assets/tweets/4.jpg';
import tweet5 from '../assets/tweets/5.jpg';
import tweet6 from '../assets/tweets/6.jpg';
import tweet7 from '../assets/tweets/7.jpg';
import tweet8 from '../assets/tweets/8.jpg';

const tweets = [tweet1, tweet2, tweet3, tweet4, tweet5, tweet6, tweet7, tweet8];

export default function QDayPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % tweets.length);
    }, 3000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">What is Q Day</h1>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="mb-4 text-gray-700">
              Bitcoin's security depends on cryptography that classical computers cannot break, as finding a private key would take longer than the age of the universe. 
            </p>
            
            <p className="mb-4 text-gray-700">
              This allows users to trust mathematical laws for asset security without third parties, assuming proper security practices. However, quantum computers using Shor's algorithm could derive private keys from public keys, threatening Bitcoin's security even with perfect user practices. 
            </p>

            <p className="mb-4 text-gray-700">
              Q-Day is the anticipated future moment when quantum computers gain the power to break these cryptographic algorithms.
            </p>
            <p className="mb-4 text-gray-700">
              The future of Bitcoin is Quantum Safe Secure your Bitcoin against quantum threats with Quantum Safe Bitcoin qBTC. The first Quantum Safe Proof of Work roll up designed to protect your Bitcoin in the quantum era.
            </p>
            
            {/* Bitcointalk Image */}
            <div className="mt-12">
              <img 
                src={bitcointalkImage} 
                alt="Bitcointalk Community" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Tweet Banner */}
            <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-xl p-4">
              <div className="flex justify-center items-center">
                <img 
                  src={tweets[currentIndex]} 
                  alt={`Tweet ${currentIndex + 1}`}
                  className="h-64 w-auto rounded-lg shadow-md transition-opacity duration-500"
                />
              </div>
              <div className="flex justify-center mt-4 space-x-2">
                {tweets.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 