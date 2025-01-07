import React from 'react';
import { Wallet, Shield, ExternalLink, Smartphone, Globe } from 'lucide-react';

const wallets = [
 /* {
    name: 'BitcoinQS Core Wallet',
    description: 'Official desktop wallet with full quantum-safe features',
    type: 'Desktop',
    platforms: ['Windows', 'macOS', 'Linux'],
    features: ['Full Node', 'Hardware Wallet Support', 'Quantum-Safe Signatures'],
    url: '#',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80',
    status: 'Official',
  },*/
  {
    name: 'QS Mobile',
    description: 'Secure mobile wallet for BitcoinQS',
    type: 'Mobile',
    platforms: ['iOS', 'Android'],
    features: ['Biometric Security', 'Cloud Backup', 'Hardware wallet support'],
    url: '#',
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80',
    status: 'Coming Soon',
  },
  {
    name: 'QS Web Wallet',
    description: 'Browser-based wallet for easy access',
    type: 'Web',
    platforms: ['All Browsers'],
    features: ['No Installation', 'Cross-Platform', 'Hardware Wallet Support'],
    url: './dashboard',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80',
    status: 'Official',
  },
];

function WalletCard({ wallet }: { wallet: typeof wallets[0] }) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Official':
        return 'bg-orange-100 text-orange-800';
      case 'Coming Soon':
        return 'bg-blue-100 text-blue-800';
      case 'Community':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${
      wallet.status === 'Coming Soon' ? 'opacity-75' : ''
    }`}>
      <div className="h-48 overflow-hidden">
        <img
          src={wallet.image}
          alt={wallet.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{wallet.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(wallet.status)}`}>
            {wallet.status}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{wallet.description}</p>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-500">
            {wallet.type === 'Desktop' && <Shield className="h-4 w-4 mr-2" />}
            {wallet.type === 'Mobile' && <Smartphone className="h-4 w-4 mr-2" />}
            {wallet.type === 'Web' && <Globe className="h-4 w-4 mr-2" />}
            <span>{wallet.type}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {wallet.platforms.map((platform) => (
              <span
                key={platform}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
              >
                {platform}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Key Features:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {wallet.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          {wallet.status !== 'Coming Soon' ? (
            <a
              href={wallet.url}
              className="mt-4 inline-flex items-center text-orange-500 hover:text-orange-600"
            >
              Access <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          ) : (
            <span className="mt-4 inline-flex items-center text-blue-500">
              Available Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WalletsPage() {
  // Calculate grid columns based on number of wallets
  const getGridClass = (count: number) => {
    if (count === 1) return 'md:max-w-lg mx-auto';
    if (count === 2) return 'md:grid-cols-2 md:max-w-3xl mx-auto';
    return 'md:grid-cols-3'; // For 3 or more wallets
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Supported Wallets</h1>
          <p className="mt-4 text-xl text-gray-500">
            Choose from our selection of quantum-safe Bitcoin wallets
          </p>
        </div>

        <div className={`grid grid-cols-1 gap-8 ${getGridClass(wallets.length)}`}>
          {wallets.map((wallet) => (
            <WalletCard key={wallet.name} wallet={wallet} />
          ))}
        </div>

        <div className="mt-12 bg-orange-50 border-l-4 border-orange-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Wallet className="h-5 w-5 text-orange-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Wallet Security Notice</h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>Always download wallets from official sources and verify their authenticity. Keep your recovery phrases safe and never share them with anyone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}