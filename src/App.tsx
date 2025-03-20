import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Applications from "./pages/Applications";
import ApplicationNew from "./pages/ApplicationNew";
import ApplicationDetail from "./pages/ApplicationDetail";
import ApplicationEdit from "./pages/ApplicationEdit";
import Archived from "./pages/Archived";
import Settings from "./pages/Settings";
import AI from "./pages/AI";
import CV from "./pages/CV";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<ApplicationNew />} />
                <Route
                  path="/applications/:id"
                  element={<ApplicationDetail />}
                />
                <Route
                  path="/applications/:id/edit"
                  element={<ApplicationEdit />}
                />
                <Route path="/archived" element={<Archived />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/ai" element={<AI />} />
                <Route path="/cv" element={<CV />} />
              </Route>
            </Route>

            {/* Ruta para páginas no encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
