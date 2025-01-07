import React from 'react';
import { Shield, Zap, Lock, Cpu } from 'lucide-react';

const features = [
  {
    name: 'Quantum-Resistant Encryption',
    description: 'Future-proof your Bitcoin with post-quantum cryptographic algorithms.',
    icon: Shield,
  },
  {
    name: 'Lightning-Fast Transactions',
    description: 'Experience near-instant settlements with our Layer 2 scaling solution.',
    icon: Zap,
  },
  {
    name: 'Enhanced Privacy',
    description: 'Advanced privacy features to protect your transactions and identity.',
    icon: Lock,
  },
  {
    name: 'Quantum Computing Ready',
    description: 'Built to withstand attacks from future quantum computers.',
    icon: Cpu,
  },
];

export default function Features() {
  return (
    <div className="py-12 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-orange-500 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            The Next Generation of Bitcoin Security
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Bitcoin QS combines cutting-edge quantum resistance with the reliability of Bitcoin's Layer 2 scaling.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}