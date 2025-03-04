
import { ApplicationStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Screening call':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Interviewing':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Waiting offer':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'Got Offer':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Accepted!':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500';
      case 'Screening call':
        return 'bg-cyan-500';
      case 'Interviewing':
        return 'bg-emerald-500';
      case 'Waiting offer':
        return 'bg-violet-500';
      case 'Got Offer':
        return 'bg-amber-500';
      case 'Accepted!':
        return 'bg-green-500';
      case 'Declined':
        return 'bg-red-500';
      case 'Rejected':
        return 'bg-rose-500';
      case 'Error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusStyles(),
        className
      )}
    >
      <span className={`w-2 h-2 rounded-full mr-1.5 ${getDotColor()}`} />
      {status}
    </div>
  );
};

export default StatusBadge;
