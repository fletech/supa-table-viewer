import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Application, ApplicationStatus } from "@/types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

// Define all possible application statuses
const allStatuses: ApplicationStatus[] = [
  "Applied",
  "Screening call",
  "Interviewing",
  "Waiting offer",
  "Got Offer",
  "Accepted!",
  "Declined",
  "Rejected",
  "Error",
];

const formSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().min(1, "Location is required"),
  date_applied: z.date(),
  status: z.enum(allStatuses as [string, ...string[]]),
  url: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  type: "create" | "edit";
  defaultValues?: Partial<FormValues>;
}

const ApplicationForm = ({
  onSubmit,
  type,
  defaultValues,
}: ApplicationFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [availableStatuses, setAvailableStatuses] =
    useState<ApplicationStatus[]>(allStatuses);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch unique statuses from existing applications
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const { data, error } = await supabase
          .from("applications")
          .select("status")
          .order("status");

        if (error) throw error;

        if (Array.isArray(data) && data.length > 0) {
          // Extract unique statuses
          const uniqueStatuses = Array.from(
            new Set(data.map((item) => item.status))
          ) as ApplicationStatus[];

          // Ensure common statuses are always available
          const commonStatuses: ApplicationStatus[] = [
            "Applied",
            "Interviewing",
            "Accepted!",
            "Rejected",
          ];

          const mergedStatuses = Array.from(
            new Set([...uniqueStatuses, ...commonStatuses])
          ) as ApplicationStatus[];

          setAvailableStatuses(mergedStatuses);
        }
      } catch (error) {
        console.error("Error fetching statuses:", error);
        // Fallback to default statuses
        setAvailableStatuses(allStatuses);
      }
    };

    fetchStatuses();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      position: "",
      location: "",
      date_applied: new Date(),
      status: "Applied",
      url: "",
      description: "",
      ...defaultValues,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsPending(true);

      // Normalizar la fecha para evitar problemas de zona horaria
      const normalizedValues = {
        ...values,
        date_applied: new Date(
          values.date_applied.getFullYear(),
          values.date_applied.getMonth(),
          values.date_applied.getDate(),
          12, // Establecer la hora a mediodía
          0,
          0
        ),
      };

      await onSubmit(normalizedValues);
      form.reset();
      toast({
        title:
          type === "create" ? "Application created" : "Application updated",
        description:
          type === "create"
            ? "Your application has been created successfully."
            : "Your application has been updated successfully.",
      });
      navigate("/applications");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your application.",
        variant: "destructive",
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
                  <Input placeholder="Company name" {...field} />
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
                  <Input placeholder="Job title" {...field} />
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
                  <Input placeholder="City, Country or Remote" {...field} />
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
                <FormLabel>Application Date</FormLabel>
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
                          <span>Select a date</span>
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
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
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableStatuses.map((status) => (
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
                <FormLabel>Job URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/job"
                    type="url"
                    {...field}
                  />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional details about the application"
                  className="resize-none"
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
            onClick={() => navigate("/applications")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : type === "create"
              ? "Create Application"
              : "Update Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicationForm;
