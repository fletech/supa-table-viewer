
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import SummaryCard from '@/components/dashboard/SummaryCard';
import ApplicationsChart from '@/components/dashboard/ApplicationsChart';
import { FileBarChart, Building, MapPin, ListChecks, Archive, Ban } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Application, ApplicationSummary } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<ApplicationSummary>({
    totalApplications: 0,
    positionsApplied: 0,
    activeApplications: 0,
    rejectedApplications: 0,
    archivedApplications: 0,
    offerReceived: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        if (!user?.id) return;
        
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        setApplications(data || []);

        // Calculate summary
        const totalApplications = data?.length || 0;
        const positionsApplied = new Set(data?.map(app => app.position)).size;
        const activeApplications = data?.filter(app => !app.is_archived && app.status !== 'Rejected' && app.status !== 'Declined').length || 0;
        const rejectedApplications = data?.filter(app => app.status === 'Rejected' || app.status === 'Declined').length || 0;
        const archivedApplications = data?.filter(app => app.is_archived).length || 0;
        const offerReceived = data?.filter(app => app.status === 'Got Offer' || app.status === 'Accepted!').length || 0;

        setSummary({
          totalApplications,
          positionsApplied,
          activeApplications,
          rejectedApplications,
          archivedApplications,
          offerReceived,
        });
        
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your applications.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user, toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" />
      <main className="flex-1 container py-6 space-y-8 animate-fade-in">
        <h2 className="text-3xl font-bold tracking-tight">Summary of applications</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SummaryCard 
            title="Total applications made" 
            value={isLoading ? '-' : summary.totalApplications.toString()}
            icon={<FileBarChart className="h-5 w-5" />} 
          />
          <SummaryCard 
            title="Positions applied" 
            value={isLoading ? '-' : summary.positionsApplied.toString()} 
            icon={<Building className="h-5 w-5" />} 
          />
          <SummaryCard 
            title="Active applications" 
            value={isLoading ? '-' : summary.activeApplications.toString()} 
            icon={<ListChecks className="h-5 w-5" />} 
          />
          <SummaryCard 
            title="Offers received" 
            value={isLoading ? '-' : summary.offerReceived.toString()} 
            icon={<MapPin className="h-5 w-5" />} 
          />
          <SummaryCard 
            title="Rejected applications" 
            value={isLoading ? '-' : summary.rejectedApplications.toString()} 
            icon={<Ban className="h-5 w-5" />} 
          />
          <SummaryCard 
            title="Archived applications" 
            value={isLoading ? '-' : summary.archivedApplications.toString()} 
            icon={<Archive className="h-5 w-5" />} 
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start tracking your job applications by adding your first one.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <ApplicationsChart 
              applications={applications} 
              title="Candidatures by status" 
              type="status" 
            />
            <ApplicationsChart 
              applications={applications} 
              title="Candidatures by date" 
              type="date" 
              period={30}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
