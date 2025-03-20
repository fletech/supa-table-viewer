-- Configuración de la tabla profiles y trigger para nuevos usuarios
-- Ejecuta este script en el Editor SQL de Supabase

-- 1. Asegurarse de que la tabla profiles existe con la estructura correcta
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT,
  avatar_url TEXT
);

-- 2. Crear o reemplazar la función que se ejecutará cuando se cree un nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar un nuevo registro en la tabla profiles
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Registrar el error para depuración
    RAISE LOG 'Error en handle_new_user: %', SQLERRM;
    RETURN NEW; -- Continuar incluso si hay un error para no bloquear el registro
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Eliminar el trigger si ya existe para evitar duplicados
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Crear el trigger que ejecutará la función cuando se cree un nuevo usuario
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Configurar permisos para la tabla profiles
-- Permitir a los usuarios autenticados leer su propio perfil
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Permitir a los usuarios autenticados actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- 6. Habilitar RLS (Row Level Security) para la tabla profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 7. Verificar si hay registros huérfanos en auth.users sin perfil correspondiente
-- y crear perfiles para ellos
INSERT INTO public.profiles (id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Configuración de autenticación completada correctamente.';
END $$; 