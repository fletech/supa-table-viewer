import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isDatabaseError, setIsDatabaseError] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Procesando callback de autenticación...");

        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const queryParams = new URLSearchParams(window.location.search);

        console.log("Hash params:", Object.fromEntries(hashParams.entries()));
        console.log("Query params:", Object.fromEntries(queryParams.entries()));

        const error = hashParams.get("error") || queryParams.get("error");
        const errorDescription =
          hashParams.get("error_description") ||
          queryParams.get("error_description");

        if (error) {
          console.error(
            `Error en la autenticación: ${error}`,
            errorDescription
          );

          if (
            errorDescription?.includes("Database error saving new user") ||
            error === "server_error" ||
            errorDescription?.includes("database")
          ) {
            setIsDatabaseError(true);
            setErrorDetails("Database error saving new user");
          } else {
            setErrorDetails(
              `${error}${errorDescription ? ": " + errorDescription : ""}`
            );
          }

          throw new Error(errorDescription || error);
        }

        if (
          window.location.hash.includes("access_token") ||
          window.location.search.includes("code")
        ) {
          console.log("Detectados tokens en la URL, procesando sesión...");
          const { data, error: sessionError } =
            await supabase.auth.getSession();

          if (sessionError) {
            console.error("Error al obtener la sesión:", sessionError);

            if (
              sessionError.message?.includes("Database error") ||
              sessionError.message?.includes("database")
            ) {
              setIsDatabaseError(true);
              setErrorDetails("Database error saving new user");
            } else {
              setErrorDetails(sessionError.message);
            }

            throw sessionError;
          }

          if (data?.session) {
            console.log(
              "Sesión establecida correctamente:",
              data.session.user?.email
            );
            toast({
              title: "Inicio de sesión exitoso",
              description: "¡Bienvenido de nuevo!",
            });
            navigate("/");
            return;
          }
        }

        console.log("Verificando sesión existente...");
        const {
          data: { session },
          error: getSessionError,
        } = await supabase.auth.getSession();

        if (getSessionError) {
          console.error("Error al verificar la sesión:", getSessionError);
          setErrorDetails(getSessionError.message);
          throw getSessionError;
        }

        if (session) {
          console.log("Sesión existente encontrada:", session.user?.email);
          toast({
            title: "Inicio de sesión exitoso",
            description: "¡Bienvenido de nuevo!",
          });
          navigate("/");
        } else {
          console.error("No se encontró ninguna sesión");
          setErrorDetails("No se pudo establecer la sesión");
          throw new Error("No se pudo iniciar sesión");
        }
      } catch (error: any) {
        console.error("Error en el callback de autenticación:", error);

        if (!errorDetails) {
          setErrorDetails(error.message || "Error desconocido");
        }

        toast({
          title: "Error de autenticación",
          description: `No se pudo completar el inicio de sesión: ${
            error.message || "Error desconocido"
          }`,
          variant: "destructive",
        });

        if (!isDatabaseError) {
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      }
    };

    handleAuthCallback();
  }, [navigate, toast, errorDetails, isDatabaseError]);

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center max-w-md p-6 bg-card rounded-lg shadow-md">
        {errorDetails ? (
          <>
            <h2 className="text-2xl font-semibold mb-2 text-destructive">
              Error de autenticación
            </h2>
            <p className="text-muted-foreground mb-4">
              Ocurrió un error durante el proceso de inicio de sesión:
            </p>
            <div className="bg-destructive/10 p-3 rounded-md text-sm mb-4 text-left">
              <code>{errorDetails}</code>
            </div>

            {isDatabaseError ? (
              <div className="mt-4 space-y-4">
                <p className="text-sm">
                  Este error indica un problema con la base de datos al guardar
                  tu información de usuario. Posibles soluciones:
                </p>
                <ul className="text-sm text-left list-disc pl-5">
                  <li>
                    Verifica que el administrador haya configurado correctamente
                    la base de datos
                  </li>
                  <li>
                    Es posible que ya exista un usuario con el mismo correo
                    electrónico
                  </li>
                  <li>
                    Intenta iniciar sesión más tarde cuando el problema se haya
                    resuelto
                  </li>
                </ul>
                <Button variant="default" className="mt-4" onClick={goToLogin}>
                  Volver a la página de inicio de sesión
                </Button>
              </div>
            ) : (
              <p className="text-sm">
                Serás redirigido a la página de inicio de sesión en unos
                segundos...
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-2">
              Procesando autenticación...
            </h2>
            <p className="text-muted-foreground">
              Por favor espera mientras completamos el proceso de inicio de
              sesión.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
