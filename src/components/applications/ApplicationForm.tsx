
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Application, ApplicationStatus } from '@/types';
import { useNavigate } from 'react-router-dom';

const applicationFormSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  date_applied: z.date({
    required_error: 'Date applied is required',
  }),
  status: z.enum([
    'Applied',
    'Screening call',
    'Interviewing',
    'Waiting offer',
    'Got Offer',
    'Accepted!',
    'Declined',
    'Rejected',
    'Error',
  ]),
  url: z.string().url('Please enter a valid URL').or(z.string().length(0)).optional(),
  description: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

interface ApplicationFormProps {
  defaultValues?: Partial<ApplicationFormValues>;
  onSubmit: (values: ApplicationFormValues) => Promise<void>;
  isLoading?: boolean;
  type: 'create' | 'edit';
}

const statusOptions: ApplicationStatus[] = [
  'Applied',
  'Screening call',
  'Interviewing',
  'Waiting offer',
  'Got Offer',
  'Accepted!',
  'Declined',
  'Rejected',
  'Error',
];

const ApplicationForm = ({ 
  defaultValues, 
  onSubmit,
  isLoading = false,
  type
}: ApplicationFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: defaultValues || {
      company: '',
      position: '',
      location: '',
      date_applied: new Date(),
      status: 'Applied',
      url: '',
      description: '',
    },
  });

  const handleSubmit = async (values: ApplicationFormValues) => {
    try {
      setIsPending(true);
      await onSubmit(values);
      toast({
        title: type === 'create' ? 'Application created' : 'Application updated',
        description: type === 'create' 
          ? 'Your application has been created successfully.' 
          : 'Your application has been updated successfully.',
      });
      navigate('/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: 'There was a problem submitting your application.',
        variant: 'destructive',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Enter position" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_applied"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date Applied</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes or details about this application..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/applications')}
            disabled={isPending || isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || isLoading}>
            {isPending || isLoading ? 'Saving...' : type === 'create' ? 'Create Application' : 'Update Application'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicationForm;
