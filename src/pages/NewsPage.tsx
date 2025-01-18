import React, { useState } from 'react';
import { Calendar, FileText, BookOpen, X } from 'lucide-react';
import bridge from '../assets/bridge.jpeg'

const news = [
 {
    id: 1,
    title: 'Major milestone achieved in Bitcoin Quantum Resistance',
    date: 'Jan 18 2025',
    category: 'Announcement',
    excerpt: 'Successful Bridge Transaction between Bitcoin and BQS Achieved',
    content: 'Bitcoin QS has achieved a major milestone today - we have successfully tested the bridge between testnet Bitcoin and Quantum Safe Bitcoin and back. This marks a landmark achievement for us and shows that it’s technically feasible to wrap Bitcoin and make it Quantum Safe.', 
    image: bridge,
  },/*
  {
    id: 2,
    title: 'Research Paper: Post-Quantum Bitcoin Security',
    date: 'March 18, 2024',
    category: 'Research',
    excerpt: 'New research paper details the implementation of lattice-based cryptography in Bitcoin QS...',
    content: `Our research team has published a comprehensive paper on the implementation of lattice-based cryptography in Bitcoin QS. The paper details our novel approach to securing Bitcoin transactions against quantum threats.

Key Findings:
• Successful implementation of lattice-based signatures
• Performance benchmarks showing minimal overhead
• Compatibility analysis with existing Bitcoin infrastructure
• Future roadmap for quantum-safe cryptocurrencies

The paper has been peer-reviewed and accepted for publication in leading cryptography journals.`,
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80',
  },*/
  {
    id: 3,
    title: 'Bitcoin QS Testnet Update',
    date: 'Jan 7 2025',
    category: 'Development',
    excerpt: 'Initial testnet results show promising performance metrics for quantum-safe transactions...',
    content: `The Bitcoin QS testnet is under heavy development. The team has been succesful in acheiving the following milestones:

Highlights:
• Feasibility / cypher selection - Dilithium shortlisted
• Creation of non-custodial in-browser library for signing of transactions
• Creation of node infrastructure for transaction validation
• Creation of web wallet using websockets for real time transaction and balance updates.

We remain on track to launch the Bitcoin QS testnet on the first week of February 2025.

Furthermore, we are in the process of assembling our scientific advisory board comprised of world class cryptogrpahers in Quantum Security.

We've also identified areas for optimization and are implementing improvements based on community feedback.`,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2232&q=80',
  },
];

function NewsModal({ article, onClose }: { article: typeof news[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-2xl font-semibold text-gray-900">{article.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <img
              src={article.image}
              alt={article.title}
              className="rounded-lg object-cover w-full h-64"
            />
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {article.date}
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {article.category}
            </div>
          </div>
          <div className="prose max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-600">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [selectedArticle, setSelectedArticle] = useState<typeof news[0] | null>(null);

  // Calculate grid layout based on number of articles
  const getGridClass = (count: number) => {
    if (count === 1) return 'md:max-w-lg mx-auto';
    if (count === 2) return 'md:grid-cols-2 md:max-w-3xl mx-auto';
    return 'md:grid-cols-3'; // For 3 or more articles
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {selectedArticle && (
        <NewsModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Latest News</h1>
          <p className="mt-4 text-xl text-gray-500">Stay updated with Bitcoin QS developments</p>
        </div>

        <div className={`grid grid-cols-1 gap-8 ${getGridClass(news.length)}`}>
          {news.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={article.image}
                  alt={article.title}
                  className="object-cover w-full h-48"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {article.date}
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    {article.category}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">{article.excerpt}</p>
                <button className="mt-4 text-orange-500 hover:text-orange-600 font-medium flex items-center">
                  Read more
                  <BookOpen className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}