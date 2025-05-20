import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, AlertTriangle, X } from 'lucide-react';

import bitcointalkImage from '../assets/tweets/11.jpg';
import introVideo from '../assets/video/qbtcintro.mp4';

// Importar imágenes de tweets
import tweet1 from '../assets/tweets/1.jpg';
import tweet2 from '../assets/tweets/2.jpg';
import tweet3 from '../assets/tweets/3.jpg';
import tweet4 from '../assets/tweets/4.jpg';
import tweet5 from '../assets/tweets/5.jpg';
import tweet6 from '../assets/tweets/6.jpg';
//import tweet7 from '../assets/tweets/7.jpg';
import tweet8 from '../assets/tweets/8.jpg';
import tweet9 from '../assets/tweets/9.jpg';
import tweet10 from '../assets/tweets/10.jpg';
import tweet12 from '../assets/tweets/12.jpg';
const tweets = [tweet1, tweet2, tweet3, tweet4, tweet5, tweet6, tweet8, tweet9, tweet10, tweet12];

export default function QDayPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % tweets.length);
    }, 6000); // Change every 6 seconds tweets picture box

    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedQDay');
    if (!hasVisited) {
      setShowVideoModal(true);
      localStorage.setItem('hasVisitedQDay', 'true');
    }

    return () => clearInterval(interval);
  }, []);

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowVideoModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 overflow-hidden shadow-2xl">
            <div className="p-4 bg-orange-600 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Donalrd Trump's 41st United States Secretary of Commerce - Howard W. Lutnick</h2>
              <button 
                onClick={closeModal}
                className="p-1 hover:bg-orange-700 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <video 
                ref={videoRef}
                controls
                autoPlay
                className="w-full"
              >
                <source src={introVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

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

            <div className="mt-16 flex justify-center">
              <div className="bg-white rounded-lg max-w-4xl w-full overflow-hidden shadow-2xl">
                <div className="p-4 bg-orange-600 text-white flex justify-between items-center">
                  <h2 className="text-xl font-bold">Donalrd Trump's 41st United States Secretary of Commerce - Howard W. Lutnick</h2>
                </div>
                <div className="p-4">
                  <video 
                    ref={videoRef}
                    controls
                    className="w-full"
                  >
                    <source src={introVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 