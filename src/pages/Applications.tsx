import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Archive,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import ApplicationTable from "@/components/applications/ApplicationTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApplications } from "@/hooks/useApplications.ts";
import Header from "@/components/layout/Header";

const statusFilters = [
  { value: "all", label: "All", icon: Briefcase },
  { value: "active", label: "Active", icon: Clock },
  { value: "accepted", label: "Accepted", icon: CheckCircle },
  { value: "rejected", label: "Rejected", icon: XCircle },
  { value: "archived", label: "Archived", icon: Archive },
];

export default function Applications() {
  const navigate = useNavigate();
  const location = useLocation();

  const getStatusFilterFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("status") || "all";
  };

  const [statusFilter, setStatusFilter] = useState(getStatusFilterFromUrl());
  const {
    applications,
    isLoading,
    isBackgroundLoading,
    refreshApplications,
    clearCache,
  } = useApplications();

  useEffect(() => {
    setStatusFilter(getStatusFilterFromUrl());
  }, [location.search]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);

    // Update URL without reloading the page
    const searchParams = new URLSearchParams(location.search);
    if (value === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", value);
    }

    const newUrl = `${location.pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    navigate(newUrl, { replace: true });
  };

  const stats = {
    total: applications.length,
    active: applications.filter((app) => app.status === "Applied").length,
    accepted: applications.filter((app) => app.status === "Accepted!").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
    archived: applications.filter((app) => app.is_archived).length,
  };

  const handleRowClick = (id: string) => {
    navigate(`/applications/${id}`);
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return app.status === "Applied";
    if (statusFilter === "accepted") return app.status === "Accepted!";
    if (statusFilter === "rejected") return app.status === "Rejected";
    if (statusFilter === "archived") return app.is_archived;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Applications"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Applications", href: "/applications" },
        ]}
      />
      <main className="flex-1 container py-6 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
            <p className="text-muted-foreground">
              Manage all your job applications in one place
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={clearCache}
              title="Clear cache"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={refreshApplications}
              disabled={isLoading || isBackgroundLoading}
              title="Refresh data"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isBackgroundLoading ? "animate-spin" : ""
                }`}
              />
            </Button>
            <Button onClick={() => navigate("/applications/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            icon={<Briefcase className="h-4 w-4" />}
            title="Total Applications"
            value={stats.total}
          />
          <StatsCard
            icon={<Clock className="h-4 w-4" />}
            title="In Progress"
            value={stats.active}
          />
          <StatsCard
            icon={<CheckCircle className="h-4 w-4" />}
            title="Accepted"
            value={stats.accepted}
          />
          <StatsCard
            icon={<XCircle className="h-4 w-4" />}
            title="Rejected"
            value={stats.rejected}
          />
        </div>

        {/* Status Filters */}
        <Tabs
          value={statusFilter}
          onValueChange={handleStatusFilterChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            {statusFilters.map((filter) => (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                className="flex items-center space-x-2"
              >
                <filter.icon className="h-4 w-4" />
                <span>{filter.label}</span>
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {filter.value === "all"
                    ? stats.total
                    : filter.value === "active"
                    ? stats.active
                    : filter.value === "accepted"
                    ? stats.accepted
                    : filter.value === "rejected"
                    ? stats.rejected
                    : stats.archived}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Applications Table */}
        <ApplicationTable
          applications={filteredApplications}
          isLoading={isLoading}
          onRowClick={handleRowClick}
        />
      </main>
    </div>
  );
}
