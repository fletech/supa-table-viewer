
import Header from '@/components/layout/Header';
import ApplicationForm from '@/components/applications/ApplicationForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ApplicationNew = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCreateApplication = async (values: any) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create an application.',
        variant: 'destructive',
      });
      return;
    }

    const applicationData = {
      ...values,
      user_id: user.id,
      is_archived: false,
      date_applied: values.date_applied.toISOString().split('T')[0],
    };

    const { error } = await supabase
      .from('applications')
      .insert(applicationData);

    if (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Add New Application" />
      <main className="flex-1 container py-6 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Add New Application</h2>
          
          <ApplicationForm 
            onSubmit={handleCreateApplication}
            type="create"
          />
        </div>
      </main>
    </div>
  );
};

export default ApplicationNew;
