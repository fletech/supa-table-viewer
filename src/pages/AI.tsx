import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";

const AI = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Asistente AI"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Asistente AI", href: "/ai" },
        ]}
      />
      <main className="flex-1 container py-6 space-y-8 animate-fade-in">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold tracking-tight">Asistente AI</h2>
          <Badge
            variant="secondary"
            className="ml-3 bg-primary/10 text-primary"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            PRO
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Asistente de Búsqueda de Empleo</CardTitle>
            <CardDescription>
              Utiliza nuestro asistente AI para mejorar tu búsqueda de empleo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Puedes pedirle al asistente que:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6 text-muted-foreground">
              <li>Mejore tu currículum para un puesto específico</li>
              <li>Genere una carta de presentación personalizada</li>
              <li>Prepare respuestas para entrevistas comunes</li>
              <li>Sugiera habilidades para mejorar tu perfil profesional</li>
            </ul>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="italic text-muted-foreground">
                "Esta función estará disponible próximamente para usuarios PRO.
                Estamos trabajando para ofrecerte la mejor experiencia posible."
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat con el Asistente</CardTitle>
            <CardDescription>
              Haz preguntas y recibe asistencia personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg mb-4 h-64 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                El chat estará disponible próximamente para usuarios PRO.
                <br />
                <span className="text-sm">
                  Estamos trabajando para ofrecerte la mejor experiencia
                  posible.
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Escribe tu mensaje aquí..."
                className="resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled
              />
              <Button size="icon" disabled>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AI;
