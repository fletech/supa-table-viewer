
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Calendar, Building2, MapPin, ExternalLink, Edit, Archive, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Application } from '@/types';
import { format } from 'date-fns';
import StatusBadge from '@/components/applications/StatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setIsLoading(true);
        if (!user?.id || !id) return;
        
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setApplication(data);
      } catch (error) {
        console.error('Error fetching application:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the application details.',
          variant: 'destructive',
        });
        navigate('/applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id, user, toast, navigate]);

  const handleArchive = async () => {
    try {
      if (!application) return;
      
      const { error } = await supabase
        .from('applications')
        .update({ is_archived: true })
        .eq('id', application.id);

      if (error) throw error;
      
      toast({
        title: 'Application archived',
        description: 'The application has been archived successfully.',
      });
      
      navigate('/applications');
    } catch (error) {
      console.error('Error archiving application:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive the application.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Application Details" />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Application Not Found" />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Application Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The application you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button onClick={() => navigate('/applications')}>
              Back to Applications
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Application Details" />
      <main className="flex-1 container py-6 animate-fade-in">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6 -ml-2"
          onClick={() => navigate('/applications')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{application.company}</CardTitle>
                    <CardDescription className="text-lg mt-1">
                      {application.position}
                    </CardDescription>
                  </div>
                  <StatusBadge status={application.status} className="ml-auto" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {application.location}
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Applied on {format(new Date(application.date_applied), 'MMMM d, yyyy')}
                </div>

                {application.url && (
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a 
                      href={application.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View job posting
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {application.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{application.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate(`/applications/${application.id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Application
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full justify-start text-muted-foreground"
                  onClick={handleArchive}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Application
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity History</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        Created
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(application.created_at), 'MMMM d, yyyy, h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicationDetail;
