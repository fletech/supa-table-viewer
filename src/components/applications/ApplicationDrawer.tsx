import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Building2,
  MapPin,
  ExternalLink,
  Edit,
  Archive,
  ArrowLeft,
  Trash,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Application } from "@/types";
import { format } from "date-fns";
import StatusBadge from "@/components/applications/StatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ApplicationForm from "./ApplicationForm";

interface ApplicationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  mode: "view" | "edit" | "create";
  onApplicationChange?: () => void;
}

const ApplicationDrawer = ({
  isOpen,
  onClose,
  applicationId,
  mode = "view",
  onApplicationChange,
}: ApplicationDrawerProps) => {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      if (!isOpen || !applicationId || mode === "create") {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        if (!user?.id) return;

        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("id", applicationId)
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
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, user, toast, onClose, isOpen, mode]);

  const handleArchive = async () => {
    try {
      if (!application) return;

      const { error } = await supabase
        .from("applications")
        .update({ is_archived: true })
        .eq("id", application.id);

      if (error) throw error;

      toast({
        title: "Aplicación archivada",
        description: "La aplicación ha sido archivada exitosamente.",
      });

      if (onApplicationChange) onApplicationChange();
      onClose();
    } catch (error) {
      console.error("Error archiving application:", error);
      toast({
        title: "Error",
        description: "No se pudo archivar la aplicación.",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async () => {
    try {
      if (!application) return;

      const { error } = await supabase
        .from("applications")
        .update({ is_archived: false })
        .eq("id", application.id);

      if (error) throw error;

      toast({
        title: "Aplicación restaurada",
        description: "La aplicación ha sido restaurada exitosamente.",
      });

      if (onApplicationChange) onApplicationChange();
      onClose();
    } catch (error) {
      console.error("Error restoring application:", error);
      toast({
        title: "Error",
        description: "No se pudo restaurar la aplicación.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (!application) return;

      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", application.id);

      if (error) throw error;

      toast({
        title: "Aplicación eliminada",
        description: "La aplicación ha sido eliminada exitosamente.",
      });

      if (onApplicationChange) onApplicationChange();
      onClose();
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la aplicación.",
        variant: "destructive",
      });
    }
  };

  const handleCreateApplication = async (values: any) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una aplicación.",
        variant: "destructive",
      });
      return;
    }

    const applicationData = {
      ...values,
      user_id: user.id,
      is_archived: false,
      date_applied: values.date_applied.toISOString().split("T")[0],
    };

    const { error } = await supabase
      .from("applications")
      .insert(applicationData);

    if (error) {
      console.error("Error creating application:", error);
      throw error;
    }

    if (onApplicationChange) onApplicationChange();
    onClose();
  };

  const handleUpdateApplication = async (values: any) => {
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

    if (error) {
      console.error("Error updating application:", error);
      throw error;
    }

    if (onApplicationChange) onApplicationChange();
    onClose();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    if (mode === "create") {
      return (
        <>
          <DrawerHeader>
            <DrawerTitle>Agregar nueva aplicación</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <ApplicationForm onSubmit={handleCreateApplication} type="create" />
          </DrawerBody>
        </>
      );
    }

    if (mode === "edit" && application) {
      return (
        <>
          <DrawerHeader>
            <DrawerTitle>Editar aplicación</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <ApplicationForm
              onSubmit={handleUpdateApplication}
              type="edit"
              defaultValues={{
                ...application,
                date_applied: new Date(application.date_applied),
              }}
            />
          </DrawerBody>
        </>
      );
    }

    if (!application) {
      return (
        <>
          <DrawerHeader>
            <DrawerTitle>Aplicación no encontrada</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p className="text-muted-foreground">
              La aplicación que estás buscando no existe o no tienes permiso
              para verla.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={onClose}>Cerrar</Button>
          </DrawerFooter>
        </>
      );
    }

    return (
      <>
        <DrawerHeader>
          <div className="flex justify-between items-start">
            <div>
              <DrawerTitle>{application.company}</DrawerTitle>
              <p className="text-lg mt-1 text-muted-foreground">
                {application.position}
              </p>
            </div>
            <StatusBadge status={application.status} className="ml-auto" />
          </div>
        </DrawerHeader>
        <DrawerBody className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              {application.location}
            </div>

            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Aplicado el{" "}
              {format(new Date(application.date_applied), "dd MMMM, yyyy")}
            </div>

            {application.url && (
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                <a
                  href={application.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Ver oferta de trabajo
                </a>
              </div>
            )}
          </div>

          {application.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Descripción</h3>
              <p className="whitespace-pre-line">{application.description}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Historial de actividad</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium">Creado</p>
                  <p className="text-xs text-muted-foreground">
                    {format(
                      new Date(application.created_at),
                      "dd MMMM yyyy, h:mm a"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1 justify-center sm:justify-start"
              onClick={() => {
                onClose();
                setTimeout(() => {
                  navigate(`/applications/${application.id}/edit`);
                }, 300);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>

            {!application.is_archived ? (
              <Button
                variant="outline"
                className="flex-1 justify-center sm:justify-start text-muted-foreground"
                onClick={handleArchive}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archivar
              </Button>
            ) : (
              <Button
                variant="outline"
                className="flex-1 justify-center sm:justify-start text-muted-foreground"
                onClick={handleRestore}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurar
              </Button>
            )}

            <Button
              variant="destructive"
              className="flex-1 justify-center sm:justify-start"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </DrawerFooter>
      </>
    );
  };

  return (
    <Drawer open={isOpen} onClose={onClose} size="lg">
      {renderContent()}
    </Drawer>
  );
};

export default ApplicationDrawer;
