import React, { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, DollarSign } from 'lucide-react';

type Exchange = {
  name: string;
  logo: string;
  price: number;
  volume24h: number;
  change24h: number;
  pairs: string[];
  url: string;
};

const mockExchanges: Exchange[] = [
  {
    name: 'Binance',
    logo: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    price: 2145.67,
    volume24h: 156789234,
    change24h: 5.23,
    pairs: ['USDT', 'BTC', 'ETH'],
    url: 'https://binance.com/trade/BQT',
  },
  {
    name: 'Coinbase',
    logo: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    price: 2147.89,
    volume24h: 98765432,
    change24h: 5.45,
    pairs: ['USD', 'BTC'],
    url: 'https://coinbase.com/trade/BQT',
  },
  {
    name: 'Kraken',
    logo: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    price: 2144.32,
    volume24h: 45678912,
    change24h: 5.12,
    pairs: ['EUR', 'USD', 'BTC'],
    url: 'https://kraken.com/trade/BQT',
  },
  {
    name: 'KuCoin',
    logo: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    price: 2146.54,
    volume24h: 34567891,
    change24h: 5.34,
    pairs: ['USDT', 'BTC'],
    url: 'https://kucoin.com/trade/BQT',
  },
];

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'volume' | 'change'>('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchExchangeData();
    const interval = setInterval(fetchExchangeData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchExchangeData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setExchanges(mockExchanges);
    } catch (error) {
      console.error('Failed to fetch exchange data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedExchanges = [...exchanges].sort((a, b) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'price':
        return (a.price - b.price) * factor;
      case 'volume':
        return (a.volume24h - b.volume24h) * factor;
      case 'change':
        return (a.change24h - b.change24h) * factor;
      default:
        return 0;
    }
  });

  const handleSort = (type: 'price' | 'volume' | 'change') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Exchange Listings</h1>
          <p className="mt-4 text-xl text-gray-500">
            Track BitcoinQT prices across major exchanges
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exchange
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price (USD)
                      <DollarSign className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('volume')}
                  >
                    <div className="flex items-center">
                      24h Volume
                      <TrendingUp className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('change')}
                  >
                    <div className="flex items-center">
                      24h Change
                      <TrendingUp className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trading Pairs
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                          </div>
                          <div className="ml-4">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  sortedExchanges.map((exchange) => (
                    <tr key={exchange.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={exchange.logo} alt={exchange.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{exchange.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${exchange.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${exchange.volume24h.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          exchange.change24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {exchange.change24h >= 0 ? '+' : ''}{exchange.change24h}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {exchange.pairs.map((pair) => (
                            <span
                              key={pair}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              BQT/{pair}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href={exchange.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-600 inline-flex items-center"
                        >
                          Trade
                          <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-orange-50 border-l-4 border-orange-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">Price Information</h3>
              <div className="mt-2 text-sm text-orange-700">
                <p>Prices and trading volumes are updated every 30 seconds. Click on column headers to sort the data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}