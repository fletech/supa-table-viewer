import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import Header from "@/components/layout/Header";

const Settings = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Configuración"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Configuración", href: "/settings" },
        ]}
      />
      <main className="flex-1 container py-6 space-y-8 animate-fade-in">
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Administra tu información personal y preferencias de cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Esta sección estará disponible próximamente.
              </p>
              <Button variant="outline" disabled>
                Editar perfil
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Configura cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Esta sección estará disponible próximamente.
              </p>
              <Button variant="outline" disabled>
                Configurar notificaciones
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>
                Administra tu contraseña y opciones de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Esta sección estará disponible próximamente.
              </p>
              <Button variant="outline" disabled>
                Cambiar contraseña
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
