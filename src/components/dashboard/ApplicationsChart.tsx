import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application, ChartDataItem } from "@/types";
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface ApplicationsChartProps {
  applications: Application[];
  title: string;
  type: "status" | "date";
  period?: number; // number of days to look back (for date charts)
  className?: string;
}

const ApplicationsChart = ({
  applications,
  title,
  type,
  period = 30,
  className,
}: ApplicationsChartProps) => {
  const isMobile = useIsMobile();

  const chartData = useMemo(() => {
    if (type === "status") {
      const statusGroups: Record<string, number> = {};
      const archivedGroups: Record<string, number> = {};

      applications.forEach((app) => {
        const key = app.status;
        if (app.is_archived) {
          archivedGroups[key] = (archivedGroups[key] || 0) + 1;
        } else {
          statusGroups[key] = (statusGroups[key] || 0) + 1;
        }
      });

      const statusLabels = Array.from(
        new Set(applications.map((app) => app.status))
      );

      return statusLabels.map((status) => ({
        name: status,
        Actives: statusGroups[status] || 0,
        Archived: archivedGroups[status] || 0,
      }));
    } else {
      // Chart by date
      const today = new Date();
      const startDate = subDays(today, period);

      const dateRange = eachDayOfInterval({
        start: startDate,
        end: today,
      });

      const dateData = dateRange.map((date) => ({
        date: format(date, "dd/MM/yyyy"),
        count: 0,
      }));

      // Count applications per date
      applications.forEach((app) => {
        const appDate = parseISO(app.date_applied);
        if (appDate >= startDate && appDate <= today) {
          const index = dateData.findIndex(
            (d) => d.date === format(appDate, "dd/MM/yyyy")
          );
          if (index !== -1) {
            dateData[index].count += 1;
          }
        }
      });

      return dateData;
    }
  }, [applications, type, period]);

  const yAxisDomain = [0, "auto"] as [number, "auto"];

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-background border rounded-md shadow-md">
          <p className="font-medium text-sm">{`${label}`}</p>
          {payload.map((entry, index) => (
            <div
              key={`item-${index}`}
              className="flex items-center text-xs mt-1"
            >
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: entry.color }}
              />
              <span>{`${entry.name}: ${entry.value}`}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === "status" ? (
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: isMobile ? 0 : 10,
                  bottom: 30,
                }}
                barSize={isMobile ? 10 : 20}
                barGap={8}
                barCategoryGap={16}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  allowDecimals={false}
                  domain={yAxisDomain}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  name="Actives"
                  dataKey="Actives"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  name="Archived"
                  dataKey="Archived"
                  fill="#9CA3AF"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: isMobile ? 0 : 10,
                  bottom: 30,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  allowDecimals={false}
                  domain={yAxisDomain}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  name="Applied"
                  dataKey="count"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#4F46E5" }}
                  activeDot={{ r: 6, fill: "#4F46E5" }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  connectNulls
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsChart;
