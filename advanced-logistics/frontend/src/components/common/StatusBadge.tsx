import React from 'react';
import { getStatusBadgeColor } from '../../utils/formatters';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { bg, text, dot } = getStatusBadgeColor(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full transition-colors ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${bg} ${text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;

