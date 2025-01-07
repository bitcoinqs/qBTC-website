import React from 'react';
import TeamMemberCard from './TeamMemberCard';
import type { TeamMember } from '../types/team';

type Props = {
  title: string;
  description: string;
  members: TeamMember[];
};

export default function TeamSection({ title, description, members }: Props) {
  // Calculate grid columns based on number of members
  const getGridClass = (count: number) => {
    if (count === 1) return 'md:grid-cols-1 md:max-w-sm mx-auto';
    if (count === 2) return 'md:grid-cols-2 md:max-w-2xl mx-auto';
    if (count === 3) return 'md:grid-cols-3 md:max-w-4xl mx-auto';
    if (count === 4) return 'md:grid-cols-4 md:max-w-6xl mx-auto';
    return 'md:grid-cols-4'; // For 5+ members, show 4 per row
  };

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      
      <div className={`grid grid-cols-2 gap-8 ${getGridClass(members.length)}`}>
        {members.map((member) => (
          <TeamMemberCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
}