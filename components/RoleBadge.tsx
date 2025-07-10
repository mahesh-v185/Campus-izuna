import React from 'react';
import { UserRole } from '../types';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const roleStyles = {
    [UserRole.STUDENT]: 'bg-sky-500/20 text-sky-300',
    [UserRole.FACULTY]: 'bg-purple-500/20 text-purple-300',
    [UserRole.ADMIN]: 'bg-green-500/20 text-green-300',
  };

  return (
    <span
      className={`px-2 py-0.5 text-xs font-semibold rounded-md ${roleStyles[role]} ${className}`}
    >
      {role}
    </span>
  );
};

export default RoleBadge;