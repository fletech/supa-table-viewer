import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Application } from "@/types";
import ApplicationTable from "@/components/applications/ApplicationTable";
import { Button } from "@/components/ui/button";
import { RotateCcw, RefreshCw } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Header from "@/components/layout/Header";
import { useApplications } from "@/hooks/useApplications";

const Archived = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { applications, isLoading, isBackgroundLoading, refreshApplications } =
    useApplications();

  const archivedApplications = applications.filter((app) => app.is_archived);

  const handleRestore = async (id: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ is_archived: false })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Application restored",
        description: "The application has been successfully restored.",
      });

      refreshApplications();
    } catch (error) {
      console.error("Error restoring application:", error);
      toast({
        title: "Error",
        description: "Could not restore the application.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Application deleted",
        description: "The application has been successfully deleted.",
      });

      refreshApplications();
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Error",
        description: "Could not delete the application.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Archived Applications"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Archived", href: "/archived" },
        ]}
      />
      <main className="flex-1 container py-6 space-y-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Archived Applications
          </h2>
          <div className="flex gap-2">
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
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate("/applications")}
            >
              <RotateCcw className="h-4 w-4" />
              View Active
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <ApplicationTable
            applications={archivedApplications}
            isLoading={isLoading}
            onRestore={handleRestore}
            onDelete={handleDelete}
            showArchived={true}
            type="archived"
          />
        )}
      </main>
    </div>
  );
};

export default Archived;
