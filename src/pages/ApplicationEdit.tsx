import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Application } from "@/types";
import ApplicationForm from "@/components/applications/ApplicationForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Header from "@/components/layout/Header";

const ApplicationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setIsLoading(true);
        if (!user?.id || !id) return;

        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (
          data &&
          "id" in data &&
          "created_at" in data &&
          "user_id" in data &&
          "company" in data &&
          "position" in data &&
          "location" in data &&
          "date_applied" in data &&
          "status" in data &&
          "is_archived" in data
        ) {
          setApplication(data as unknown as Application);
        } else {
          throw new Error("Datos de aplicación inválidos");
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar los detalles de la aplicación.",
          variant: "destructive",
        });
        navigate("/applications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id, user, toast, navigate]);

  const handleUpdateApplication = async (values: any) => {
    try {
      if (!user || !application) {
        toast({
          title: "Error",
          description: "No se pudo actualizar la aplicación.",
          variant: "destructive",
        });
        return;
      }

      const applicationData = {
        ...values,
        date_applied: values.date_applied.toISOString().split("T")[0],
      };

      const { error } = await supabase
        .from("applications")
        .update(applicationData)
        .eq("id", application.id);

      if (error) throw error;

      toast({
        title: "Aplicación actualizada",
        description: "La aplicación ha sido actualizada exitosamente.",
      });

      navigate(`/applications/${application.id}`);
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la aplicación.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header
          title="Editar Aplicación"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Aplicaciones", href: "/applications" },
            { label: "Editar", href: `/applications/${id}/edit` },
          ]}
        />
        <main className="flex-1 container py-6 space-y-8 animate-fade-in">
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header
          title="Aplicación no encontrada"
          breadcrumbs={[
            { label: "Dashboard", href: "/" },
            { label: "Aplicaciones", href: "/applications" },
            { label: "No encontrada", href: "#" },
          ]}
        />
        <main className="flex-1 container py-6 space-y-8 animate-fade-in">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">
              Aplicación no encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              La aplicación que estás buscando no existe o no tienes permiso
              para verla.
            </p>
            <Button onClick={() => navigate("/applications")}>
              Volver a aplicaciones
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Editar Aplicación"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Aplicaciones", href: "/applications" },
          {
            label: application.company,
            href: `/applications/${application.id}`,
          },
          { label: "Editar", href: `/applications/${application.id}/edit` },
        ]}
      />
      <main className="flex-1 container py-6 space-y-8 animate-fade-in">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => navigate(`/applications/${application.id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            Editar aplicación
          </h2>
        </div>

        <div className="bg-card rounded-lg border shadow-sm p-6">
          <ApplicationForm
            onSubmit={handleUpdateApplication}
            type="edit"
            defaultValues={{
              ...application,
              date_applied: new Date(application.date_applied),
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default ApplicationEdit;
