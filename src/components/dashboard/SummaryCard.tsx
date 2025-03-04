
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

const SummaryCard = ({ title, value, icon, description, className }: SummaryCardProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
