
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Layout = () => {
  const isMobile = useIsMobile();
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div 
        className={`flex-1 ${!isMobile ? 'ml-64' : ''} flex flex-col min-h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}
      >
        <div className="flex-1 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  );
};

export default Layout;
