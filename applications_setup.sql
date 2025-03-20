-- Configuración de la tabla applications y sus permisos
-- Ejecuta este script en el Editor SQL de Supabase

-- 1. Asegurarse de que la tabla applications existe con la estructura correcta
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT NOT NULL,
  date_applied DATE NOT NULL,
  status TEXT NOT NULL,
  url TEXT,
  description TEXT,
  is_archived BOOLEAN DEFAULT FALSE
);

-- 2. Crear un tipo para el estado de la aplicación si no existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
    CREATE TYPE application_status AS ENUM (
      'Applied',
      'Screening call',
      'Interviewing',
      'Waiting offer',
      'Got Offer',
      'Accepted!',
      'Declined',
      'Rejected',
      'Error'
    );
    
    -- Convertir la columna status al nuevo tipo
    ALTER TABLE public.applications 
    ALTER COLUMN status TYPE application_status 
    USING status::application_status;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error al crear o modificar el tipo application_status: %', SQLERRM;
END $$;

-- 3. Configurar permisos para la tabla applications
-- Permitir a los usuarios autenticados leer sus propias aplicaciones
CREATE POLICY "Users can view their own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = user_id);

-- Permitir a los usuarios autenticados insertar sus propias aplicaciones
CREATE POLICY "Users can insert their own applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Permitir a los usuarios autenticados actualizar sus propias aplicaciones
CREATE POLICY "Users can update their own applications"
ON public.applications
FOR UPDATE
USING (auth.uid() = user_id);

-- Permitir a los usuarios autenticados eliminar sus propias aplicaciones
CREATE POLICY "Users can delete their own applications"
ON public.applications
FOR DELETE
USING (auth.uid() = user_id);

-- 4. Habilitar RLS (Row Level Security) para la tabla applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 5. Crear un índice para mejorar el rendimiento de las consultas por user_id
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Configuración de la tabla applications completada correctamente.';
END $$; 