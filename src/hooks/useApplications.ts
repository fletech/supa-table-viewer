import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Application } from "@/types";

type ApplicationRow = Application;

const CACHE_KEY = "whapplied_applications_cache";
const CACHE_TIMESTAMP_KEY = "whapplied_applications_cache_timestamp";

const CACHE_EXPIRATION = 5 * 60 * 1000;

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const saveToCache = (data: Application[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  };

  const getFromCache = (): {
    data: Application[] | null;
    isExpired: boolean;
  } => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (!cachedData || !timestamp) {
        return { data: null, isExpired: true };
      }

      const isExpired = Date.now() - parseInt(timestamp) > CACHE_EXPIRATION;
      return {
        data: JSON.parse(cachedData) as Application[],
        isExpired,
      };
    } catch (error) {
      console.error("Error reading from cache:", error);
      return { data: null, isExpired: true };
    }
  };

  const hasChanges = (
    oldApps: Application[],
    newApps: Application[]
  ): boolean => {
    if (oldApps.length !== newApps.length) return true;

    const oldAppsMap = new Map(oldApps.map((app) => [app.id, app]));

    return newApps.some((newApp) => {
      const oldApp = oldAppsMap.get(newApp.id);
      if (!oldApp) return true; // Nueva aplicación

      return (
        oldApp.company !== newApp.company ||
        oldApp.position !== newApp.position ||
        oldApp.status !== newApp.status ||
        oldApp.date_applied !== newApp.date_applied ||
        oldApp.is_archived !== newApp.is_archived
      );
    });
  };

  const processApplicationData = (data: any[]): Application[] => {
    return data.filter(Boolean).map(
      (item): Application => ({
        id: item.id,
        created_at: item.created_at,
        user_id: item.user_id,
        company: item.company,
        position: item.position,
        location: item.location,
        date_applied: item.date_applied,
        status: item.status,
        url: item.url || undefined,
        description: item.description || undefined,
        is_archived: item.is_archived,
      })
    );
  };

  const fetchApplications = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setIsLoading(true);
        } else {
          setIsBackgroundLoading(true);
        }

        if (!user?.id) return;

        if (showLoading) {
          const { data: cachedData, isExpired } = getFromCache();

          if (cachedData && !isExpired) {
            setApplications(cachedData);
            setIsLoading(false);

            setTimeout(() => fetchApplications(false), 100);
            return;
          }
        }

        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .order("date_applied", { ascending: false })
          .returns<ApplicationRow[]>();

        if (error) throw error;

        if (Array.isArray(data)) {
          const validApplications = processApplicationData(data);

          saveToCache(validApplications);

          if (!showLoading) {
            setApplications((prevApplications) => {
              const hasDataChanged = hasChanges(
                prevApplications,
                validApplications
              );
              if (hasDataChanged) {
                toast({
                  title: "Data updated",
                  description: "Your applications have been updated.",
                });
                return validApplications;
              }
              return prevApplications;
            });
          } else {
            setApplications(validApplications);
          }
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        if (showLoading) {
          toast({
            title: "Error",
            description: "Could not load your applications.",
            variant: "destructive",
          });
        }
      } finally {
        if (showLoading) {
          setIsLoading(false);
        } else {
          setIsBackgroundLoading(false);
        }
      }
    },
    [user, toast]
  );

  useEffect(() => {
    fetchApplications(true);
  }, [fetchApplications]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchApplications(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchApplications]);

  const refreshApplications = () => {
    fetchApplications(true);
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      toast({
        title: "Cache cleared",
        description: "Application cache has been cleared.",
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };

  return {
    applications,
    isLoading,
    isBackgroundLoading,
    refreshApplications,
    clearCache,
  };
}
