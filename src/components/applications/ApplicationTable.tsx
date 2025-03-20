import { useState, useEffect } from "react";
import { Application, ApplicationStatus } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "@/components/applications/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Archive,
  Trash,
  RotateCcw,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ApplicationTableProps {
  applications: Application[];
  isLoading: boolean;
  onStatusChange?: (id: string, status: ApplicationStatus) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onRowClick?: (id: string) => void;
  showArchived?: boolean;
  type?: "active" | "rejected" | "archived";
}

const ApplicationTable = ({
  applications,
  isLoading,
  onStatusChange,
  onArchive,
  onDelete,
  onRestore,
  onRowClick,
  showArchived = false,
  type = "active",
}: ApplicationTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Application;
    direction: "asc" | "desc";
  }>({
    key: "date_applied",
    direction: "desc",
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortedApplications, setSortedApplications] = useState<Application[]>(
    []
  );
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const { toast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const uniqueStatuses = Array.from(
          new Set(applications.map((app) => app.status))
        );

        const commonStatuses: ApplicationStatus[] = [
          "Applied",
          "Interviewing",
          "Accepted!",
          "Rejected",
        ];

        const allStatuses = Array.from(
          new Set([...uniqueStatuses, ...commonStatuses])
        );

        setAvailableStatuses(allStatuses);
      } catch (error) {
        console.error("Error fetching statuses:", error);

        setAvailableStatuses([
          "Applied",
          "Screening call",
          "Interviewing",
          "Waiting offer",
          "Got Offer",
          "Accepted!",
          "Declined",
          "Rejected",
          "Error",
        ]);
      }
    };

    fetchStatuses();
  }, [applications]);

  useEffect(() => {
    if (applications.length > 0) {
      const sorted = [...applications].sort((a, b) => {
        if (sortConfig.key === "date_applied") {
          const dateA = new Date(a[sortConfig.key]).getTime();
          const dateB = new Date(b[sortConfig.key]).getTime();
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }
      });
      setSortedApplications(sorted);
    } else {
      setSortedApplications([]);
    }
  }, [applications, sortConfig]);

  const requestSort = (key: keyof Application) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleRowClick = (id: string) => {
    if (onRowClick) {
      onRowClick(id);
    } else {
      navigate(`/applications/${id}`);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(applications.map((app) => app.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: ApplicationStatus
  ) => {
    try {
      if (onStatusChange) {
        onStatusChange(id, newStatus);
        return;
      }

      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `The application has been updated to "${newStatus}"`,
      });

      window.location.reload();
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Could not update the application status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.length === applications.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplications.map((application) => (
            <TableRow
              key={application.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(application.id)}
            >
              <TableCell className="w-12">
                <Checkbox
                  checked={selectedRows.includes(application.id)}
                  onCheckedChange={(checked: boolean) =>
                    handleSelectRow(checked, application.id)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell className="font-medium">
                {application.company}
              </TableCell>
              <TableCell>{application.position}</TableCell>
              <TableCell>{formatDate(application.date_applied)}</TableCell>
              <TableCell>
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer">
                        <StatusBadge status={application.status} />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {availableStatuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() =>
                            handleStatusChange(
                              application.id,
                              status as ApplicationStatus
                            )
                          }
                          className="flex items-center gap-2"
                        >
                          {status === application.status && (
                            <Check className="h-4 w-4" />
                          )}
                          <StatusBadge status={status} />
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
              <TableCell>{application.location}</TableCell>
              <TableCell className="text-right">
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {application.url && (
                        <DropdownMenuItem asChild>
                          <a
                            href={application.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center cursor-pointer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Open URL</span>
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/applications/${application.id}/edit`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>

                      {type !== "archived" && onArchive && (
                        <DropdownMenuItem
                          onClick={() => onArchive(application.id)}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          <span>Archive</span>
                        </DropdownMenuItem>
                      )}

                      {type === "archived" && onRestore && (
                        <DropdownMenuItem
                          onClick={() => onRestore(application.id)}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          <span>Restore</span>
                        </DropdownMenuItem>
                      )}

                      {type === "archived" && onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(application.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {applications.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No applications found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const TableSkeleton = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
};

export default ApplicationTable;
