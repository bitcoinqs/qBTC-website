import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FAQSection from '../components/FAQSection';
import ContactSupportModal from '../components/ContactSupportModal';
import { generalFAQs, technicalFAQs, walletFAQs } from '../data/faqData';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Filter FAQs based on search query
  const filterFAQs = (items: typeof generalFAQs) => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      item => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-4 text-xl text-gray-500">
            Find answers to common questions about qBTC
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-8">
          <FAQSection title="General Questions" items={filterFAQs(generalFAQs)} />
          <FAQSection title="Technical Questions" items={filterFAQs(technicalFAQs)} />
          <FAQSection title="Wallet & Security" items={filterFAQs(walletFAQs)} />
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-lg font-medium text-gray-900">Still have questions?</h2>
          <p className="mt-2 text-gray-500">
            If you cannot find the answer to your question, our support team is here to help.
          </p>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
          >
            Contact Support
          </button>
        </div>
      </div>

      <ContactSupportModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}