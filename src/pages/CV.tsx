import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Upload, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";

const CV = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="CV Builder"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "CV Builder", href: "/cv" },
        ]}
      />
      <main className="flex-1 container py-6 space-y-8 animate-fade-in">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold tracking-tight">CV Builder</h2>
          <Badge
            variant="secondary"
            className="ml-3 bg-primary/10 text-primary"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            PRO
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Crear CV</CardTitle>
              <CardDescription>
                Crea un CV profesional optimizado para tus aplicaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Nuestro constructor de CV te permite crear un currículum
                profesional adaptado a cada puesto al que aplicas.
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Crear nuevo CV
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Subir CV existente
                </Button>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Esta función estará disponible próximamente para usuarios PRO.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mis CVs</CardTitle>
              <CardDescription>
                Gestiona tus currículums guardados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 border border-dashed rounded-md">
                <div className="text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No tienes CVs guardados
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Crea tu primer CV para verlo aquí
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar plantilla
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Optimizador de CV con AI</CardTitle>
              <CardDescription>
                Mejora tu CV con sugerencias basadas en inteligencia artificial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Características</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Análisis de palabras clave para cada oferta</li>
                    <li>Sugerencias de mejora para cada sección</li>
                    <li>Adaptación automática a diferentes industrias</li>
                    <li>Múltiples plantillas profesionales</li>
                    <li>Exportación a PDF, Word y más formatos</li>
                  </ul>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Próximamente</h3>
                  <p className="text-muted-foreground text-sm">
                    Estamos trabajando para ofrecerte la mejor herramienta de
                    creación de CV con asistencia de IA. Esta función estará
                    disponible próximamente para usuarios PRO.
                  </p>
                  <Button className="mt-4" disabled>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Unirse a la lista de espera
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CV;
