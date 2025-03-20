import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@/types";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string;
}

const statusColors: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-800",
  "Screening call": "bg-purple-100 text-purple-800",
  Interviewing: "bg-yellow-100 text-yellow-800",
  "Waiting offer": "bg-orange-100 text-orange-800",
  "Got Offer": "bg-pink-100 text-pink-800",
  "Accepted!": "bg-green-100 text-green-800",
  Declined: "bg-gray-100 text-gray-800",
  Rejected: "bg-red-100 text-red-800",
  Error: "bg-red-200 text-red-900",
  default: "bg-gray-100 text-gray-800",
};

export default function StatusBadge({
  status,
  className,
  ...props
}: StatusBadgeProps) {
  const colorClass = statusColors[status] || statusColors.default;

  return (
    <Badge variant="secondary" className={cn(colorClass, className)} {...props}>
      {status}
    </Badge>
  );
}
