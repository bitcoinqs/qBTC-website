import React from 'react';
import { Linkedin } from 'lucide-react';
import type { TeamMember } from '../types/team';

type Props = {
  member: TeamMember;
};

export default function TeamMemberCard({ member }: Props) {
  return (
    <div className="flex flex-col items-center text-center max-w-[280px] mx-auto">
      {/* Circular Image */}
      <div className="w-24 h-24 md:w-32 md:h-32 mb-4 flex-shrink-0">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Name and Role - Fixed Height */}
      <div className="min-h-[4rem] flex flex-col justify-center mb-2">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-1">
          {member.name}
        </h3>
        <p className="text-xs md:text-sm text-orange-500 line-clamp-1">
          {member.role}
        </p>
      </div>

      {/* Bio - Fixed Height */}
      <div className="min-h-[3rem] mb-4">
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
          {member.bio}
        </p>
      </div>

      {/* LinkedIn Link */}
      {member.linkedin && (
        <div className="mt-auto">
          <a
            href={member.linkedin}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
          </a>
        </div>
      )}
    </div>
  );
}