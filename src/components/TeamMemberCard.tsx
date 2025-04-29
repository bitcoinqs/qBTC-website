import React, { useState } from 'react';
import { Linkedin, ChevronDown, ChevronUp } from 'lucide-react';
import type { TeamMember } from '../types/team';

type Props = {
  member: TeamMember;
};

export default function TeamMemberCard({ member }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-[320px] mx-auto">
      {/* Image Section */}
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-lg">No image available</div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col h-full">
        {/* Name and Role */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
          <p className="text-sm text-orange-500 font-medium">{member.role}</p>
        </div>

        {/* Bio */}
        <div className="flex-grow">
          <p className={`text-gray-600 text-sm ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {member.bio}
          </p>
          {member.bio.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-orange-500 hover:text-orange-600 text-sm flex items-center"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* LinkedIn Link */}
        {member.linkedin && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href={member.linkedin}
              className="text-gray-600 hover:text-orange-500 transition-colors flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5 mr-2" />
              <span className="text-sm">View LinkedIn Profile</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}