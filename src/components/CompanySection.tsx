import React from 'react';
import type { Company } from '../data/companyData';

type Props = {
  title: string;
  description: string;
  companies: Company[];
};

export default function CompanySection({ title, description, companies }: Props) {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        
        <div className="mt-12">
          <div className={`grid ${companies.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-2 md:grid-cols-4'} gap-8`}>
            {companies.map((company) => (
              <a
                key={company.name}
                href={company.website}
                className="col-span-1 flex justify-center items-center py-8 px-8 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="max-h-12"
                  src={company.logo}
                  alt={company.name}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}