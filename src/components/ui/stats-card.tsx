import { Card } from "./card";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description?: string;
}

export function StatsCard({ icon, title, value, description }: StatsCardProps) {
  return (
    <Card className="flex items-start space-x-4 p-6">
      <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  );
}
