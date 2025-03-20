import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { signInWithGoogle, isLoading } = useAuth();
  const { toast } = useToast();
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsAttemptingLogin(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error("Error en la página de login:", error);
      toast({
        title: "Error de inicio de sesión",
        description:
          "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      setIsAttemptingLogin(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Whapplied</CardTitle>
          <CardDescription>
            Inicia sesión para gestionar tus candidaturas laborales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={isLoading || isAttemptingLogin}
            >
              {isLoading || isAttemptingLogin ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FcGoogle className="h-5 w-5" />
              )}
              Iniciar sesión con Google
            </Button>
          </div>

          {/* Información de solución de problemas */}
          <div className="mt-6 p-4 bg-muted rounded-md text-sm">
            <h3 className="font-medium mb-2">
              Si tienes problemas para iniciar sesión:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Asegúrate de permitir las cookies en tu navegador</li>
              <li>Intenta usar el modo de navegación normal (no incógnito)</li>
              <li>
                Si recibes un error de base de datos, contacta al administrador
              </li>
              <li>Verifica que tu cuenta de Google esté activa</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-muted-foreground">
            Al iniciar sesión, aceptas nuestros términos de servicio y política
            de privacidad.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
