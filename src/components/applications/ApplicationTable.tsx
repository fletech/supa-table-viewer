
import { useState, useEffect } from 'react';
import { Application } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import StatusBadge from '@/components/applications/StatusBadge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowUpDown, MoreHorizontal, ExternalLink, Edit, Archive, Trash, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface ApplicationTableProps {
  applications: Application[];
  isLoading: boolean;
  onStatusChange?: (id: string, status: Application['status']) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  showArchived?: boolean;
  type?: 'active' | 'rejected' | 'archived';
}

const ApplicationTable = ({ 
  applications, 
  isLoading,
  onStatusChange,
  onArchive,
  onDelete,
  onRestore,
  showArchived = false,
  type = 'active'
}: ApplicationTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Application;
    direction: 'asc' | 'desc';
  }>({
    key: 'date_applied',
    direction: 'desc',
  });
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortedApplications, setSortedApplications] = useState<Application[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (applications.length > 0) {
      const sorted = [...applications].sort((a, b) => {
        if (sortConfig.key === 'date_applied') {
          const dateA = new Date(a[sortConfig.key]).getTime();
          const dateB = new Date(b[sortConfig.key]).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
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
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const handleRowClick = (id: string) => {
    navigate(`/applications/${id}`);
  };

  const handleSelectAll = () => {
    if (selectedRows.length === sortedApplications.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedApplications.map(app => app.id));
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full overflow-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedRows.length === sortedApplications.length && sortedApplications.length > 0} 
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-56">
              <div className="flex items-center">
                COMPANY
                <Button variant="ghost" size="sm" onClick={() => requestSort('company')}>
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                POSITION
                <Button variant="ghost" size="sm" onClick={() => requestSort('position')}>
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                LOCATION
                <Button variant="ghost" size="sm" onClick={() => requestSort('location')}>
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                DATE APPLIED
                <Button variant="ghost" size="sm" onClick={() => requestSort('date_applied')}>
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div className="flex items-center justify-end">
                STATUS
                <Button variant="ghost" size="sm" onClick={() => requestSort('status')}>
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedApplications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No applications found.
              </TableCell>
            </TableRow>
          ) : (
            sortedApplications.map((application) => (
              <TableRow 
                key={application.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(application.id)}
              >
                <TableCell>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedRows.includes(application.id)}
                      onCheckedChange={() => {}}
                      onClick={(e) => handleSelectRow(application.id, e as React.MouseEvent)}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {showArchived && (
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs bg-muted rounded-md">Archived</span>
                    </div>
                  )}
                  <div className="font-medium">{application.company}</div>
                </TableCell>
                <TableCell>{application.position}</TableCell>
                <TableCell>{application.location}</TableCell>
                <TableCell>{format(new Date(application.date_applied), 'dd/MM/yyyy')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <StatusBadge status={application.status} />
                  </div>
                </TableCell>
                <TableCell>
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
                            <a href={application.url} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              <span>Open URL</span>
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => navigate(`/applications/${application.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>

                        {type !== 'archived' && onArchive && (
                          <DropdownMenuItem onClick={() => onArchive(application.id)}>
                            <Archive className="mr-2 h-4 w-4" />
                            <span>Archive</span>
                          </DropdownMenuItem>
                        )}

                        {type === 'archived' && onRestore && (
                          <DropdownMenuItem onClick={() => onRestore(application.id)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            <span>Restore</span>
                          </DropdownMenuItem>
                        )}

                        {type === 'archived' && onDelete && (
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
            ))
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
