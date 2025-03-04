
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ApplicationTable from '@/components/applications/ApplicationTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Application } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        if (!user?.id) return;
        
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_archived', false)
          .not('status', 'in', '("Rejected","Declined")');

        if (error) throw error;
        
        setApplications(data || []);
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

  const handleArchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) throw error;
      
      setApplications(applications.filter(app => app.id !== id));
      
      toast({
        title: 'Application archived',
        description: 'The application has been archived successfully.',
      });
    } catch (error) {
      console.error('Error archiving application:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive the application.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, status: Application['status']) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      
      toast({
        title: 'Status updated',
        description: `Application status changed to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the application status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Active Applications" />
      <main className="flex-1 container py-6 space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Your Applications</h2>
          <Button onClick={() => navigate('/applications/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>

        <ApplicationTable 
          applications={applications} 
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onArchive={handleArchive}
          type="active"
        />
      </main>
    </div>
  );
};

export default Applications;
