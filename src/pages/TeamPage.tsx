import React from 'react';
import TeamSection from '../components/TeamSection';
import CompanySection from '../components/CompanySection';
import { coreTeam, advisors } from '../data/teamData';
import { investors, partners } from '../data/companyData';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      

      <TeamSection
          title="Quantum Bitcoin Team"
          description="Industry experts guiding our strategic and technical decisions"
          members={advisors}
        />
      <TeamSection
          title="Quantum Bitcoin Advisory Board"
          description="Leaders in blockchain, cryptography, and quantum computing"
          members={coreTeam}
        /> 
        <CompanySection
          title="Backed By"
          description="Leading investors in blockchain and quantum computing"
          companies={investors}
        />

        <CompanySection
          title=""
          description=""
          companies={partners}
        /> 

      </div>
    </div>
  );
}